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
    @JoinColumn(name = "trip_id", nullable = false)
    private Trips trip;

    @Column(name = "destination_name", nullable = false)
    private String destinationName;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "sequence_no")
    private Integer sequenceNo;

    // Default Constructor
    public Destinations() {
    }

    // Parameterized Constructor
    public Destinations(Long destinationId, Trips trip, String destinationName,
                        Double latitude, Double longitude, Integer sequenceNo) {
        this.destinationId = destinationId;
        this.trip = trip;
        this.destinationName = destinationName;
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
        return destinationName;
    }

    public void setDestinationName(String destinationName) {
        this.destinationName = destinationName;
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