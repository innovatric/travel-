"""Deterministic preference extraction for dependable API behavior."""
from __future__ import annotations
import re
from app.models.state import TravelState
from app.utils.helpers import extract_budget, extract_number_of_days, unique_strings


async def preference_agent(state: TravelState) -> dict:
    """Merge newly mentioned preferences into remembered preferences."""
    text, lower = state["message"], state["message"].lower()
    prefs = dict(state.get("preferences", {}))
    destination = re.search(r"(?:to|visit|in)\s+([A-Z][A-Za-z .'-]{1,40}?)(?:\s+(?:for|with|on|from|,|$))", text)
    source = re.search(r"from\s+([A-Z][A-Za-z .'-]{1,40}?)(?:\s+(?:to|for|with|,|$))", text)
    if destination: prefs["destination"] = destination.group(1).strip()
    if source: prefs["source_city"] = source.group(1).strip()
    if (budget := extract_budget(text)) is not None: prefs["budget"] = budget
    if (days := extract_number_of_days(text)) is not None: prefs["days"] = days
    found = [word for word in ["culture", "history", "nature", "food", "adventure", "beach", "shopping", "nightlife", "photography"] if word in lower]
    if found:
        prefs["interests"] = unique_strings([*prefs.get("interests", []), *found])
        prefs["activities"] = prefs["interests"]
    for food in ["vegetarian", "vegan", "halal", "seafood"]:
        if food in lower: prefs["food_preference"] = food
    for transport in ["flight", "train", "bus", "car", "public transit"]:
        if transport in lower: prefs["transport_preference"] = transport
    return {"preferences": prefs}
