import base64
import json
from app.config import model

def extract_text(image_bytes):

    image_base64 = base64.b64encode(image_bytes).decode()

    prompt = """
Extract medication names, dosage, and instructions.
Return structured JSON:
{
  "medications": [
    {
      "name": "...",
      "dosage": "...",
      "instructions": "..."
    }
  ]
}
"""

    response = model.generate_content([
        {"mime_type": "image/jpeg", "data": image_base64},
        prompt
    ])

    try:
        return json.loads(response.text)
    except:
        return {"error": "Unable to parse prescription"}