package com.example.chat.chatapplication.service;

import com.example.chat.chatapplication.repositories.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChatService {
    @Autowired
    private RoomRepository roomRepository;
}
