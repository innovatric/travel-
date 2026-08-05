"""Rank inventory according to traveller preferences."""
from __future__ import annotations
from typing import Any
from app.models.state import TravelState


def score(item: dict[str, Any], budget: float | None, interests: list[str]) -> float:
    """Calculate transparent quality, affordability, and relevance score."""
    quality = float(item["rating"]) * 20
    affordability = 20 if budget is None or item["price"] <= budget else max(0, 20 - (item["price"] - budget) / max(budget, 1) * 20)
    relevance = 10 * len(set(item.get("tags", [])) & set(interests))
    return round(quality + affordability + relevance, 1)


async def recommendation_agent(state: TravelState) -> dict:
    """Rank all categories and keep the eight strongest options."""
    prefs, ranked = state.get("preferences", {}), []
    for category, items in state.get("travel_data", {}).items():
        for item in items:
            ranked.append({"category": category, **item, "score": score(item, prefs.get("budget"), prefs.get("interests", []))})
    ranked.sort(key=lambda item: item["score"], reverse=True)
    return {"recommendations": ranked[:8]}
