package com.example.chat.chatapplication.playLoad;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageRequest {
    private String content;
    private String sender;
    private String roomId;
}
