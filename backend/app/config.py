import os
from dotenv import load_dotenv

from google import genai

load_dotenv()

_api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=_api_key) if _api_key else None

MODEL_NAME = os.getenv("GEMINI_MODEL") or "models/gemini-2.5-flash"