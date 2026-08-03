# AI Travel Chatbot

A production-oriented FastAPI travel-planning API using LangGraph, LangChain-compatible OpenAI/Groq providers, Pydantic validation, structured memory, and deterministic mock travel data.

## Installation

Requires Python 3.12 or newer.

```bash
cd travel-chatbot-ai
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Set `LLM_PROVIDER=openai` with `OPENAI_API_KEY`, or `LLM_PROVIDER=groq` with `GROQ_API_KEY`, in `.env`. The default `mock` provider needs no key and keeps the project fully runnable.

## Run

```bash
uvicorn app.main:app --reload
```

Open `http://127.0.0.1:8000/docs` for interactive API documentation.

## API example

```bash
curl -X POST http://127.0.0.1:8000/chat -H "Content-Type: application/json" -d '{"session_id":"alice","message":"Plan a 3 day food and culture trip to Paris from London with $800 budget"}'
```

The response contains a natural-language plan plus structured preferences, ranked recommendations, and a day-by-day itinerary. Reuse `session_id` to retain destination, budget, interests, trip days, and the previous itinerary.

## Project layout

- `app/api`: REST endpoint layer.
- `app/graph`: ordered LangGraph workflow: conversation → preference → travel → recommendation → itinerary.
- `app/agents`: focused workflow nodes.
- `app/prompts`: reusable LLM prompt constants.
- `app/services`: LLM, travel inventory, weather, and maps integrations.
- `app/models`: Pydantic request/response models and graph state.
- `app/memory`: thread-safe in-process session memory.
- `app/utils`: parsing and presentation helpers.
- `tests`: API regression tests.

## Notes for deployment

The in-memory store is intentionally suitable for a single process. Replace `ConversationMemory` with Redis or a database before running multiple workers. Travel, weather, and maps services are provider seams with safe mock data; connect authenticated suppliers there without changing graph or API contracts.
