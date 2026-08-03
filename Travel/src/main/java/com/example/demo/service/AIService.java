
package com.example.demo.service;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.demo.dto.TripPlanRequest;
import com.example.demo.models.Itineraries;
import com.example.demo.models.ItineraryItems;
import com.example.demo.models.Trips;
import com.example.demo.models.Users;

import com.example.demo.repository.UsersRepository;
import com.example.demo.repository.TripsRepository;
import com.example.demo.repository.ItinerariesRepository;
import com.example.demo.repository.ItineraryItemsRepository;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.Map;
import java.util.HashMap;

@Service
public class AIService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String PYTHON_AI_URL = "http://localhost:8000/api";

    private final UsersRepository usersRepository;
    private final TripsRepository tripsRepository;
    private final ItinerariesRepository itinerariesRepository;
    private final ItineraryItemsRepository itineraryItemsRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public AIService(
            UsersRepository usersRepository,
            TripsRepository tripsRepository,
            ItinerariesRepository itinerariesRepository,
            ItineraryItemsRepository itineraryItemsRepository) {

        this.usersRepository = usersRepository;
        this.tripsRepository = tripsRepository;
        this.itinerariesRepository = itinerariesRepository;
        this.itineraryItemsRepository = itineraryItemsRepository;
    }


    // =========================================================
    // GENERAL AI CHAT
    // =========================================================

    public String chat(String message) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("message", message);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    PYTHON_AI_URL + "/chat",
                    request,
                    Map.class
            );

            if (response.getBody() != null && response.getBody().containsKey("response")) {
                return (String) response.getBody().get("response");
            }
            return "Error: Empty response from AI service.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error communicating with AI service: " + e.getMessage();
        }
    }


    // =========================================================
    // AI TRAVEL ITINERARY PLANNER
    // =========================================================

    public String planTrip(TripPlanRequest request) {

        String prompt = """
                You are an intelligent AI travel itinerary planner.

                Create a detailed and practical travel itinerary using
                the user's travel requirements provided below.

                User's Request:
                %s

                Starting Location:
                %s

                Destinations:
                %s

                Start Date:
                %s

                End Date:
                %s

                Number of Travellers:
                %d

                Total Budget:
                %s %f

                Interests:
                %s

                Travel Pace:
                %s

                Accommodation Preference:
                %s

                Preferred Transport:
                %s

                Food Preference:
                %s

                Additional Requirements:
                %s

                Return ONLY valid JSON.

                Use exactly this JSON structure:

                {
                  "trip_details": {
                    "starting_location": "string",
                    "destinations": [],
                    "start_date": "YYYY-MM-DD",
                    "end_date": "YYYY-MM-DD",
                    "number_of_travellers": 0,
                    "total_budget_inr": 0.0,
                    "interests": [],
                    "travel_pace": "string",
                    "accommodation_preference": "string",
                    "preferred_transport": "string",
                    "food_preference": "string"
                  },
                  "itinerary": [
                    {
                      "day": 1,
                      "date": "YYYY-MM-DD",
                      "location": "string",
                      "activities": [
                        {
                          "time": "Morning",
                          "description": "string",
                          "cost_inr": 0.0
                        }
                      ],
                      "meals": {
                        "breakfast": "string",
                        "lunch": "string",
                        "dinner": "string"
                      },
                      "accommodation": {
                        "name": "string",
                        "cost_inr": 0.0
                      }
                    }
                  ],
                  "budget_breakdown": {
                    "total_estimated_cost_inr": 0.0,
                    "transport_inr": 0.0,
                    "accommodation_inr": 0.0,
                    "food_and_activities_buffer_inr": 0.0,
                    "note": "string"
                  }
                }
                """.formatted(
                        request.getPrompt(),
                        request.getStartLocation(),
                        request.getDestinations(),
                        request.getStartDate(),
                        request.getEndDate(),
                        request.getTravellers(),
                        request.getCurrency(),
                        request.getBudget(),
                        request.getInterests(),
                        request.getPace(),
                        request.getAccommodation(),
                        request.getTransport(),
                        request.getFood(),
                        request.getRequirements()
                );


        // =========================================================
        // CALL PYTHON AI MICROSERVICE
        // =========================================================

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<TripPlanRequest> httpRequest = new HttpEntity<>(request, headers);
        String aiResponse;

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    PYTHON_AI_URL + "/planTrip",
                    httpRequest,
                    Map.class
            );

            if (response.getBody() != null && response.getBody().containsKey("json_itinerary")) {
                aiResponse = (String) response.getBody().get("json_itinerary");
            } else {
                throw new RuntimeException("Invalid response format from Python AI service.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to call Python AI service: " + e.getMessage());
        }


        try {

            // =====================================================
            // CLEAN AI RESPONSE
            // =====================================================

            String cleanJson = aiResponse
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();


            // =====================================================
            // PARSE JSON
            // =====================================================

            JsonNode root =
                    objectMapper.readTree(cleanJson);

            JsonNode tripDetails =
                    root.get("trip_details");

            JsonNode itineraryArray =
                    root.get("itinerary");

            JsonNode budgetBreakdown =
                    root.get("budget_breakdown");


            // =====================================================
            // CHECK JSON
            // =====================================================

            if (tripDetails == null) {

                throw new RuntimeException(
                        "AI response does not contain trip_details"
                );
            }

            if (itineraryArray == null
                    || !itineraryArray.isArray()) {

                throw new RuntimeException(
                        "AI response does not contain valid itinerary array"
                );
            }


            // =====================================================
            // 1. FIND USER
            // =====================================================

            if (request.getUserId() == null) {

                throw new RuntimeException(
                        "userId is required in TripPlanRequest"
                );
            }

            Users user =
                    usersRepository
                            .findById(request.getUserId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User not found with ID: "
                                            + request.getUserId()
                                    )
                            );


            // =====================================================
            // 2. CREATE TRIP
            // =====================================================

            Trips trip =
                    new Trips();

            trip.setUser(user);


            // Trip Name
            String tripName =
                    request.getStartLocation()
                    + " to "
                    + String.join(
                            ", ",
                            request.getDestinations()
                    );

            trip.setTripName(tripName);


            // Start Location
            trip.setStartLocation(
                    request.getStartLocation()
            );


            // Start Date
            trip.setStartDate(
                    LocalDate.parse(
                            request.getStartDate()
                    )
            );


            // End Date
            trip.setEndDate(
                    LocalDate.parse(
                            request.getEndDate()
                    )
            );


            // Travellers
            trip.setTravellers(
                    request.getTravellers()
            );


            // Budget
            trip.setBudget(
                    request.getBudget()
            );


            // Currency
            trip.setCurrency(
                    request.getCurrency()
            );


            // Pace
            trip.setPace(
                    request.getPace()
            );


            // Accommodation
            trip.setAccommodation(
                    request.getAccommodation()
            );


            // Transport
            trip.setTransport(
                    request.getTransport()
            );


            // Food
            trip.setFood(
                    request.getFood()
            );


            // Requirements
            trip.setRequirements(
                    request.getRequirements()
            );


            // Status
            trip.setStatus(
                    "PLANNED"
            );


            // =====================================================
            // SAVE TRIP
            // =====================================================

            Trips savedTrip =
                    tripsRepository.save(trip);


            System.out.println(
                    "Trip saved successfully. Trip ID: "
                    + savedTrip.getTripId()
            );


            // =====================================================
            // 3. CREATE ITINERARY
            // =====================================================

            Itineraries itinerary =
                    new Itineraries();


            // Connect itinerary with trip
            itinerary.setTrip(
                    savedTrip
            );


            // Title
            itinerary.setTitle(
                    savedTrip.getTripName()
            );


            // Description
            itinerary.setDescription(
                    "AI generated travel itinerary for "
                    + String.join(
                            ", ",
                            request.getDestinations()
                    )
            );


            // =====================================================
            // TOTAL BUDGET
            // =====================================================

            if (budgetBreakdown != null
                    && budgetBreakdown.has(
                            "total_estimated_cost_inr")) {

                itinerary.setTotalBudget(
                        budgetBreakdown
                                .get(
                                        "total_estimated_cost_inr"
                                )
                                .asDouble()
                );

            } else {

                itinerary.setTotalBudget(
                        request.getBudget()
                );
            }


            // Generated By
            itinerary.setGeneratedBy(
                    "Gemini AI"
            );


            // =====================================================
            // SAVE ITINERARY
            // =====================================================

            Itineraries savedItinerary =
                    itinerariesRepository.save(
                            itinerary
                    );


            System.out.println(
                    "Itinerary saved successfully. Itinerary ID: "
                    + savedItinerary.getItineraryId()
            );


            // =====================================================
            // 4. SAVE ITINERARY ITEMS
            // =====================================================

            for (JsonNode day :
                    itineraryArray) {


                // -------------------------------------------------
                // DAY NUMBER
                // -------------------------------------------------

                int dayNumber =
                        day.has("day")
                        ? day.get("day").asInt()
                        : 0;


                // -------------------------------------------------
                // LOCATION
                // -------------------------------------------------

                String location =
                        day.has("location")
                        ? day.get("location").asText()
                        : "Unknown";


                // -------------------------------------------------
                // ACTIVITIES ARRAY
                // -------------------------------------------------

                JsonNode activities =
                        day.get("activities");


                if (activities != null
                        && activities.isArray()) {


                    for (JsonNode activity :
                            activities) {


                        // Time
                        String time =
                                activity.has("time")
                                ? activity
                                        .get("time")
                                        .asText()
                                : "";


                        // Description
                        String description =
                                activity.has("description")
                                ? activity
                                        .get("description")
                                        .asText()
                                : "";


                        // Cost
                        double cost =
                                activity.has("cost_inr")
                                ? activity
                                        .get("cost_inr")
                                        .asDouble()
                                : 0.0;


                        // =================================================
                        // CREATE ITINERARY ITEM
                        // =================================================

                        ItineraryItems item =
                                new ItineraryItems();


                        // Connect to itinerary
                        item.setItinerary(
                                savedItinerary
                        );


                        // Day Number
                        item.setDayNumber(
                                dayNumber
                        );


                        // Activity Name
                        item.setActivityName(
                                description
                        );


                        // Location
                        item.setLocation(
                                location
                        );


                        // Activity Type
                        item.setActivityType(
                                time
                        );


                        // Notes
                        item.setNotes(
                                "Estimated Cost: ₹"
                                + cost
                        );


                        // =================================================
                        // SAVE ITEM
                        // =================================================

                        ItineraryItems savedItem =
                                itineraryItemsRepository.save(
                                        item
                                );


                        System.out.println(
                                "Itinerary item saved. Item ID: "
                                + savedItem.getItemId()
                        );
                    }
                }
            }


            // =====================================================
            // 5. RETURN AI JSON
            // =====================================================

            return cleanJson;


        } catch (Exception e) {

            e.printStackTrace();

            throw new RuntimeException(
                    "Failed to generate and save itinerary: "
                    + e.getMessage()
            );
        }
    }
}
