"""Parsing and formatting helpers."""
from __future__ import annotations
import re
from typing import Any


def extract_number_of_days(text: str) -> int | None:
    """Extract a trip length from natural language."""
    match = re.search(r"\b(\d{1,2})\s*(?:day|days|night|nights)\b", text, re.I)
    return int(match.group(1)) if match else None


def extract_budget(text: str) -> float | None:
    """Extract a currency-like budget amount from a message."""
    # Accept symbols and common worded amounts, e.g. "$500" or "500 dollars".
    match = re.search(r"(?:₹|\$|inr\s*|rs\.?\s*)([\d,]+)|\b([\d,]+)\s*(?:dollars?|usd|rupees?|inr)\b", text, re.I)
    if not match:
        return None
    return float((match.group(1) or match.group(2)).replace(",", ""))


def unique_strings(values: list[str]) -> list[str]:
    """Return case-insensitive unique strings in input order."""
    result: list[str] = []
    seen: set[str] = set()
    for value in values:
        clean = value.strip()
        if clean and clean.lower() not in seen:
            result.append(clean)
            seen.add(clean.lower())
    return result


def format_itinerary(itinerary: list[dict[str, Any]]) -> str:
    """Render an itinerary for a chat response."""
    return "\n".join(f"Day {item['day']}: " + " • ".join(item["activities"]) for item in itinerary)
