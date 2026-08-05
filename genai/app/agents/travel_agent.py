"""Workflow node supplying travel inventory."""
from app.models.state import TravelState
from app.services.travel_service import get_travel_data


async def travel_agent(state: TravelState) -> dict:
    """Fetch travel options for the selected destination."""
    return {"travel_data": await get_travel_data(state.get("preferences", {}).get("destination"))}
