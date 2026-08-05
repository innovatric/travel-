package com.example.demo.models;

import jakarta.persistence.*;

@Entity
@Table(name = "destinations")
public class Destinations {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "destination_id")
    private Long destinationId;

    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = true)
    private Trips trip;

    @Column(name = "destination_name")
    private String destinationName;

    private String name;
    private String country;

    @Column(length = 1000)
    private String description;

    private String category;

    @Column(nullable = true)
    private Double latitude;

    @Column(nullable = true)
    private Double longitude;

    @Column(name = "sequence_no")
    private Integer sequenceNo;

    // Default Constructor
    public Destinations() {
    }

    // Parameterized Constructor
    public Destinations(Long destinationId, Trips trip, String destinationName, String name, String country,
                        String description, String category, Double latitude, Double longitude, Integer sequenceNo) {
        this.destinationId = destinationId;
        this.trip = trip;
        this.destinationName = destinationName;
        this.name = name;
        this.country = country;
        this.description = description;
        this.category = category;
        this.latitude = latitude;
        this.longitude = longitude;
        this.sequenceNo = sequenceNo;
    }

    // Getters and Setters

    public Long getDestinationId() {
        return destinationId;
    }

    public void setDestinationId(Long destinationId) {
        this.destinationId = destinationId;
    }

    public Trips getTrip() {
        return trip;
    }

    public void setTrip(Trips trip) {
        this.trip = trip;
    }

    public String getDestinationName() {
        return destinationName != null ? destinationName : name;
    }

    public void setDestinationName(String destinationName) {
        this.destinationName = destinationName;
        if (this.name == null) {
            this.name = destinationName;
        }
    }

    public String getName() {
        return name != null ? name : destinationName;
    }

    public void setName(String name) {
        this.name = name;
        if (this.destinationName == null) {
            this.destinationName = name;
        }
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
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

    public Integer getSequenceNo() {
        return sequenceNo;
    }

    public void setSequenceNo(Integer sequenceNo) {
        this.sequenceNo = sequenceNo;
    }
}