"""Basic regression tests for the public REST contract."""
from fastapi.testclient import TestClient
from app.main import app


def test_chat_creates_itinerary() -> None:
    """A complete request should produce a multi-day plan."""
    client = TestClient(app)
    response = client.post("/chat", json={"session_id": "test", "message": "Plan a 2 day food and culture trip to Paris from London with $500 budget"})
    assert response.status_code == 200
    assert len(response.json()["itinerary"]) == 2


def test_chat_requests_missing_details() -> None:
    """An incomplete request should be handled without an error."""
    client = TestClient(app)
    response = client.post("/chat", json={"message": "Help me plan a holiday"})
    assert response.status_code == 200
    assert "destination" in response.json()["response"]


def test_chat_extracts_worded_budget() -> None:
    """Common worded currency amounts should be retained as preferences."""
    client = TestClient(app)
    response = client.post("/chat", json={"message": "Plan 2 days in Paris with 500 dollars budget"})
    assert response.json()["preferences"]["budget"] == 500
