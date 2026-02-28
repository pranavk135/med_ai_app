import sys
import os
import json

# Unset client to force offline fallbacks
# config.client = None

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from app.services.health_ai import analyze_health
from app.services.ocr_service import extract_text
from PIL import Image, ImageDraw
import io

def test_health_ai_offline():
    print("--- Testing Health AI Offline Conversational Flow ---")
    user_id = "test_offline"
    
    print("User: I have a severe headache")
    res1 = analyze_health(user_id, "I have a severe headache")
    print("AI (Should ask duration):", res1.get('reply'))
    
    print("\nUser: It has been happening for 3 days")
    res2 = analyze_health(user_id, "It has been happening for 3 days")
    print("AI (Should triage): Ready=", res2.get('ready'))
    if res2.get('ready'):
        print("Summary:", res2.get('summary'))


def test_ocr_offline():
    print("\n--- Testing EasyOCR Offline Heuristics ---")
    img = Image.new('RGB', (400, 150), color=(255, 255, 255))
    d = ImageDraw.Draw(img)
    # Simulated EasyOCR raw output
    d.text((10,10), "Dr. Sarah Adams\nMetformin 500 mg\nTake one tablet morning and evening\nLisinopril 10mg\nTake once daily", fill=(0,0,0))
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    
    res = extract_text(img_byte_arr.getvalue())
    print(json.dumps(res, indent=2))


if __name__ == "__main__":
    test_health_ai_offline()
    test_ocr_offline()
