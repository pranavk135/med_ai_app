import json
from google.genai import types

from app.config import CHAT_MODEL_NAME, client
from app.memory.convo_store import get_history, add_message

SYSTEM_PROMPT = """
You are CareFlow AI, an advanced medical assistant.

CRITICAL INSTRUCTION: You MUST NOT provide a medical assessment, diagnosis, or recommendations until you have a comprehensive understanding of the user's situation. 
Ask specific follow-up questions first. Do not jump to a conclusion immediately.

If the user's initial message is brief (e.g., "I have a headache", "My stomach hurts"), you DO NOT have enough information. You MUST ask follow-up questions first.

When gathering information (ready = false):
Return EXACTLY THIS JSON:
{
  "ready": false,
  "reply": "A friendly, empathetic, natural GPT-style response asking 2-4 specific follow-up questions to understand duration, severity (1-10), aggravating/relieving factors, and potential red flags. Do NOT give a diagnosis yet."
}

When you have SUFFICIENT information (e.g., duration, severity, and context are clear) OR if the situation sounds like an emergency (ready = true):
Return EXACTLY THIS JSON:
{
  "ready": true,
  "reply": "A natural, helpful markdown response. Structure it beautifully covering:\n- **What this could be** (informational only)\n- **What to do now**\n- **Precautions to take**\n- **How to improve lifestyle/prevention**\n- **Whether to visit a doctor or not**\nUse bullet points and bold text to make it easy to read.",
  "severity": "Mild" | "Moderate" | "Serious" | "Critical",
  "summary": "1-2 sentence summary of your assessment",
  "steps": [],
  "precautions": [],
  "lifestyle": [],
  "see_doctor": true,
  "red_flags": [],
  "specialist": {
    "name": "CareFlow Network Doctor",
    "type": "General Practitioner or relevant specialist",
    "rating": 4.8
  },
  "confidence": 0.85,
  "explanation": "Reasoning for severity classification"
}

ALWAYS RETURN VALID JSON ONLY. No markdown wrapping outside the JSON.
"""


def _rule_based_assessment(history_text: str) -> dict:
    """Fallback health assessment when Gemini is unavailable (quota, key, etc.)."""
    
    # Analyze the entire conversation history instead of a sliding window.
    # This ensures anything said ever (duration/severity) is remembered globally.
    lines = history_text.split('\n')
    user_msgs = [line.split('user:', 1)[1].strip() for line in lines if line.startswith('user:')]
    assistant_msgs = [line.split('assistant:', 1)[1].strip() for line in lines if line.startswith('assistant:')]
    
    # If the assistant has ALREADY triaged the user, any further messages simply get a polite dismissal.
    # We detect triage by looking for standard summary strings that get written to the history log.
    triage_signatures = [
        "life‑threatening emergency",
        "urgent medical review",
        "symptoms sound mild"
    ]
    if any(any(sig in msg for sig in triage_signatures) for msg in assistant_msgs):
        return {
            "ready": False,
            "reply": "Thank you for the update. My initial assessment is complete. Please follow the instructions provided, monitor your symptoms, and consult a human doctor if they worsen."
        }
    
    # Evaluate context across all messages
    context_text = " ".join(user_msgs).lower()
    
    # Extensive numerical severity checks (1-10 string + number formats)
    has_duration = any(k in context_text for k in ["day", "days", "week", "weeks", "month", "months", "hour", "hours", "since", "yesterday", "today", "year", "years"])
    severity_keywords = ["mild", "moderate", "severe", "worst", "pain", "bad", "intense", "high"] + [str(i) for i in range(1, 11)] + ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]
    has_severity = any(k in context_text.split() for k in severity_keywords) # Split ensures we don't match '1' inside '100'
    has_red_flags = any(k in context_text for k in ["faint", "unconscious", "chest pain", "difficulty breathing", "shortness of breath", "seizure", "confusion"])

    # If missing info, provide a natural conversational prompt based on exactly what is missing.
    if not has_red_flags:
        if not has_duration and not has_severity:
            reply = "I can certainly help you with that. To guide you safely, how long have you been experiencing this, and on a scale of 0-10, how severe is it?"
            return {"ready": False, "reply": reply}
        elif not has_duration:
            reply = "Got it. And how long have you been dealing with these symptoms?"
            return {"ready": False, "reply": reply}
        elif not has_severity:
            reply = "I understand. On a scale of 0-10, how severe would you say this is right now?"
            return {"ready": False, "reply": reply}

    critical_keywords = ["chest pain", "difficulty breathing", "shortness of breath", "unconscious", "seizure"]
    serious_keywords = ["high fever", "vomiting", "severe", "bleeding", "loss of vision"]

    if any(k in context_text for k in critical_keywords):
        severity = "Critical"
        summary = "Your description suggests a potentially life‑threatening emergency."
        steps = [
            "Call emergency services immediately.",
            "Avoid any physical exertion or movement.",
            "If possible, have someone stay with you while help arrives.",
        ]
        precautions = ["Do not drive yourself if you feel faint or unwell."]
        lifestyle = []
        see_doctor = True
        red_flags = ["Chest pain", "Breathing difficulty", "Fainting/unconsciousness"]
        specialist_type = "Emergency Medicine / Cardiology"
    elif any(k in context_text for k in serious_keywords):
        severity = "Serious"
        summary = "Your symptoms could indicate a serious condition that needs urgent medical review."
        steps = [
            "Arrange an urgent visit to the nearest emergency department or urgent care.",
            "Avoid heavy activity and stay hydrated unless you are vomiting.",
            "If symptoms suddenly worsen, call emergency services.",
        ]
        precautions = ["Avoid alcohol and recreational drugs until evaluated."]
        lifestyle = ["Prioritize sleep and hydration while monitoring symptoms."]
        see_doctor = True
        red_flags = ["Worsening symptoms", "New weakness/numbness", "Persistent vomiting"]
        specialist_type = "Internal Medicine"
    else:
        severity = "Mild"
        summary = "Your symptoms sound mild based on the information provided."
        steps = [
            "Monitor your symptoms over the next 24–48 hours.",
            "Rest, hydrate well, and avoid excessive screen time.",
            "If the symptoms persist, worsen, or new symptoms appear, see a doctor.",
        ]
        precautions = ["Avoid taking multiple painkillers together unless you’re sure it’s safe for you."]
        lifestyle = [
            "Hydrate regularly and reduce screen brightness/break every 20 minutes.",
            "Keep a simple trigger log (sleep, caffeine, stress, dehydration).",
        ]
        see_doctor = False
        red_flags = ["Sudden severe headache", "Fever + stiff neck", "Weakness/numbness", "Vision changes"]
        specialist_type = "General Practitioner"

    return {
        "ready": True,
        "severity": severity,
        "reply": (
            f"Here’s what I’d do based on what you shared (not a diagnosis):\n\n"
            f"**How urgent this seems:** {severity}\n\n"
            f"**What to do now:**\n- " + "\n- ".join(steps) + "\n\n"
            f"**Precautions:**\n- " + "\n- ".join(precautions) + "\n\n"
            + (f"**Lifestyle / prevention:**\n- " + "\n- ".join(lifestyle) + "\n\n" if lifestyle else "")
            + (f"**See a doctor?** {'Yes' if see_doctor else 'Not necessarily right now'}\n\n")
            + f"**Go to urgent care / ER now if:**\n- " + "\n- ".join(red_flags)
        ),
        "summary": summary,
        "steps": steps,
        "precautions": precautions,
        "lifestyle": lifestyle,
        "see_doctor": see_doctor,
        "red_flags": red_flags,
        "specialist": {
            "name": "CareFlow Network Doctor",
            "type": specialist_type,
            "rating": 4.6,
        },
        "confidence": 0.6,
        "explanation": "Classification is based on simple rule‑based symptom keywords, not full AI reasoning.",
    }


def analyze_health(user_id: str, message: str):
    add_message(user_id, "user", message)

    history = get_history(user_id)
    conversation = "\n".join([f"{m['role']}: {m['content']}" for m in history])

    # If Gemini client is not configured, use rule‑based fallback.
    if client is None:
        result = _rule_based_assessment(conversation)
    else:
        try:
            response = client.models.generate_content(
                model=CHAT_MODEL_NAME,
                contents=f"{SYSTEM_PROMPT}\n\nConversation:\n{conversation}",
                config=types.GenerateContentConfig(
                    temperature=0.3,
                    max_output_tokens=800,
                    response_mime_type="application/json",
                ),
            )

            result = json.loads(response.text or "")
        except Exception:
            # Gemini quota / network / config issues: fall back to rule‑based logic.
            result = _rule_based_assessment(conversation)

    if result.get("ready"):
        add_message(user_id, "assistant", result.get("summary", ""))
    else:
        add_message(user_id, "assistant", result.get("reply", ""))

    return result