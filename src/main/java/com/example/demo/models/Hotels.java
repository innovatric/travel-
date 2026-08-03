package com.example.demo.models;

import jakarta.persistence.*;

@Entity
@Table(name = "hotels")
public class Hotels {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hotel_id")
    private Long hotelId;

    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false)
    private Trips trip;

    @Column(name = "hotel_name", nullable = false)
    private String hotelName;

    @Column(nullable = false)
    private String address;

    @Column(name = "price_per_night")
    private Double pricePerNight;

    private Double rating;

    private Double latitude;

    private Double longitude;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "booking_link")
    private String bookingLink;

    // Default Constructor
    public Hotels() {
    }

    // Parameterized Constructor
    public Hotels(Long hotelId, Trips trip, String hotelName,
                  String address, Double pricePerNight,
                  Double rating, Double latitude,
                  Double longitude, String imageUrl,
                  String bookingLink) {
        this.hotelId = hotelId;
        this.trip = trip;
        this.hotelName = hotelName;
        this.address = address;
        this.pricePerNight = pricePerNight;
        this.rating = rating;
        this.latitude = latitude;
        this.longitude = longitude;
        this.imageUrl = imageUrl;
        this.bookingLink = bookingLink;
    }

    // Getters and Setters

    public Long getHotelId() {
        return hotelId;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
    }

    public Trips getTrip() {
        return trip;
    }

    public void setTrip(Trips trip) {
        this.trip = trip;
    }

    public String getHotelName() {
        return hotelName;
    }

    public void setHotelName(String hotelName) {
        this.hotelName = hotelName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Double getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(Double pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
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

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getBookingLink() {
        return bookingLink;
    }

    public void setBookingLink(String bookingLink) {
        this.bookingLink = bookingLink;
    }
}