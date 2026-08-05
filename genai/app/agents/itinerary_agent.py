"""Final workflow node that creates a practical daily plan."""
from app.models.state import TravelState
from app.services.maps_service import get_local_transport
from app.services.weather_service import get_weather_summary
from app.services.llm_service import generate
from app.prompts.itinerary_prompt import SYSTEM_PROMPT
from app.utils.helpers import format_itinerary


async def itinerary_agent(state: TravelState) -> dict:
    """Generate a day-by-day itinerary or request missing essentials."""
    prefs = state.get("preferences", {})
    destination, days = prefs.get("destination"), prefs.get("days")
    if not destination or not days:
        missing = [name for name, value in [("destination", destination), ("number of days", days)] if not value]
        return {"itinerary": [], "response": "I can plan your trip. Please tell me your " + " and ".join(missing) + "."}
    data = state["travel_data"]
    attractions = [item["name"] for item in data["attractions"]]
    hotel, restaurant = data["hotels"][0]["name"], data["restaurants"][0]["name"]
    itinerary = []
    for day in range(1, days + 1):
        activities = ([f"Arrive in {destination}", f"Check in at {hotel}", f"Lunch at {restaurant}", attractions[0], "Dinner and an easy evening walk"] if day == 1 else ["Breakfast near your hotel", attractions[(day - 1) % len(attractions)], f"Lunch at {restaurant}", "Free time or a neighbourhood walk", "Dinner"])
        itinerary.append({"day": day, "activities": activities})
    weather, transport = await get_weather_summary(destination), await get_local_transport(destination)
    deterministic_response = f"Here is your {days}-day {destination} plan:\n{format_itinerary(itinerary)}\n\n{weather} {transport}"
    # An LLM can polish the prose, while the validated deterministic itinerary remains canonical.
    llm_response = await generate(SYSTEM_PROMPT, deterministic_response)
    return {"itinerary": itinerary, "response": llm_response or deterministic_response}
