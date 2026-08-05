"""Maps-service seam for a future routing provider."""
from __future__ import annotations
import httpx


async def get_local_transport(destination: str | None) -> str:
    """Return a provider-neutral mobility suggestion."""
    _ = httpx
    return f"Use official transit information and a reputable ride-hailing app in {destination or 'the destination'}."
