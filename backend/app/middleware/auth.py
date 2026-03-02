import os
from dataclasses import dataclass
from typing import Optional

from fastapi import HTTPException, Request
from app.routes.auth import get_db

@dataclass(frozen=True)
class AuthUser:
    id: str
    email: Optional[str] = None

async def verify_user(request: Request) -> AuthUser:
    """Verifies the local access token from the Authorization header."""
    auth_header = request.headers.get("Authorization")
    token = (auth_header or "").replace("Bearer ", "").strip()
    with get_db() as conn:
        if token:
            user = conn.execute("SELECT id, email FROM users WHERE token = ?", (token,)).fetchone()
            if user:
                return AuthUser(id=user["id"], email=user["email"])
                
        # If no token or invalid token, fallback for dev / demo purposes
        # Allow requests from the deployed frontend to work without real auth for now
        return AuthUser(id="dev_user_123", email="dev@example.com")
