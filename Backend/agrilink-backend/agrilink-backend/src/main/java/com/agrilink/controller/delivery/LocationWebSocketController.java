package com.agrilink.controller.delivery;

import com.agrilink.dto.delivery.LocationUpdate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class LocationWebSocketController {

    @MessageMapping("/driver/location")
    @SendTo("/topic/order-tracking")
    public LocationUpdate broadcastLocation(LocationUpdate update) {
        System.out.println("Received location update for order " + update.getOrderId() + 
                           ": Lat=" + update.getLatitude() + ", Lng=" + update.getLongitude());
        return update;
    }
}
