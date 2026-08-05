package com.example.demo.models;

import jakarta.persistence.*;

@Entity
@Table(name = "restaurants")
public class Restaurants {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "restaurant_id")
    private Long restaurantId;

    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false)
    private Trips trip;

    @Column(name = "restaurant_name", nullable = false)
    private String restaurantName;

    @Column(nullable = false)
    private String location;

    private Double rating;

    private String cuisine;

    @Column(name = "price_range")
    private String priceRange;

    private Double latitude;

    private Double longitude;

    // Default Constructor
    public Restaurants() {
    }

    // Parameterized Constructor
    public Restaurants(Long restaurantId, Trips trip,
                       String restaurantName, String location,
                       Double rating, String cuisine,
                       String priceRange, Double latitude,
                       Double longitude) {
        this.restaurantId = restaurantId;
        this.trip = trip;
        this.restaurantName = restaurantName;
        this.location = location;
        this.rating = rating;
        this.cuisine = cuisine;
        this.priceRange = priceRange;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    // Getters and Setters

    public Long getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }

    public Trips getTrip() {
        return trip;
    }

    public void setTrip(Trips trip) {
        this.trip = trip;
    }

    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getCuisine() {
        return cuisine;
    }

    public void setCuisine(String cuisine) {
        this.cuisine = cuisine;
    }

    public String getPriceRange() {
        return priceRange;
    }

    public void setPriceRange(String priceRange) {
        this.priceRange = priceRange;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}