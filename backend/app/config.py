import os
from dotenv import load_dotenv

from google import genai

load_dotenv()

_api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
_vision_api_key = os.getenv("GEMINI_VISION_API_KEY") or _api_key

client = genai.Client(api_key=_api_key) if _api_key else None
vision_client = genai.Client(api_key=_vision_api_key) if _vision_api_key else client

# Base model fallback
MODEL_NAME = os.getenv("GEMINI_MODEL") or "gemini-2.5-flash"

# Task-specific models
CHAT_MODEL_NAME = os.getenv("GEMINI_CHAT_MODEL") or MODEL_NAME
VISION_MODEL_NAME = os.getenv("GEMINI_VISION_MODEL") or MODEL_NAME