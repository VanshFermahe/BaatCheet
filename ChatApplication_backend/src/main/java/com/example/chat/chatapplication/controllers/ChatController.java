package com.example.chat.chatapplication.controllers;

import com.example.chat.chatapplication.entities.Message;
import com.example.chat.chatapplication.playLoad.MessageRequest;
import com.example.chat.chatapplication.service.RoomService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@Controller
@CrossOrigin("http://localhost:5173")
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    @Autowired
    private RoomService roomService;

    @MessageMapping("/sendMessage/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public Message sendMessage(@DestinationVariable String roomId, MessageRequest request) {
        logger.info("Received message from [{}]: {}", request.getSender(), request.getContent());
        return roomService.addMessage(roomId, request);
    }
}
