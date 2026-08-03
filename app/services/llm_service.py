"""Optional LangChain LLM integration with a deterministic fallback."""
from __future__ import annotations
import logging
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    """Environment configuration loaded from .env when present."""
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    llm_provider: str = "mock"
    openai_api_key: str | None = None
    groq_api_key: str | None = None
    google_api_key: str | None = None
    openai_model: str = "gpt-4o-mini"
    groq_model: str = "llama-3.3-70b-versatile"
    gemini_model: str = "gemini-1.5-flash"
    log_level: str = "INFO"


@lru_cache
def get_settings() -> Settings:
    return Settings()


@lru_cache
def get_llm():
    """Create selected LangChain model; mock mode deliberately returns None."""
    settings = get_settings()
    if settings.llm_provider.lower() == "openai" and settings.openai_api_key:
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(model=settings.openai_model, api_key=settings.openai_api_key, temperature=0.4)
    if settings.llm_provider.lower() == "groq" and settings.groq_api_key:
        from langchain_groq import ChatGroq
        return ChatGroq(model=settings.groq_model, api_key=settings.groq_api_key, temperature=0.4)
    if settings.llm_provider.lower() == "gemini" and settings.google_api_key:
        from langchain_google_genai import ChatGoogleGenerativeAI
        return ChatGoogleGenerativeAI(model=settings.gemini_model, api_key=settings.google_api_key, temperature=0.4)
    return None


async def generate(system_prompt: str, user_prompt: str) -> str | None:
    """Invoke LLM safely; callers can use deterministic output on failure."""
    llm = get_llm()
    if llm is None:
        return None
    try:
        result = await llm.ainvoke([("system", system_prompt), ("human", user_prompt)])
        return str(result.content)
    except Exception:
        logger.exception("LLM request failed")
        return None
