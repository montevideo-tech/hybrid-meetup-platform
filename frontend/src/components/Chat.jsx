import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLoaderData } from "react-router-dom";
import { onSendMessage, onDeleteMessage } from "../utils/chat";
import Filter from "bad-words";
import styled from "styled-components";
import { Button, TextField } from "@mui/material";
import { Colors } from "../themes/colors";
import { DeleteOutline as DeleteOutlineIcon } from "@mui/icons-material";

function Chat(props) {
  const [content, setContent] = useState("");
  const { email } = useSelector((state) => state.user);
  const roomId = useLoaderData();
  const filter = new Filter();
  const { messages, isUserAdmin } = props;

  const filterContent = (hasBadWords) => {
    const filteredContent = hasBadWords
      ? "This message was deleted due to inappropriate language"
      : content;

    return filteredContent;
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.email !== email) {
      setUnreadMessages((prevUnreadMessages) => prevUnreadMessages + 1);
    }
  }, [messages, email]);

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
        <ChatContentWrapper>
          {messages?.map((m) => (
            <MessageChat key={m.id}>
              <TextChat>
                <strong>{m.email}:</strong> {m.content}
              </TextChat>
              {isUserAdmin && (
                <DeleteButton
                  onClick={() => {
                    onDeleteMessage(m.id);
                  }}
                >
                  <DeleteOutlineIcon sx={{ ml: "2px", color: Colors.red }} />
                </DeleteButton>
              )}
            </MessageChat>
          ))}
        </ChatContentWrapper>
      </ChatContent>
      <StyledChatForm onSubmit={handleSubmit}>
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
      </StyledChatForm>
    </ChatContainer>
  );
}

const MessageChat = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DeleteButton = styled.button`
  border: none;
  cursor: pointer;
  background-color: transparent;
`;

const TextChat = styled.p`
  max-width: 80%;
  word-wrap: break-word;
`;

const StyledChatForm = styled.form`
  display: flex;
  padding: 10px;
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${Colors.white};
  border-radius: 35px;
  height: 100%;
  width: 100%;

  & > .icons-wrapper > .icon {
    width: 40px;
    height: 40px;
    background-color: ${Colors.white};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: left 0.3s ease;
  }
`;
const ChatInput = styled(TextField)`
  flex: 4;
  overflow-y: auto;
`;
const ChatButton = styled(Button)`
  flex: 1;
`;
const ChatContent = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;
const ChatContentWrapper = styled.div`
  flex-grow: 1;
`;

export default Chat;