"""
Questrade API service — all authenticated read-only calls go through here.
Automatically refreshes the access token on 401 responses.
"""
import httpx
import os
from typing import Any

import token_store

QUESTRADE_TOKEN_URL = "https://login.questrade.com/oauth2/token"


async def _refresh_tokens() -> None:
    """Exchange refresh token for a new access + refresh token pair."""
    refresh_token = token_store.get_refresh_token()
    if not refresh_token:
        raise RuntimeError("No refresh token stored. Re-authenticate via /auth/questrade.")

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            QUESTRADE_TOKEN_URL,
            params={"grant_type": "refresh_token", "refresh_token": refresh_token},
        )

    if resp.status_code != 200:
        raise RuntimeError(
            f"Token refresh failed ({resp.status_code}). "
            "Re-authenticate via /auth/questrade."
        )

    data = resp.json()
    token_store.set_tokens(
        access_token=data["access_token"],
        refresh_token=data["refresh_token"],
        expires_in=data["expires_in"],
        api_server=data["api_server"],
    )


async def _get(path: str, params: dict | None = None) -> Any:
    """
    Make an authenticated GET request.
    Automatically refreshes the token if expired or if a 401 is returned.
    """
    # Proactively refresh if we know the token is expired
    if token_store.is_token_expired():
        await _refresh_tokens()

    api_server = token_store.get_api_server()
    access_token = token_store.get_access_token()

    if not api_server or not access_token:
        raise RuntimeError("Not authenticated. Visit /auth/questrade to connect.")

    url = f"{api_server}v1/{path.lstrip('/')}"
    headers = {"Authorization": f"Bearer {access_token}"}

    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.get(url, headers=headers, params=params or {})

    # Retry once after refreshing on 401
    if resp.status_code == 401:
        await _refresh_tokens()
        access_token = token_store.get_access_token()
        headers = {"Authorization": f"Bearer {access_token}"}
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(url, headers=headers, params=params or {})

    resp.raise_for_status()
    return resp.json()


# ── Public service functions ──────────────────────────────────────────────────

async def get_accounts() -> list[dict]:
    data = await _get("accounts")
    return data.get("accounts", [])


async def get_positions(account_id: str) -> list[dict]:
    data = await _get(f"accounts/{account_id}/positions")
    positions = data.get("positions", [])
    return [
        {
            "symbol":        p.get("symbol"),
            "symbolId":      p.get("symbolId"),
            "openQuantity":  p.get("openQuantity"),
            "currentPrice":  p.get("currentPrice"),
            "averageEntryPrice": p.get("averageEntryPrice"),
            "closedPnl":     p.get("closedPnl"),
            "openPnl":       p.get("openPnl"),
            "totalCost":     p.get("totalCost"),
            "isRealTime":    p.get("isRealTime"),
            "currency":      p.get("currency"),
        }
        for p in positions
    ]


async def get_balances(account_id: str) -> dict:
    data = await _get(f"accounts/{account_id}/balances")
    # Return the combined-currency balances summary
    combined = data.get("combinedBalances", [])
    per_currency = data.get("perCurrencyBalances", [])
    return {
        "combinedBalances": [
            {
                "currency":      b.get("currency"),
                "cash":          b.get("cash"),
                "marketValue":   b.get("marketValue"),
                "totalEquity":   b.get("totalEquity"),
                "buyingPower":   b.get("buyingPower"),
                "maintenanceExcess": b.get("maintenanceExcess"),
            }
            for b in combined
        ],
        "perCurrencyBalances": [
            {
                "currency":    b.get("currency"),
                "cash":        b.get("cash"),
                "marketValue": b.get("marketValue"),
                "totalEquity": b.get("totalEquity"),
            }
            for b in per_currency
        ],
    }


async def get_orders(account_id: str, state: str = "All") -> list[dict]:
    data = await _get(
        f"accounts/{account_id}/orders",
        params={"stateFilter": state},
    )
    orders = data.get("orders", [])
    return [
        {
            "id":              o.get("id"),
            "symbol":          o.get("symbol"),
            "side":            o.get("side"),
            "type":            o.get("orderType"),
            "totalQuantity":   o.get("totalQuantity"),
            "filledQuantity":  o.get("filledQuantity"),
            "limitPrice":      o.get("limitPrice"),
            "avgExecPrice":    o.get("avgExecPrice"),
            "state":           o.get("state"),
            "creationTime":    o.get("creationTime"),
            "updateTime":      o.get("updateTime"),
            "source":          o.get("source"),
            "currency":        o.get("currency"),
        }
        for o in orders
    ]
