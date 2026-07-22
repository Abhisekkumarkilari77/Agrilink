package com.agrilink.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SmsService {

    @Value("${twilio.account-sid:}")
    private String accountSid;

    @Value("${twilio.auth-token:}")
    private String authToken;

    @Value("${twilio.phone-number:}")
    private String fromPhoneNumber;

    private boolean isTwilioConfigured = false;

    @PostConstruct
    public void init() {
        if (accountSid != null && !accountSid.trim().isEmpty() && 
            authToken != null && !authToken.trim().isEmpty()) {
            try {
                Twilio.init(accountSid, authToken);
                isTwilioConfigured = true;
                System.out.println("Twilio SMS Service initialized successfully.");
            } catch (Exception e) {
                System.err.println("Failed to initialize Twilio: " + e.getMessage());
            }
        } else {
            System.out.println("Twilio credentials not fully configured. Falling back to Console SMS Logging.");
        }
    }

    public void sendSms(String toPhoneNumber, String messageText) {
        if (isTwilioConfigured && fromPhoneNumber != null && !fromPhoneNumber.trim().isEmpty()) {
            try {
                Message message = Message.creator(
                        new PhoneNumber(toPhoneNumber),
                        new PhoneNumber(fromPhoneNumber),
                        messageText
                ).create();
                System.out.println("SMS sent successfully. SID: " + message.getSid());
            } catch (Exception e) {
                System.err.println("Failed to send Twilio SMS to " + toPhoneNumber + ": " + e.getMessage());
                logFallback(toPhoneNumber, messageText);
            }
        } else {
            logFallback(toPhoneNumber, messageText);
        }
    }

    private void logFallback(String toPhoneNumber, String messageText) {
        System.out.println("=================================================");
        System.out.println("MOCK SMS DISPATCH TO: " + toPhoneNumber);
        System.out.println("SMS TEXT: " + messageText);
        System.out.println("=================================================");
    }
}
