"""FastAPI application entry point."""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.chat import router as chat_router
from app.api.buchi_integration import router as buchi_router
from app.services.llm_service import get_settings

settings = get_settings()
logging.basicConfig(level=getattr(logging, settings.log_level.upper(), logging.INFO), format="%(asctime)s %(levelname)s %(name)s: %(message)s")

app = FastAPI(title="AI Travel Chatbot", version="1.0.0", description="A LangGraph-powered travel planning API.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(buchi_router)


@app.get("/health", tags=["health"])
async def health() -> dict[str, str]:
    """Expose a minimal readiness endpoint."""
    return {"status": "ok"}
