import json
from fastapi import FastAPI
from pydantic import BaseModel
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

genai.configure(api_key="YOUR_GEMINI_API_KEY")
model = genai.GenerativeModel("gemini-1.5-flash")

conversation_store = {}

class HealthChat(BaseModel):
    user_id: str
    message: str


SYSTEM_PROMPT = """
You are CareFlow AI — a professional health assistant.

RULES:
- Ask follow-up questions before concluding.
- Do NOT diagnose diseases.
- Do NOT panic users.
- Be empathetic and calm.
- Only provide structured analysis when enough data gathered.
- If symptoms indicate life-threatening issue → mark severity Critical.

When NOT enough information:
Return JSON:
{
  "ready": false,
  "reply": "Ask follow-up question here"
}

When enough information:
Return JSON:
{
  "ready": true,
  "severity": "Low | Moderate | High | Critical",
  "summary": "Short explanation",
  "steps": ["Step 1", "Step 2"],
  "specialist": {
      "name": "Dr. Suggested",
      "type": "Neurologist",
      "rating": "4.8"
  }
}
"""

@app.post("/analyze-health")
def analyze_health(data: HealthChat):

    user_id = data.user_id
    message = data.message

    if user_id not in conversation_store:
        conversation_store[user_id] = []

    history = conversation_store[user_id]

    chat = model.start_chat(
        history=[{"role": "user", "parts": [SYSTEM_PROMPT]}] + history
    )

    response = chat.send_message(message)

    history.append({"role": "user", "parts": [message]})
    history.append({"role": "model", "parts": [response.text]})

    conversation_store[user_id] = history

    try:
        parsed = json.loads(response.text)
        return parsed
    except:
        return {
            "ready": False,
            "reply": response.text
        }