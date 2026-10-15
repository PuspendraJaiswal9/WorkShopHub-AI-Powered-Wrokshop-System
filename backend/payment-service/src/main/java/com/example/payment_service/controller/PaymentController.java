package com.example.payment_service.controller;

import com.example.payment_service.dto.PaymentRequest;
import com.example.payment_service.dto.StripeResponse;
import com.example.payment_service.service.StripeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    private StripeService st;

    @PostMapping("/pay")
    public StripeResponse makePayment(@RequestBody PaymentRequest paymentRequest){
        return  st.payAmount(paymentRequest);
    }
}
