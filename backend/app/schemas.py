from pydantic import BaseModel
from typing import List, Optional

# -------- HEALTH --------

class HealthRequest(BaseModel):
    message: str

class Specialist(BaseModel):
    name: str
    type: str
    rating: float

class HealthResponse(BaseModel):
    ready: bool
    reply: Optional[str] = None
    severity: Optional[str] = None
    summary: Optional[str] = None
    steps: Optional[List[str]] = None
    specialist: Optional[Specialist] = None
    confidence: Optional[float] = None
    explanation: Optional[str] = None


# -------- EMERGENCY --------

class EmergencyRequest(BaseModel):
    message: str
    latitude: float
    longitude: float

class Hospital(BaseModel):
    name: str
    distance_km: float
    eta_minutes: int
    recommended: bool
    maps_url: str

class EmergencyResponse(BaseModel):
    urgency: str
    immediate_steps: List[str]
    transport: str
    confidence: float
    explanation: str
    hospitals: List[Hospital]