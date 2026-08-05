"""Initial workflow node that prepares conversational context."""
from app.models.state import TravelState


async def conversation_agent(state: TravelState) -> dict:
    """Append the user message to the conversation history."""
    return {"history": [*state.get("history", []), {"role": "user", "content": state["message"]}]}
