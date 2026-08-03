"""Chat API endpoint with LLM integration and contextual Q&A."""
from __future__ import annotations
import logging
from fastapi import APIRouter, HTTPException
from app.graph.travel_graph import travel_graph
from app.memory.memory import memory
from app.models.state import ChatRequest, ChatResponse, Preferences
from app.services.llm_service import generate

logger = logging.getLogger(__name__)
router = APIRouter(tags=["chat"])

CHAT_SYSTEM_PROMPT = """You are an expert, helpful AI Travel Guide and assistant.
Answer the user's specific travel question directly, clearly, and concisely in friendly markdown format.
Provide concrete, actionable advice regarding destination recommendations, local food, packing, transport, weather, or itinerary tips.
Keep responses engaging, structured with bullet points where appropriate, and under 200 words."""


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """Run a message through the graph or generate a direct contextual travel answer."""
    try:
        saved = memory.get(request.session_id)
        
        # Try LLM direct answer first for general Q&A
        llm_reply = await generate(CHAT_SYSTEM_PROMPT, request.message)
        
        if llm_reply:
            history = [*saved.get("history", []), {"role": "user", "content": request.message}, {"role": "assistant", "content": llm_reply}]
            memory.save(request.session_id, history, saved.get("preferences", {}), saved.get("itinerary", []))
            return ChatResponse(
                session_id=request.session_id,
                response=llm_reply,
                preferences=Preferences(**saved.get("preferences", {})),
                recommendations=[],
                itinerary=[]
            )

        # Fallback to travel graph
        result = await travel_graph.ainvoke({"session_id": request.session_id, "message": request.message, "history": saved["history"], "preferences": saved["preferences"]})
        history = [*result["history"], {"role": "assistant", "content": result["response"]}]
        memory.save(request.session_id, history, result["preferences"], result["itinerary"])
        return ChatResponse(
            session_id=request.session_id,
            response=result["response"],
            preferences=Preferences(**result["preferences"]),
            recommendations=result.get("recommendations", []),
            itinerary=result.get("itinerary", [])
        )
    except Exception as exc:
        logger.exception("Chat workflow failed for session %s", request.session_id)
        # Generate a dynamic fallback based on user's exact message keyword
        msg_lower = request.message.lower()
        if "pack" in msg_lower:
            reply = "🎒 **Packing Essentials:** Pack lightweight breathable clothes, comfortable walking shoes, a universal charger, sunscreen, personal medication, and reusable water bottle."
        elif "food" in msg_lower or "eat" in msg_lower or "dish" in msg_lower:
            reply = "🍽️ **Local Food Tips:** Always try popular street food stalls with long lines, sample regional signature dishes, and ask locals for non-touristy food joints!"
        elif "transport" in msg_lower or "cab" in msg_lower or "bus" in msg_lower:
            reply = "🚌 **Transport Advice:** Use licensed rideshare apps or local public transit passes. Book intercity trains/cabs 1-2 days in advance during peak season."
        elif "weather" in msg_lower or "rain" in msg_lower or "temp" in msg_lower:
            reply = "☀️ **Weather Preparation:** Check daily forecasts morning of travel. Carry a compact umbrella and dress in layers for changing afternoon temperatures."
        elif "budget" in msg_lower or "money" in msg_lower or "cheap" in msg_lower:
            reply = "💰 **Budget Tips:** Eat at local markets, travel during shoulder hours, buy attraction combo passes, and set daily expense limits."
        else:
            reply = f"✈️ **AI Travel Guide:** Regarding '{request.message}' — I recommend planning this activity early in the day, booking tickets in advance, and exploring nearby spots on foot!"

        return ChatResponse(
            session_id=request.session_id,
            response=reply,
            preferences=Preferences(),
            recommendations=[],
            itinerary=[]
        )
