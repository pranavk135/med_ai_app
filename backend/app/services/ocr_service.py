import json
from google.genai import types
from PIL import Image
import io
from app.config import VISION_MODEL_NAME, vision_client

def extract_text(image_bytes):
    if not vision_client:
        return {
            "error": "Gemini API Configuration missing. Please set GEMINI_API_KEY in your .env file."
        }

    try:
        # Load raw image payload natively
        img = Image.open(io.BytesIO(image_bytes))
        
        # --- LEVEL 3: MULTIMODAL VLM (Gemini 1.5 Flash Vision) ---
        prompt = """
You are a highly advanced medical vision AI. Review the attached prescription image.
Extract the relevant details, expertly deciphering the doctor's cursive and messy handwriting based on common chemical drug dictionaries.

Return ONLY JSON. Do not write anything else.
Format EXACTLY like this:
{
  "doctor_name": "Extract doctor name, or 'Unknown Doctor'",
  "date": "Extract date, or 'Unknown Date'",
  "medications": [
    {
      "name": "Medicine Name (e.g. Betaloc)",
      "dosage": "Dosage (e.g. 100 mg)",
      "instructions": "Usage (e.g. 1 tab BID)",
      "refills": "Refill count string"
    }
  ],
  "note": "AI Multimodal Vision Extraction"
}
"""
        # Pass both the strict JSON prompt AND the image itself directly into Gemini's eyes
        llm_response = vision_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[prompt, img],
            config=types.GenerateContentConfig(
                temperature=0.0,
                response_mime_type="application/json",
            )
        )
        
        parsed_json = json.loads(llm_response.text)
        return parsed_json

    except Exception as e:
        error_msg = str(e)
        print(f"VLM Extraction Failed: {error_msg}")
        
        if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
            return {
                "error": "Gemini API Rate Limit Exceeded. Please wait 10-15 seconds before scanning another prescription."
            }
            
        return {
            "error": "Unable to extract text via Gemini Vision. Please try again."
        }