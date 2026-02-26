from fastapi import APIRouter, UploadFile, File, Depends
from app.services.ocr_service import extract_text
from app.middleware.auth import verify_user

router = APIRouter()

@router.post("/scan-prescription")
async def scan_prescription(file: UploadFile = File(...), user=Depends(verify_user)):
    return extract_text(await file.read())