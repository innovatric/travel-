package com.example.demo.models;

import jakarta.persistence.*;

@Entity
@Table(name = "budgets")
public class Budgets {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "budget_id")
    private Long budgetId;

    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false)
    private Trips trip;

    @Column(name = "hotel_cost")
    private Double hotelCost;

    @Column(name = "flight_cost")
    private Double flightCost;

    @Column(name = "food_cost")
    private Double foodCost;

    @Column(name = "transport_cost")
    private Double transportCost;

    @Column(name = "shopping_cost")
    private Double shoppingCost;

    private Double miscellaneous;

    @Column(name = "total_cost")
    private Double totalCost;

    // Default Constructor
    public Budgets() {
    }

    // Parameterized Constructor
    public Budgets(Long budgetId, Trips trip, Double hotelCost,
                   Double flightCost, Double foodCost,
                   Double transportCost, Double shoppingCost,
                   Double miscellaneous, Double totalCost) {
        this.budgetId = budgetId;
        this.trip = trip;
        this.hotelCost = hotelCost;
        this.flightCost = flightCost;
        this.foodCost = foodCost;
        this.transportCost = transportCost;
        this.shoppingCost = shoppingCost;
        this.miscellaneous = miscellaneous;
        this.totalCost = totalCost;
    }

    // Getters and Setters

    public Long getBudgetId() {
        return budgetId;
    }

    public void setBudgetId(Long budgetId) {
        this.budgetId = budgetId;
    }

    public Trips getTrip() {
        return trip;
    }

    public void setTrip(Trips trip) {
        this.trip = trip;
    }

    public Double getHotelCost() {
        return hotelCost;
    }

    public void setHotelCost(Double hotelCost) {
        this.hotelCost = hotelCost;
    }

    public Double getFlightCost() {
        return flightCost;
    }

    public void setFlightCost(Double flightCost) {
        this.flightCost = flightCost;
    }

    public Double getFoodCost() {
        return foodCost;
    }

    public void setFoodCost(Double foodCost) {
        this.foodCost = foodCost;
    }

    public Double getTransportCost() {
        return transportCost;
    }

    public void setTransportCost(Double transportCost) {
        this.transportCost = transportCost;
    }

    public Double getShoppingCost() {
        return shoppingCost;
    }

    public void setShoppingCost(Double shoppingCost) {
        this.shoppingCost = shoppingCost;
    }

    public Double getMiscellaneous() {
        return miscellaneous;
    }

    public void setMiscellaneous(Double miscellaneous) {
        this.miscellaneous = miscellaneous;
    }

    public Double getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(Double totalCost) {
        this.totalCost = totalCost;
    }
}