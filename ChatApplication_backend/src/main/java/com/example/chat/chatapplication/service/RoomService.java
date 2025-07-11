package com.example.chat.chatapplication.service;

import com.example.chat.chatapplication.entities.Message;
import com.example.chat.chatapplication.entities.Room;
import com.example.chat.chatapplication.playLoad.MessageRequest;
import com.example.chat.chatapplication.repositories.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    public Room findByRoomId(String roomId) {
        return roomRepository.findById(roomId).orElse(null);
    }

    public Room createRoom(String roomId) {
        Room room = new Room();
        room.setRoomId(roomId);
        return roomRepository.save(room);
    }

    public Message addMessage(String roomId, MessageRequest request) {
        Room room = findByRoomId(roomId);
        if (room != null) {
            Message message = new Message(request.getSender(), request.getContent());
            room.getMessages().add(message);

            if (!room.getMembers().contains(request.getSender())) {
                room.getMembers().add(request.getSender());
            }

            roomRepository.save(room);
            return message;
        }
        return new Message("System", "Room not found");
    }

    public List<String> getRoomMembers(String roomId) {
        Room room = findByRoomId(roomId);
        return room != null ? room.getMembers() : List.of();
    }
}
