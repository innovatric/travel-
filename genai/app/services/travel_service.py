"""Curated mock inventory used without a live travel provider."""
from __future__ import annotations
from typing import Any


async def get_travel_data(destination: str | None) -> dict[str, list[dict[str, Any]]]:
    """Return normalized attractions, hotels, restaurants, and transport."""
    place = destination or "your destination"
    return {
        "attractions": [{"name": f"{place} Old Town Walk", "rating": 4.7, "price": 0, "tags": ["culture", "history"]}, {"name": f"{place} Scenic Viewpoint", "rating": 4.6, "price": 15, "tags": ["nature", "photography"]}, {"name": f"{place} Food Market", "rating": 4.5, "price": 20, "tags": ["food", "local"]}],
        "hotels": [{"name": "Central Comfort Hotel", "rating": 4.4, "price": 85, "tags": ["central", "value"]}, {"name": "Boutique City Stay", "rating": 4.7, "price": 150, "tags": ["luxury", "central"]}],
        "restaurants": [{"name": "Local Table", "rating": 4.6, "price": 25, "tags": ["local", "vegetarian-friendly"]}, {"name": "Garden Kitchen", "rating": 4.5, "price": 18, "tags": ["vegan", "casual"]}],
        "transportation": [{"name": "Public transit day pass", "rating": 4.3, "price": 10, "tags": ["budget", "convenient"]}, {"name": "Airport transfer", "rating": 4.6, "price": 35, "tags": ["comfortable", "fast"]}],
    }
