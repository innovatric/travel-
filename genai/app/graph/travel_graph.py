"""The ordered LangGraph workflow for travel planning."""
from langgraph.graph import END, START, StateGraph
from app.agents.conversation_agent import conversation_agent
from app.agents.preference_agent import preference_agent
from app.agents.travel_agent import travel_agent
from app.agents.recommendation_agent import recommendation_agent
from app.agents.itinerary_agent import itinerary_agent
from app.models.state import TravelState


def build_travel_graph():
    """Build START → five agents → END exactly as the service workflow requires."""
    graph = StateGraph(TravelState)
    graph.add_node("conversation", conversation_agent)
    graph.add_node("preference", preference_agent)
    graph.add_node("travel", travel_agent)
    graph.add_node("recommendation", recommendation_agent)
    graph.add_node("itinerary", itinerary_agent)
    graph.add_edge(START, "conversation")
    graph.add_edge("conversation", "preference")
    graph.add_edge("preference", "travel")
    graph.add_edge("travel", "recommendation")
    graph.add_edge("recommendation", "itinerary")
    graph.add_edge("itinerary", END)
    return graph.compile()


travel_graph = build_travel_graph()
