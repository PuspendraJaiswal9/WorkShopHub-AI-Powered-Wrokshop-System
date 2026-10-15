package com.example.registration_service.payclient;

import com.example.registration_service.dto.PaymentRequest;
import com.example.registration_service.dto.StripeResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name="payment-service")
public interface PayClient {
    @PostMapping("/payment/pay")
    public StripeResponse makePayment(@RequestBody PaymentRequest paymentRequest);
}
