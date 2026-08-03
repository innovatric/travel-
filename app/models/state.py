"""Typed models shared by the API and LangGraph workflow."""
from __future__ import annotations

from typing import Any, TypedDict
from pydantic import BaseModel, Field, field_validator


class Preferences(BaseModel):
    """Structured travel facts collected from a conversation."""
    source_city: str | None = None
    destination: str | None = None
    budget: float | None = Field(default=None, ge=0)
    days: int | None = Field(default=None, ge=1, le=30)
    food_preference: str | None = None
    activities: list[str] = Field(default_factory=list)
    transport_preference: str | None = None
    interests: list[str] = Field(default_factory=list)


class ChatRequest(BaseModel):
    """Validated payload accepted by POST /chat."""
    message: str = Field(min_length=1, max_length=4_000)
    session_id: str = Field(default="default", min_length=1, max_length=128)

    @field_validator("message")
    @classmethod
    def strip_message(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("message must not be empty")
        return value


class ChatResponse(BaseModel):
    """Stable public response returned by the chat endpoint."""
    session_id: str
    response: str
    preferences: Preferences
    recommendations: list[dict[str, Any]] = Field(default_factory=list)
    itinerary: list[dict[str, Any]] = Field(default_factory=list)


class TravelState(TypedDict, total=False):
    """Mutable state passed between LangGraph nodes."""
    session_id: str
    message: str
    history: list[dict[str, str]]
    preferences: dict[str, Any]
    travel_data: dict[str, list[dict[str, Any]]]
    recommendations: list[dict[str, Any]]
    itinerary: list[dict[str, Any]]
    response: str
