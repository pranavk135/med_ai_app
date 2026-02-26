from fastapi import APIRouter, Depends
from app.schemas import HealthRequest
from app.services.health_ai import analyze_health
from app.middleware.auth import verify_user

router = APIRouter()

@router.post("/analyze-health")
async def health_endpoint(req: HealthRequest, user=Depends(verify_user)):
    user_id = user.id
    print("User ID:", user_id)
    print("Message:", req.message)
    return analyze_health(user_id, req.message)