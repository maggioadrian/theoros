"""
Secure token storage — reads and writes token fields directly to .env.
Tokens are never logged or returned in API responses.
"""
import os
import re
from pathlib import Path
from datetime import datetime, timezone

ENV_PATH = Path(__file__).parent / ".env"

_TOKEN_KEYS = {
    "QUESTRADE_ACCESS_TOKEN",
    "QUESTRADE_REFRESH_TOKEN",
    "QUESTRADE_TOKEN_EXPIRY",
    "QUESTRADE_API_SERVER",
}


def _read_env_lines() -> list[str]:
    if not ENV_PATH.exists():
        return []
    return ENV_PATH.read_text().splitlines()


def _write_env_lines(lines: list[str]) -> None:
    ENV_PATH.write_text("\n".join(lines) + "\n")


def set_tokens(
    access_token: str,
    refresh_token: str,
    expires_in: int,
    api_server: str,
) -> None:
    """Write all four token fields into .env, updating in-place."""
    expiry = int(
        datetime.now(timezone.utc).timestamp() + expires_in - 60  # 60s safety margin
    )
    updates = {
        "QUESTRADE_ACCESS_TOKEN": access_token,
        "QUESTRADE_REFRESH_TOKEN": refresh_token,
        "QUESTRADE_TOKEN_EXPIRY": str(expiry),
        "QUESTRADE_API_SERVER": api_server,
    }
    lines = _read_env_lines()
    written: set[str] = set()

    new_lines = []
    for line in lines:
        matched = False
        for key, val in updates.items():
            if re.match(rf"^{key}\s*=", line):
                new_lines.append(f"{key}={val}")
                written.add(key)
                matched = True
                break
        if not matched:
            new_lines.append(line)

    # Append any keys not already present
    for key, val in updates.items():
        if key not in written:
            new_lines.append(f"{key}={val}")

    _write_env_lines(new_lines)

    # Also update the live process environment so subsequent calls see the new values
    os.environ["QUESTRADE_ACCESS_TOKEN"] = access_token
    os.environ["QUESTRADE_REFRESH_TOKEN"] = refresh_token
    os.environ["QUESTRADE_TOKEN_EXPIRY"] = str(expiry)
    os.environ["QUESTRADE_API_SERVER"] = api_server


def get_access_token() -> str | None:
    return os.environ.get("QUESTRADE_ACCESS_TOKEN") or None


def get_refresh_token() -> str | None:
    return os.environ.get("QUESTRADE_REFRESH_TOKEN") or None


def get_api_server() -> str | None:
    server = os.environ.get("QUESTRADE_API_SERVER") or None
    if server and not server.endswith("/"):
        server += "/"
    return server


def is_token_expired() -> bool:
    expiry = os.environ.get("QUESTRADE_TOKEN_EXPIRY")
    if not expiry:
        return True
    try:
        return datetime.now(timezone.utc).timestamp() >= float(expiry)
    except ValueError:
        return True
