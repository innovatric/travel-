package com.example.demo.models;

import jakarta.persistence.*;

@Entity
@Table(name = "itinerary_items")
public class ItineraryItems {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long itemId;

    @ManyToOne
    @JoinColumn(name = "itinerary_id", nullable = false)
    private Itineraries itinerary;

    @Column(name = "day_number", nullable = false)
    private Integer dayNumber;

    @Column(name = "activity_name", nullable = false)
    private String activityName;

    @Column(name = "start_time")
    private String startTime;

    @Column(name = "end_time")
    private String endTime;

    @Column(nullable = false)
    private String location;

    @Column(name = "activity_type")
    private String activityType;

    @Column(name = "estimated_cost")
    private Double estimatedCost;

    @Column(columnDefinition = "TEXT")
    private String notes;

    // Default Constructor
    public ItineraryItems() {
    }

    // Parameterized Constructor
    public ItineraryItems(Long itemId, Itineraries itinerary, Integer dayNumber,
                          String activityName, String startTime, String endTime,
                          String location, String activityType,
                          Double estimatedCost, String notes) {
        this.itemId = itemId;
        this.itinerary = itinerary;
        this.dayNumber = dayNumber;
        this.activityName = activityName;
        this.startTime = startTime;
        this.endTime = endTime;
        this.location = location;
        this.activityType = activityType;
        this.estimatedCost = estimatedCost;
        this.notes = notes;
    }

    // Getters and Setters

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public Itineraries getItinerary() {
        return itinerary;
    }

    public void setItinerary(Itineraries itinerary) {
        this.itinerary = itinerary;
    }

    public Integer getDayNumber() {
        return dayNumber;
    }

    public void setDayNumber(Integer dayNumber) {
        this.dayNumber = dayNumber;
    }

    public String getActivityName() {
        return activityName;
    }

    public void setActivityName(String activityName) {
        this.activityName = activityName;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public Double getEstimatedCost() {
        return estimatedCost;
    }

    public void setEstimatedCost(Double estimatedCost) {
        this.estimatedCost = estimatedCost;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}