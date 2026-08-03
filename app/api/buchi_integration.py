from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from app.services.llm_service import generate
from datetime import datetime, timedelta
import json

router = APIRouter(tags=["buchi_integration"])


class BuchiChatRequest(BaseModel):
    message: str


class BuchiChatResponse(BaseModel):
    response: str


class TripPlanRequest(BaseModel):
    prompt: Optional[str] = ""
    startLocation: str
    destinations: List[str]
    startDate: str
    endDate: str
    travellers: int
    budget: float
    currency: str
    interests: Optional[str] = ""
    pace: Optional[str] = ""
    accommodation: Optional[str] = ""
    transport: Optional[str] = ""
    food: Optional[str] = ""
    requirements: Optional[str] = ""
    userId: Optional[int] = None


class TripPlanResponse(BaseModel):
    json_itinerary: str


def get_location_coords(name: str) -> Dict[str, Any]:
    name_lower = name.lower().strip()
    coords_db = {
        "rajahmundry": {"lat": 17.0005, "lng": 81.8040, "label": "Rajahmundry, AP"},
        "dibbidi": {"lat": 17.7200, "lng": 83.3100, "label": "Dibbidi, AP"},
        "vizag": {"lat": 17.6868, "lng": 83.2185, "label": "Visakhapatnam, AP"},
        "visakhapatnam": {"lat": 17.6868, "lng": 83.2185, "label": "Visakhapatnam, AP"},
        "hyderabad": {"lat": 17.3850, "lng": 78.4867, "label": "Hyderabad, TS"},
        "paris": {"lat": 48.8566, "lng": 2.3522, "label": "Paris, France"},
        "kyoto": {"lat": 35.0116, "lng": 135.7681, "label": "Kyoto, Japan"},
        "goa": {"lat": 15.2993, "lng": 74.1240, "label": "Goa, India"},
        "london": {"lat": 51.5074, "lng": -0.1278, "label": "London, UK"},
    }
    for key, val in coords_db.items():
        if key in name_lower:
            return val
    # Generic fallback coordinate
    return {"lat": 17.5000 + (hash(name) % 100) * 0.01, "lng": 82.5000 + (hash(name) % 100) * 0.01, "label": name.capitalize()}


@router.post("/api/chat", response_model=BuchiChatResponse)
async def buchi_chat(request: BuchiChatRequest):
    msg = request.message.lower()
    system_prompt = (
        "You are Alex, a warm, knowledgeable, and enthusiastic human travel companion and local buddy. "
        "Speak naturally like a real human friend talking face-to-face. "
        "ALWAYS format your recommendations into short, clear, easy-to-read bullet points (using • or 1., 2., 3.). "
        "NEVER write long, dense paragraphs. Keep your intro friendly and concise, followed by clean bullet points."
    )
    response = await generate(system_prompt, request.message)
    if not response:
        if "pack" in msg or "wear" in msg or "cloth" in msg or "bring" in msg:
            response = (
                "Hey there! Here is what I recommend packing for a super smooth trip:\n\n"
                "• **Clothing**: Light, breathable cotton clothes & comfortable walking shoes\n"
                "• **Sun Protection**: Sunglasses, sunblock, and a wide-brim hat\n"
                "• **Hydration**: Reusable water bottle to stay fresh while exploring\n"
                "• **Weather Gear**: A compact umbrella or light rain jacket just in case!"
            )
        elif "food" in msg or "eat" in msg or "restaurant" in msg or "dish" in msg:
            response = (
                "You're in for a treat with the local food! Here are my top dining picks:\n\n"
                "• **Regional Thalis**: Authentic local thali meals at traditional dhabas\n"
                "• **Morning Special**: Piping hot filter coffee & fresh regional breakfast\n"
                "• **Evening Snacks**: Artisanal sweet savories & local street food stalls\n"
                "• **Top Dining**: High-rated local cafes with fresh regional delicacies"
            )
        elif "transport" in msg or "bus" in msg or "train" in msg or "taxi" in msg or "cab" in msg:
            response = (
                "Here are the best transit tips for getting around smoothly:\n\n"
                "• **Best Option**: Express bus shuttles or private cabs for inter-city travel\n"
                "• **Timing Tip**: Start morning transfers around 7:30 AM to skip traffic\n"
                "• **Budget Saver**: Use shared cabs for quick, affordable local town trips"
            )
        elif "weather" in msg or "climate" in msg or "temp" in msg:
            response = (
                "Here is what to expect weather-wise for your travel dates:\n\n"
                "• **Mornings**: Crisp & pleasant (~24°C - 26°C), ideal for sightseeing\n"
                "• **Afternoons**: Warm & sunny, perfect for indoor spots & lunch breaks\n"
                "• **Evenings**: Cool breeze, great for promenade walks & golden hour photos"
            )
        elif "hidden" in msg or "gem" in msg or "secret" in msg or "spot" in msg:
            response = (
                "Here are a few awesome hidden spots off the tourist trail:\n\n"
                "• **Riverside Ghats**: Peaceful sunrise views before the crowds arrive\n"
                "• **Artisan Markets**: Local weekly bazaar for authentic handmade crafts\n"
                "• **Heritage Lanes**: Quiet ancient temple complexes tucked off main roads"
            )
        elif "budget" in msg or "save" in msg or "cheap" in msg or "money" in msg:
            response = (
                "Here is how you can easily stretch your travel budget:\n\n"
                "• **Dining**: Eat at popular local family dhabas—cheaper & far more authentic!\n"
                "• **Transit**: Use shared cabs or public transit for short city routes\n"
                "• **Stay**: Book your accommodation 3 to 5 days early for lower rates\n"
                "• **Timing**: Travel on weekdays when transit & entry tickets cost less"
            )
        else:
            response = (
                f"Hey! Here are my top tips regarding '{request.message}':\n\n"
                "• **Early Start**: Begin your day around 8:00 AM to beat heat & crowds\n"
                "• **Local Flavors**: Try regional lunch specialties at authentic cafes\n"
                "• **Sunset Views**: Catch golden hour photos from a high scenic viewpoint"
            )
    return BuchiChatResponse(response=response)


def build_fallback_itinerary(request: TripPlanRequest) -> Dict[str, Any]:
    dest = request.destinations[0] if (request.destinations and request.destinations[0].strip()) else request.startLocation
    start_loc = request.startLocation or "Origin"
    curr = request.currency or "INR"
    tot_budget = float(request.budget) if request.budget and float(request.budget) > 0 else 5000.0

    # Calculate total trip days from dates
    num_days = 5
    start_dt = datetime.now()
    if request.startDate and request.endDate:
        try:
            d1 = datetime.strptime(request.startDate, "%Y-%m-%d")
            d2 = datetime.strptime(request.endDate, "%Y-%m-%d")
            diff = (d2 - d1).days + 1
            if 1 <= diff <= 14:
                num_days = diff
                start_dt = d1
        except Exception:
            pass

    start_coords = get_location_coords(start_loc)
    dest_coords = get_location_coords(dest)
    daily_budget = tot_budget / num_days
    days_data = []

    for day_idx in range(1, num_days + 1):
        cur_date = (start_dt + timedelta(days=day_idx - 1)).strftime("%Y-%m-%d")

        if day_idx == 1:
            title = f"Day 1 - Departure from {start_loc} & Arrival in {dest}"
            req_trans = (request.transport or "").lower()
            is_flight = "flight" in req_trans or dest.lower() in ["london", "paris", "tokyo", "dubai", "bali", "singapore", "new york", "delhi", "goa", "mumbai"]

            trans_type = "flight" if is_flight else "transport"
            trans_cat = "Flight" if is_flight else "Travel"
            trans_title = f"Flight from {start_loc} to {dest} (IndiGo / Air India)" if is_flight else f"Journey from {start_loc} to {dest}"
            trans_desc = f"Board non-stop flight TF-482 from {start_loc} airport to {dest}. Airport check-in & baggage allowance included." if is_flight else f"Depart {start_loc} via scenic {request.transport or 'Express Transit'}."

            items = [
                {
                    "id": f"item-{day_idx}-1",
                    "type": trans_type,
                    "category": trans_cat,
                    "time": "08:00 AM",
                    "title": trans_title,
                    "description": trans_desc,
                    "duration": "3.5 hrs",
                    "estimatedCost": f"{curr} {daily_budget * 0.20:.0f}",
                    "location": start_loc,
                    "coordinates": start_coords,
                    "airline": "IndiGo / Air India",
                    "flightNumber": f"TF-{100 + abs(hash(dest)) % 899}",
                    "departureTime": "08:00 AM",
                    "arrivalTime": "11:30 AM",
                    "status": "CONFIRMED",
                },
                {
                    "id": f"item-{day_idx}-2",
                    "type": "hotel",
                    "category": "Stay",
                    "time": "12:30 PM",
                    "title": f"Check-in at {request.accommodation or 'Comfort Resort & Stay'}",
                    "description": "Unpack, freshen up, and enjoy welcome refreshments at your stay.",
                    "duration": "1 hr",
                    "rating": "4.8",
                    "estimatedCost": f"{curr} {daily_budget * 0.40:.0f}",
                    "location": dest,
                    "coordinates": dest_coords,
                },
                {
                    "id": f"item-{day_idx}-3",
                    "type": "restaurant",
                    "category": "Dining",
                    "time": "02:00 PM",
                    "title": f"Lunch - Authentic {request.food or 'Regional Delicacies'}",
                    "description": "Taste local authentic dishes and fresh seasonal specialties.",
                    "duration": "1.5 hrs",
                    "estimatedCost": f"{curr} {daily_budget * 0.15:.0f}",
                    "location": dest,
                    "coordinates": dest_coords,
                },
                {
                    "id": f"item-{day_idx}-4",
                    "type": "activity",
                    "category": "Sightseeing",
                    "time": "05:00 PM",
                    "title": "Evening Promenade & Local Market Exploration",
                    "description": "Relaxed evening walk around central square and artisanal souvenir markets.",
                    "duration": "2.5 hrs",
                    "rating": "4.9",
                    "estimatedCost": f"{curr} {daily_budget * 0.15:.0f}",
                    "location": dest,
                    "coordinates": dest_coords,
                },
            ]
        elif day_idx == num_days:
            title = f"Day {day_idx} - Final Exploration & Return to {start_loc}"
            items = [
                {
                    "id": f"item-{day_idx}-1",
                    "type": "activity",
                    "category": "Culture",
                    "time": "09:00 AM",
                    "title": "Sunrise Viewpoint & Photography Spot",
                    "description": "Capture morning panoramic views and peaceful scenic surroundings.",
                    "duration": "2 hrs",
                    "rating": "4.9",
                    "estimatedCost": f"{curr} {daily_budget * 0.10:.0f}",
                    "location": dest,
                    "coordinates": dest_coords,
                },
                {
                    "id": f"item-{day_idx}-2",
                    "type": "restaurant",
                    "category": "Dining",
                    "time": "12:00 PM",
                    "title": "Farewell Feast & Local Sweets",
                    "description": "Enjoy a delightful lunch and pick up famous local sweets and snacks.",
                    "duration": "1.5 hrs",
                    "estimatedCost": f"{curr} {daily_budget * 0.20:.0f}",
                    "location": dest,
                    "coordinates": dest_coords,
                },
                {
                    "id": f"item-{day_idx}-3",
                    "type": "transport",
                    "category": "Travel",
                    "time": "03:00 PM",
                    "title": f"Return Journey back to {start_loc}",
                    "description": f"Comfortable ride back to {start_loc} with happy memories.",
                    "duration": "3.5 hrs",
                    "estimatedCost": f"{curr} {daily_budget * 0.20:.0f}",
                    "location": start_loc,
                    "coordinates": start_coords,
                },
            ]
        else:
            title = f"Day {day_idx} - Deep Dive into {dest} Highlights ({request.interests or 'Nature & Heritage'})"
            items = [
                {
                    "id": f"item-{day_idx}-1",
                    "type": "activity",
                    "category": "Adventure & Sightseeing",
                    "time": "09:00 AM",
                    "title": f"Guided Exploration of {dest} Landmarks",
                    "description": "Explore historic monuments, scenic nature parks, and cultural highlights with expert tips.",
                    "duration": "3 hrs",
                    "rating": "4.8",
                    "estimatedCost": f"{curr} {daily_budget * 0.25:.0f}",
                    "location": dest,
                    "coordinates": dest_coords,
                },
                {
                    "id": f"item-{day_idx}-2",
                    "type": "restaurant",
                    "category": "Dining",
                    "time": "01:00 PM",
                    "title": "Riverside / Scenic Spot Dining",
                    "description": "Delicious lunch featuring fresh local produce and artisan beverages.",
                    "duration": "1.5 hrs",
                    "estimatedCost": f"{curr} {daily_budget * 0.20:.0f}",
                    "location": dest,
                    "coordinates": dest_coords,
                },
                {
                    "id": f"item-{day_idx}-3",
                    "type": "activity",
                    "category": "Experience",
                    "time": "04:30 PM",
                    "title": "Sunset Viewpoint & Acoustic Performance",
                    "description": "Watch the golden hour sunset over picturesque landscapes.",
                    "duration": "2.5 hrs",
                    "rating": "4.9",
                    "estimatedCost": f"{curr} {daily_budget * 0.20:.0f}",
                    "location": dest,
                    "coordinates": dest_coords,
                },
            ]

        days_data.append({
            "id": f"day-{day_idx}",
            "dayNumber": day_idx,
            "title": title,
            "date": cur_date,
            "items": items,
        })

    return {
        "tripName": f"Trip from {start_loc} to {dest}",
        "destination": dest,
        "startLocation": start_loc,
        "description": (
            f"Personalized {num_days}-day AI travel plan from {start_loc} to {dest} "
            f"tailored for {request.travellers} traveller(s) with a budget of {curr} {tot_budget:,.0f}."
        ),
        "days": days_data,
        "totalBudget": tot_budget,
        "currency": curr,
        "budget": {
            "accommodation": tot_budget * 0.35,
            "transport": tot_budget * 0.25,
            "activities": tot_budget * 0.20,
            "food": tot_budget * 0.20,
        },
        "route": [
            {"name": start_loc, "lat": start_coords["lat"], "lng": start_coords["lng"]},
            {"name": dest, "lat": dest_coords["lat"], "lng": dest_coords["lng"]},
        ],
    }


@router.post("/api/planTrip", response_model=TripPlanResponse)
async def buchi_plan_trip(request: TripPlanRequest):
    system_prompt = "You are an intelligent AI travel itinerary planner. Return ONLY valid JSON."

    prompt = f"""
Create a detailed travel itinerary as valid JSON with this exact structure:
{{
  "tripName": "...",
  "destination": "...",
  "startLocation": "...",
  "description": "...",
  "totalBudget": number,
  "currency": "...",
  "budget": {{"accommodation": number, "transport": number, "food": number, "activities": number}},
  "route": [{{"name": "...", "lat": number, "lng": number}}],
  "days": [
    {{
      "id": "day-1",
      "dayNumber": 1,
      "title": "...",
      "date": "YYYY-MM-DD",
      "items": [
        {{"id": "item-1-1", "type": "transport|hotel|restaurant|activity", "category": "...", "time": "HH:MM AM/PM", "title": "...", "description": "...", "duration": "...", "estimatedCost": "CURRENCY AMOUNT", "location": "...", "rating": "4.X"}}
      ]
    }}
  ]
}}

Trip Details:
- From: {request.startLocation} → To: {', '.join(request.destinations)}
- Dates: {request.startDate} to {request.endDate}
- Travellers: {request.travellers}
- Budget: {request.currency} {request.budget}
- Interests: {request.interests}
- Pace: {request.pace}
- Stay: {request.accommodation}
- Transport: {request.transport}
- Food: {request.food}
- Notes: {request.requirements}

Generate one day entry per day in the date range. Return ONLY the JSON, no markdown.
"""

    response = await generate(system_prompt, prompt)
    if response:
        clean_json = response.replace("```json", "").replace("```", "").strip()
        try:
            # Validate it's real JSON
            json.loads(clean_json)
            return TripPlanResponse(json_itinerary=clean_json)
        except json.JSONDecodeError:
            pass

    # Fallback: build itinerary deterministically
    fallback_data = build_fallback_itinerary(request)
    return TripPlanResponse(json_itinerary=json.dumps(fallback_data))
