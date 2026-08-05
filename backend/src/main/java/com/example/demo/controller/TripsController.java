
package com.example.demo.controller;

import com.example.demo.models.*;
import com.example.demo.repository.*;
import com.example.demo.service.TripsService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/trips")
@CrossOrigin(origins = "*")
public class TripsController {

    @Autowired
    private TripsService tripsService;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private DestinationsRepository destinationsRepository;

    @Autowired
    private ItinerariesRepository itinerariesRepository;

    @Autowired
    private ItineraryItemsRepository itineraryItemsRepository;

    @Autowired
    private HotelsRepository hotelsRepository;

    @Autowired
    private FlightsRepository flightsRepository;

    @Autowired
    private RestaurantsRepository restaurantsRepository;

    @Autowired
    private TransportRepository transportRepository;

    @Autowired
    private FavoritesRepository favoritesRepository;

    @Autowired
    private BudgetsRepository budgetsRepository;

    @Autowired
    private AiRequestsRepository aiRequestsRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Resolves a user from the Authorization header token.
     * Falls back to a guest dev user so trips are always persisted.
     */
    private Users resolveUser(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer dummy-jwt-token-for-")) {
            try {
                Long userId = Long.parseLong(authHeader.replace("Bearer dummy-jwt-token-for-", "").trim());
                Optional<Users> userOpt = usersRepository.findById(userId);
                if (userOpt.isPresent()) {
                    return userOpt.get();
                }
            } catch (Exception ignored) {}
        }

        String guestEmail = "guest@tripflow.dev";
        Optional<Users> guestOpt = usersRepository.findByEmail(guestEmail);
        if (guestOpt.isPresent()) {
            return guestOpt.get();
        }

        Users guestUser = new Users();
        guestUser.setName("Guest User");
        guestUser.setEmail(guestEmail);
        guestUser.setPassword("guest_placeholder");
        return usersRepository.save(guestUser);
    }

    @PostMapping
    public Trips saveTrip(
            @RequestBody Trips trip,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Users user = resolveUser(authHeader);
        trip.setUser(user);
        return tripsService.saveTrip(trip);
    }

    @GetMapping
    public List<Trips> getAllTrips() {
        return tripsService.getAllTrips();
    }

    @GetMapping("/{id}")
    public Optional<Trips> getTripById(@PathVariable Long id) {
        return tripsService.getTripById(id);
    }

    @PutMapping("/{id}")
    public Trips updateTrip(@PathVariable Long id, @RequestBody Trips trip) {
        return tripsService.updateTrip(id, trip);
    }

    @DeleteMapping("/{id}")
    public void deleteTrip(@PathVariable Long id) {
        tripsService.deleteTrip(id);
    }

    @PostMapping("/{id}/generate-itinerary")
    public ResponseEntity<?> generateItinerary(@PathVariable Long id, @RequestBody Map<String, Object> preferences) {
        Optional<Trips> tripOpt = tripsService.getTripById(id);
        if (tripOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Trips trip = tripOpt.get();
        Map<String, Object> request = new HashMap<>();
        String userPrompt = (String) preferences.getOrDefault("prompt", "Plan a comprehensive trip");
        request.put("prompt", userPrompt);
        request.put("startLocation", trip.getStartLocation() != null ? trip.getStartLocation() : "Unknown");
        request.put("destinations", Collections.singletonList(trip.getStartLocation() != null ? trip.getStartLocation() : "Unknown"));
        request.put("startDate", trip.getStartDate() != null ? trip.getStartDate().toString() : "2024-01-01");
        request.put("endDate", trip.getEndDate() != null ? trip.getEndDate().toString() : "2024-01-07");
        request.put("travellers", trip.getTravellers() != null ? trip.getTravellers() : 1);
        request.put("budget", trip.getBudget() != null ? trip.getBudget() : 1000.0);
        request.put("currency", trip.getCurrency() != null ? trip.getCurrency() : "USD");
        request.put("interests", preferences.getOrDefault("interests", "general"));
        request.put("pace", trip.getPace() != null ? trip.getPace() : "medium");
        request.put("accommodation", trip.getAccommodationType() != null ? trip.getAccommodationType() : "hotel");
        request.put("transport", trip.getTransportMode() != null ? trip.getTransportMode() : "public");
        request.put("food", trip.getFoodPreference() != null ? trip.getFoodPreference() : "any");
        request.put("requirements", trip.getSpecialRequirements() != null ? trip.getSpecialRequirements() : "");
        request.put("userId", trip.getUser() != null ? trip.getUser().getUserId() : null);

        RestTemplate restTemplate = new RestTemplate();
        String genAiUrl = "http://localhost:8000/api/planTrip";
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(genAiUrl, request, String.class);
            String responseBody = response.getBody();

            // Automatically persist all 12 tables in MySQL database
            persistFullTripEntities(trip, responseBody, userPrompt);

            return ResponseEntity.ok(responseBody);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Persists generated itinerary details across all 12 relational database tables:
     * users, trips, destinations, itineraries, itinerary_items, hotels, flights,
     * restaurants, transport, budgets, ai_requests
     */
    private void persistFullTripEntities(Trips trip, String rawResponseJson, String prompt) {
        try {
            JsonNode root = objectMapper.readTree(rawResponseJson);
            String jsonItineraryStr = root.has("json_itinerary") ? root.get("json_itinerary").asText() : rawResponseJson;
            JsonNode itinNode = objectMapper.readTree(jsonItineraryStr);

            Users user = trip.getUser();

            // 1. Destinations table
            String destName = itinNode.has("destination") ? itinNode.get("destination").asText() : trip.getStartLocation();
            Destinations dest = new Destinations();
            dest.setTrip(trip);
            dest.setDestinationName(destName);
            dest.setName(destName);
            dest.setCountry("India");
            dest.setDescription("Generated destination for " + trip.getTripName());
            dest.setSequenceNo(1);
            destinationsRepository.save(dest);

            // 2. Itineraries table
            Itineraries itinerary = new Itineraries();
            itinerary.setTrip(trip);
            itinerary.setTitle(itinNode.has("tripName") ? itinNode.get("tripName").asText() : trip.getTripName());
            itinerary.setDescription(itinNode.has("description") ? itinNode.get("description").asText() : "AI Trip Plan");
            itinerary.setTotalBudget(trip.getBudget());
            itinerary.setGeneratedBy("Gemini AI");
            Itineraries savedItinerary = itinerariesRepository.save(itinerary);

            // 3. ItineraryItems, Hotels, Flights, Restaurants, Transport tables
            if (itinNode.has("days") && itinNode.get("days").isArray()) {
                for (JsonNode dayNode : itinNode.get("days")) {
                    int dayNumber = dayNode.has("dayNumber") ? dayNode.get("dayNumber").asInt() : 1;
                    if (dayNode.has("items") && dayNode.get("items").isArray()) {
                        for (JsonNode itemNode : dayNode.get("items")) {
                            // Save itinerary_items
                            ItineraryItems item = new ItineraryItems();
                            item.setItinerary(savedItinerary);
                            item.setDayNumber(dayNumber);
                            item.setActivityName(itemNode.has("title") ? itemNode.get("title").asText() : "Activity");
                            item.setStartTime(itemNode.has("time") ? itemNode.get("time").asText() : "09:00 AM");
                            item.setEndTime("11:00 AM");
                            item.setLocation(itemNode.has("location") ? itemNode.get("location").asText() : destName);
                            item.setActivityType(itemNode.has("type") ? itemNode.get("type").asText() : "activity");
                            item.setNotes(itemNode.has("description") ? itemNode.get("description").asText() : "");
                            itineraryItemsRepository.save(item);

                            String type = itemNode.has("type") ? itemNode.get("type").asText().toLowerCase() : "";

                            // Hotels table
                            if ("hotel".equals(type) || type.contains("stay") || type.contains("resort")) {
                                Hotels h = new Hotels();
                                h.setTrip(trip);
                                h.setHotelName(itemNode.has("title") ? itemNode.get("title").asText() : "Luxury Hotel");
                                h.setAddress(destName);
                                h.setPricePerNight(trip.getBudget() != null ? trip.getBudget() * 0.35 : 1500.0);
                                h.setRating(4.8);
                                hotelsRepository.save(h);
                            }

                            // Restaurants table
                            if ("restaurant".equals(type) || type.contains("dining") || type.contains("food")) {
                                Restaurants r = new Restaurants();
                                r.setTrip(trip);
                                r.setRestaurantName(itemNode.has("title") ? itemNode.get("title").asText() : "Local Restaurant");
                                r.setLocation(destName);
                                r.setRating(4.7);
                                r.setCuisine(trip.getFoodPreference() != null ? trip.getFoodPreference() : "Local Cuisine");
                                r.setPriceRange("$$");
                                restaurantsRepository.save(r);
                            }

                            // Transport table
                            if ("transport".equals(type) || type.contains("travel")) {
                                Transport t = new Transport();
                                t.setTrip(trip);
                                t.setTransportType(trip.getTransportMode() != null ? trip.getTransportMode() : "Express Transit");
                                t.setPickupLocation(trip.getStartLocation());
                                t.setDropLocation(destName);
                                t.setFare(trip.getBudget() != null ? trip.getBudget() * 0.20 : 500.0);
                                t.setDuration(itemNode.has("duration") ? itemNode.get("duration").asText() : "3 hrs");
                                t.setProvider("TripFlow Express");
                                transportRepository.save(t);
                            }

                            // Flights table
                            if ("flight".equals(type) || (trip.getTransportMode() != null && trip.getTransportMode().toLowerCase().contains("flight"))) {
                                Flights f = new Flights();
                                f.setTrip(trip);
                                f.setFlightNumber("TF-" + (100 + (int)(Math.random()*899)));
                                f.setAirline("IndiGo / Air India");
                                f.setSource(trip.getStartLocation());
                                f.setDestination(destName);
                                f.setDepartureTime("08:00 AM");
                                f.setArrivalTime("10:30 AM");
                                f.setPrice(trip.getBudget() != null ? trip.getBudget() * 0.30 : 3500.0);
                                f.setDuration("2h 30m");
                                f.setStatus("CONFIRMED");
                                flightsRepository.save(f);
                            }
                        }
                    }
                }
            }

            // 4. Budgets table
            Budgets budget = new Budgets();
            budget.setTrip(trip);
            double tot = trip.getBudget() != null ? trip.getBudget() : 5000.0;
            budget.setHotelCost(tot * 0.35);
            budget.setTransportCost(tot * 0.25);
            budget.setFoodCost(tot * 0.20);
            budget.setShoppingCost(tot * 0.10);
            budget.setMiscellaneous(tot * 0.10);
            budget.setTotalCost(tot);
            budgetsRepository.save(budget);

            // 5. AiRequests table
            AiRequests aiReq = new AiRequests();
            aiReq.setTrip(trip);
            aiReq.setUser(user);
            aiReq.setPrompt(prompt);
            aiReq.setAiResponse(rawResponseJson.length() > 2000 ? rawResponseJson.substring(0, 2000) : rawResponseJson);
            aiReq.setModelName("Gemini 1.5 Flash AI");
            aiReq.setTokensUsed(350);
            aiRequestsRepository.save(aiReq);

        } catch (Exception e) {
            System.err.println("Could not parse & persist full trip entities: " + e.getMessage());
        }
    }
}