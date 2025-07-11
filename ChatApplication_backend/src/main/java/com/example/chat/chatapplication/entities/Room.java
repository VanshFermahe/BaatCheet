package com.example.chat.chatapplication.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "rooms")
public class Room {

    @Id
    private String roomId;

    private List<String> members = new ArrayList<>();
    private List<Message> messages = new ArrayList<>();
}
