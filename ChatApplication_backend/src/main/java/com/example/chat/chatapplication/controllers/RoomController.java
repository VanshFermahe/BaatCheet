package com.example.chat.chatapplication.controllers;

import com.example.chat.chatapplication.entities.Message;
import com.example.chat.chatapplication.entities.Room;
import com.example.chat.chatapplication.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/api/v1/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody String roomId) {
        Room existing = roomService.findByRoomId(roomId);
        if (existing != null) {
            return ResponseEntity.badRequest().body("Room already exists");
        }
        Room room = roomService.createRoom(roomId);
        return new ResponseEntity<>(room, HttpStatus.CREATED);
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<?> getRoom(@PathVariable String roomId) {
        Room room = roomService.findByRoomId(roomId);
        if (room == null) {
            return ResponseEntity.badRequest().body("Room Not Found!!");
        }
        return ResponseEntity.ok(room);
    }

    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<Message>> getMessages(
            @PathVariable String roomId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        Room room = roomService.findByRoomId(roomId);
        if (room == null) {
            return ResponseEntity.badRequest().build();
        }

        List<Message> allMessages = room.getMessages();
        Collections.reverse(allMessages);

        int fromIndex = Math.min(page * size, allMessages.size());
        int toIndex = Math.min(fromIndex + size, allMessages.size());

        return ResponseEntity.ok(allMessages.subList(fromIndex, toIndex));
    }

    @GetMapping("/{roomId}/members")
    public ResponseEntity<?> getRoomMembers(@PathVariable String roomId) {
        Room room = roomService.findByRoomId(roomId);
        if (room == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room Not Found");
        }

        return ResponseEntity.ok(room.getMembers());
    }
}
