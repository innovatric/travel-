"""Weather-service seam for a future live provider."""
from __future__ import annotations
import httpx


async def get_weather_summary(destination: str | None) -> str:
    """Return a safe planning note without an external API key."""
    _ = httpx
    return f"Check the local forecast for {destination or 'your destination'} before departure."
