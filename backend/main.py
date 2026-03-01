"""
Theoros backend — FastAPI app.

Auth routes:
  GET  /auth/questrade   → redirect to Questrade OAuth consent page
  GET  /auth/callback    → handle OAuth code exchange, store tokens
  POST /auth/refresh     → force-refresh the access token

Data routes (all read-only):
  GET  /questrade/accounts
  GET  /questrade/positions?account_id=...
  GET  /questrade/balances?account_id=...
  GET  /questrade/orders?account_id=...&state=All
"""
import os
from urllib.parse import urlencode

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
import httpx

load_dotenv()

import token_store
from services import questrade as qt

app = FastAPI(title="Theoros API", version="0.1.0")

# Allow the Next.js dev server to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

QUESTRADE_AUTH_URL = "https://login.questrade.com/oauth2/authorize"
QUESTRADE_TOKEN_URL = "https://login.questrade.com/oauth2/token"


# ── Auth routes ───────────────────────────────────────────────────────────────

@app.get("/auth/questrade", tags=["auth"])
def initiate_oauth():
    """
    Redirect the browser to Questrade's OAuth consent page.
    Requests read-only scope only (read_acc).
    """
    client_id = os.environ.get("QUESTRADE_CLIENT_ID")
    redirect_uri = os.environ.get("QUESTRADE_REDIRECT_URI", "http://localhost:8000/auth/callback")

    if not client_id or client_id == "your_client_id_here":
        raise HTTPException(
            status_code=500,
            detail="QUESTRADE_CLIENT_ID is not set. Edit backend/.env.",
        )

    params = urlencode({
        "client_id": client_id,
        "response_type": "code",
        "redirect_uri": redirect_uri,
        "scope": "read_acc",
    })
    return RedirectResponse(url=f"{QUESTRADE_AUTH_URL}?{params}")


@app.get("/auth/callback", tags=["auth"])
async def oauth_callback(code: str = Query(..., description="Authorization code from Questrade")):
    """
    Exchange the authorization code for access + refresh tokens.
    Stores everything in backend/.env automatically.
    """
    client_id = os.environ.get("QUESTRADE_CLIENT_ID")
    redirect_uri = os.environ.get("QUESTRADE_REDIRECT_URI", "http://localhost:8000/auth/callback")

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            QUESTRADE_TOKEN_URL,
            params={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": redirect_uri,
                "client_id": client_id,
            },
        )

    if resp.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=f"Questrade token exchange failed ({resp.status_code}): {resp.text}",
        )

    data = resp.json()
    token_store.set_tokens(
        access_token=data["access_token"],
        refresh_token=data["refresh_token"],
        expires_in=data["expires_in"],
        api_server=data["api_server"],
    )

    return {"status": "authenticated", "expires_in": data["expires_in"]}


@app.post("/auth/refresh", tags=["auth"])
async def force_refresh():
    """Force-refresh the access token using the stored refresh token."""
    refresh_token = token_store.get_refresh_token()
    if not refresh_token:
        raise HTTPException(
            status_code=401,
            detail="No refresh token stored. Visit /auth/questrade to authenticate.",
        )

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            QUESTRADE_TOKEN_URL,
            params={"grant_type": "refresh_token", "refresh_token": refresh_token},
        )

    if resp.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=f"Token refresh failed ({resp.status_code}). Re-authenticate via /auth/questrade.",
        )

    data = resp.json()
    token_store.set_tokens(
        access_token=data["access_token"],
        refresh_token=data["refresh_token"],
        expires_in=data["expires_in"],
        api_server=data["api_server"],
    )

    return {"status": "refreshed", "expires_in": data["expires_in"]}


# ── Questrade data routes ─────────────────────────────────────────────────────

@app.get("/questrade/accounts", tags=["questrade"])
async def accounts():
    """List all Questrade accounts."""
    try:
        return await qt.get_accounts()
    except RuntimeError as e:
        raise HTTPException(status_code=401, detail=str(e))


@app.get("/questrade/positions", tags=["questrade"])
async def positions(account_id: str = Query(..., description="Questrade account number")):
    """Open positions for the given account."""
    try:
        return await qt.get_positions(account_id)
    except RuntimeError as e:
        raise HTTPException(status_code=401, detail=str(e))


@app.get("/questrade/balances", tags=["questrade"])
async def balances(account_id: str = Query(..., description="Questrade account number")):
    """Cash, market value, and total equity for the given account."""
    try:
        return await qt.get_balances(account_id)
    except RuntimeError as e:
        raise HTTPException(status_code=401, detail=str(e))


@app.get("/questrade/orders", tags=["questrade"])
async def orders(
    account_id: str = Query(..., description="Questrade account number"),
    state: str = Query("All", description="Order state filter: All | Open | Closed | Canceled | Partial | Execution | Replace | BrokenExecution | Rejected"),
):
    """Order history for the given account."""
    try:
        return await qt.get_orders(account_id, state=state)
    except RuntimeError as e:
        raise HTTPException(status_code=401, detail=str(e))


# ── Health check ──────────────────────────────────────────────────────────────

@app.get("/health", tags=["meta"])
def health():
    return {
        "status": "ok",
        "authenticated": not token_store.is_token_expired(),
    }
