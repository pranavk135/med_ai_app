from fastapi import APIRouter, Depends, UploadFile, File
import time
from app.schemas import HealthRequest
from app.services.health_ai import analyze_health
from app.memory.convo_store import clear_history
from app.middleware.auth import verify_user

router = APIRouter()

@router.post("/analyze-health")
async def health_endpoint(req: HealthRequest, user=Depends(verify_user)):
    user_id = user.id
    print("User ID:", user_id)
    print("Message:", req.message)
    return analyze_health(user_id, req.message)

@router.post("/clear-chat")
async def clear_chat_endpoint(user=Depends(verify_user)):
    user_id = user.id
    clear_history(user_id)
    return {"status": "History cleared"}

@router.post("/ocr")
async def ocr_endpoint(file: UploadFile = File(...)):
    # Mocking Gemini OCR logic for prescription scanning to keep it simple and fast
    time.sleep(1.5) # simulate AI processing
    return {
        "doctor_name": "Dr. Emily Chen, MD",
        "date": "2026-02-27",
        "medications": [
            {
                "name": "Amoxicillin 500mg",
                "dosage": "1 capsule three times daily",
                "instructions": "Take with food until finished",
                "refills": "0"
            },
            {
                "name": "Ibuprofen 400mg",
                "dosage": "1 tablet every 6 hours",
                "instructions": "Take as needed for pain",
                "refills": "3"
            }
        ]
    }