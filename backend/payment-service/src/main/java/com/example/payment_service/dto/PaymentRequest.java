package com.example.payment_service.dto;

public class PaymentRequest {
    private long amount;
    private long quantity;
    private String currency;
    private Long bookingId;

    public PaymentRequest(long amount, long quantity, String currency) {
        this.amount = amount;
        this.quantity = quantity;
        this.currency = currency;
    }

    public long getAmount() {
        return amount;
    }

    public void setAmount(long amount) {
        this.amount = amount;
    }

    public long getQuantity() {
        return quantity;
    }

    public void setQuantity(long quantity) {
        this.quantity = quantity;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public PaymentRequest() {
    }
}

