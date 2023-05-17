import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLoaderData } from "react-router-dom";
import { onSendMessage, onDeleteMessage } from "../utils/chat";
import Filter from "bad-words";
import styled from "styled-components";
import { DeleteOutline as DeleteOutlineIcon } from "@mui/icons-material";
import { Colors } from "../themes/colors";


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
  const filter = new Filter();
  const { 
    messages,
    isUserAdmin,
  } = props;

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
          <MessageChat>
            <TextChat>
              <strong>{m.email}:</strong> {m.content}
            </TextChat>
            {isUserAdmin && <DeleteButton
              onClick={() => {onDeleteMessage(m.id)}}
            >
              <DeleteOutlineIcon sx={{ ml: "2px", color: Colors.red }} />
            </DeleteButton>}
          </MessageChat>
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

const MessageChat = styled.div`
  display: flex;
  justify-content: space-between;
`

const DeleteButton = styled.button`
  border: none;
  cursor: pointer;
  background-color: transparent;
`

const TextChat = styled.p`
  max-width: 80%;
  word-wrap: break-word;
`

export default Chat;
