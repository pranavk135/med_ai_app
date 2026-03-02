import os
import sqlite3
import hashlib
import secrets
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# Use an absolute path based on the location of this file to ensure it works on Render
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "healthai.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db() as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE,
                name TEXT,
                password_hash TEXT,
                token TEXT
            )
        ''')
        conn.commit()

init_db()

class AuthRequest(BaseModel):
    email: str
    password: str
    name: str = ""

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@router.post("/signup")
def signup(req: AuthRequest):
    user_id = secrets.token_hex(8)
    token = secrets.token_hex(16)
    hashed = hash_password(req.password)
    
    try:
        with get_db() as conn:
            conn.execute(
                "INSERT INTO users (id, email, name, password_hash, token) VALUES (?, ?, ?, ?, ?)",
                (user_id, req.email, req.name, hashed, token)
            )
            conn.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="User already exists")
    
    return {
        "user": {"id": user_id, "email": req.email, "name": req.name},
        "session": {"access_token": token}
    }

@router.post("/login")
def login(req: AuthRequest):
    hashed = hash_password(req.password)
    with get_db() as conn:
        user = conn.execute(
            "SELECT id, email, name FROM users WHERE email = ? AND password_hash = ?",
            (req.email, hashed)
        ).fetchone()
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid login credentials")
            
        token = secrets.token_hex(16)
        conn.execute("UPDATE users SET token = ? WHERE id = ?", (token, user["id"]))
        conn.commit()
        
    return {
        "user": {"id": user["id"], "email": user["email"], "name": user["name"]},
        "session": {"access_token": token}
    }

@router.get("/me")
def get_me(token: str):
    with get_db() as conn:
        user = conn.execute("SELECT id, email, name FROM users WHERE token = ?", (token,)).fetchone()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"id": user["id"], "email": user["email"], "name": user["name"]}
