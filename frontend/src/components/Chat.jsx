import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLoaderData } from "react-router-dom";
import { fetchMessages, onSendMessage } from "../utils/chat";
import Filter from "bad-words";

import {
  ChatButton,
  ChatContainer,
  ChatContent,
  ChatForm,
  ChatInput,
} from "../themes/componentsStyles";

function Chat(props) {
  const [content, setContent] = useState("");
  const { email } = useSelector((state) => state.user);
  const roomId = useLoaderData();
  const [messages, setMessages] = useState([]);
  const filter = new Filter();

  const {
    dateTimeJoined,
  } = props; 


  useEffect(() => {
    fetchMessages(dateTimeJoined, setMessages);
  }, [messages]);

  const filterContent = (hasBadWords) => {
    const filteredContent = hasBadWords
      ? "This message was deleted due to inappropriate language"
      : content;

    return filteredContent;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !content) return;

    onSendMessage({
      email,
      content: filterContent(filter.isProfane(content)),
      providerId: roomId,
    });
    setContent("");
  };
  return (
    <ChatContainer>
      <ChatContent>
        {messages?.map((m) => (
          // eslint-disable-next-line react/jsx-key
          <p>
            <strong>{m.email}:</strong> {m.content}
          </p>
        ))}
      </ChatContent>
      <ChatForm
        onSubmit={handleSubmit}
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <ChatInput
          type="text"
          placeholder="Message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          multiline
          minRows={1}
          maxRows={3}
          inputProps={{ maxLength: 150 }}
        />
        <ChatButton variant="contained" type="submit">
          Send
        </ChatButton>
      </ChatForm>
    </ChatContainer>
  );
}

export default Chat;
