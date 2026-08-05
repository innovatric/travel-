"""Thread-safe, process-local conversation memory."""
from __future__ import annotations
from copy import deepcopy
from threading import RLock
from typing import Any


class ConversationMemory:
    """Stores bounded chat history and remembered trip details."""
    def __init__(self) -> None:
        self._sessions: dict[str, dict[str, Any]] = {}
        self._lock = RLock()

    def get(self, session_id: str) -> dict[str, Any]:
        """Return an isolated session snapshot."""
        with self._lock:
            return deepcopy(self._sessions.get(session_id, {"history": [], "preferences": {}, "previous_itinerary": []}))

    def save(self, session_id: str, history: list[dict[str, str]], preferences: dict[str, Any], itinerary: list[dict[str, Any]]) -> None:
        """Persist only the memory required by this chatbot."""
        with self._lock:
            self._sessions[session_id] = {"history": deepcopy(history[-20:]), "preferences": deepcopy(preferences), "previous_itinerary": deepcopy(itinerary)}


memory = ConversationMemory()
