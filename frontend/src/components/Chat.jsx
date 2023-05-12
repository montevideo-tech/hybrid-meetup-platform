import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLoaderData } from "react-router-dom";
import { subscribeToNewMessages, onSendMessage } from "../utils/chat";
import { supabase } from "../lib/api";
import { epochToISO8601 } from "../utils/time";
import Filter from "bad-words";

import {
  ChatButton,
  ChatContainer,
  ChatContent,
  ChatForm,
  ChatInput,
} from "../themes/componentsStyles";

function Chat() {
  const [content, setContent] = useState("");
  const { email } = useSelector((state) => state.user);
  const roomId = useLoaderData();
  const [messages, setMessages] = useState([]);
  const [dateTimeJoined] = useState(epochToISO8601(Date.now()));
  const filter = new Filter();

  async function fetchMessages() {
    const { data, error } = await supabase
      .from("message-chat")
      .select("*")
      .gt("created_at", dateTimeJoined)
      .order("created_at", { ascending: true });
    if (error) {
      console.error("Error Fetching Messages:", error);
    } else {
      setMessages(data);
    }
  }

  useEffect(() => {
    fetchMessages();
    subscribeToNewMessages();
  }, [messages]);

  // si el contenido tiene malas palabras, devuelve un mensaje para el usuario de que su mensaje
  // fue eliminado por contenido inapropiado, sino devuelve el contenido del mensaje original
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
