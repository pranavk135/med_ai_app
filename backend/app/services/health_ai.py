import json
from app.config import model
from app.memory.convo_store import get_history, add_message

SYSTEM_PROMPT = """
You are CareFlow AI.

Return STRICT JSON only.

If insufficient information:
{
  "ready": false,
  "reply": "Ask follow-up question."
}

If assessment complete:
{
  "ready": true,
  "severity": "Mild | Moderate | Serious | Critical",
  "summary": "...",
  "steps": ["..."],
  "specialist": {
    "name": "...",
    "type": "...",
    "rating": 4.5
  },
  "confidence": 0.85,
  "explanation": "Reasoning for severity classification"
}
"""

def analyze_health(user_id: str, message: str):

    add_message(user_id, "user", message)

    history = get_history(user_id)
    conversation = "\n".join([f"{m['role']}: {m['content']}" for m in history])

    response = model.generate_content(
        f"{SYSTEM_PROMPT}\n\nConversation:\n{conversation}",
        generation_config={"temperature": 0.3}
    )

    try:
        result = json.loads(response.text)
    except:
        return {"ready": False, "reply": "Please clarify your symptoms."}

    if result.get("ready"):
        add_message(user_id, "assistant", result.get("summary", ""))
    else:
        add_message(user_id, "assistant", result.get("reply", ""))

    return result