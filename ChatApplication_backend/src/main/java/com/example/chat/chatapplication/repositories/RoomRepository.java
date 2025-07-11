package com.example.chat.chatapplication.repositories;

import com.example.chat.chatapplication.entities.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoomRepository extends MongoRepository<Room, String> {
}
