from fastapi import APIRouter, Depends
from app.schemas import EmergencyRequest
from app.services.emergency_ai import analyze_emergency
from app.middleware.auth import verify_user

router = APIRouter()

@router.post("/analyze-emergency")
async def emergency_endpoint(req: EmergencyRequest, user=Depends(verify_user)):
    return analyze_emergency(req.message, req.latitude, req.longitude)