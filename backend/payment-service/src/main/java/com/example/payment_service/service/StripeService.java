package com.example.payment_service.service;

import com.example.payment_service.dto.PaymentRequest;
import com.example.payment_service.dto.StripeResponse;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StripeService {

    @Value("${stripe.secretKey}")
    private String secretKey;

    public StripeResponse payAmount(PaymentRequest paymentRequest) {
        Stripe.apiKey = secretKey;

        SessionCreateParams.LineItem.PriceData.ProductData productData = SessionCreateParams.LineItem.PriceData.ProductData
                .builder()
                .setName("Workshop Ticket")
                .build();

        SessionCreateParams.LineItem.PriceData priceData = SessionCreateParams.LineItem.PriceData
                .builder()
                .setCurrency(paymentRequest.getCurrency())
                .setUnitAmount(paymentRequest.getAmount() * 100)
                .setProductData(productData)
                .build();

        SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem
                .builder()
                .setQuantity(paymentRequest.getQuantity())
                .setPriceData(priceData)
                .build();

        String successUrl = "http://localhost:3000/payment-success";
        if (paymentRequest.getBookingId() != null) {
            successUrl += "?bookingId=" + paymentRequest.getBookingId();
        }

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(successUrl)
                .setCancelUrl("http://localhost:3000/payment-cancel")
                .addLineItem(lineItem)
                .build();

        try {
            Session session = Session.create(params);
            return StripeResponse.builder()
                    .status("Success")
                    .message("Payment Done")
                    .sessionId(session.getId())
                    .sessionUrl(session.getUrl())
                    .build();
        } catch (StripeException e) {
            return StripeResponse.builder()
                    .status("Failed")
                    .message("Payment failed: " + e.getMessage())
                    .build();
        }
    }
}
