from app.services.routing_service import generate_maps_url

def analyze_emergency(message, lat, lng):

    urgency = "Critical" if "chest" in message.lower() else "High"

    hospitals = [
        {"name": "City Emergency Hospital", "distance_km": 2.5, "eta_minutes": 7},
        {"name": "Metro Trauma Center", "distance_km": 4.2, "eta_minutes": 11}
    ]

    fastest = min(hospitals, key=lambda x: x["eta_minutes"])

    for h in hospitals:
        h["recommended"] = h == fastest
        h["maps_url"] = generate_maps_url(h["name"])

    return {
        "urgency": urgency,
        "immediate_steps": [
            "Stay calm",
            "Avoid exertion",
            "Call emergency services immediately"
        ],
        "transport": "Ambulance" if urgency == "Critical" else "Private Vehicle",
        "confidence": 0.88,
        "explanation": "Symptoms suggest possible serious condition.",
        "hospitals": hospitals
    }