import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLoaderData } from "react-router-dom";
import { onSendMessage } from "../utils/chat";
import Filter from "bad-words";
import styled from "styled-components";
import { Badge } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import CloseIcon from "@mui/icons-material/Close";
import {
  ChatButton,
  ChatContainer,
  ChatContent,
  ChatForm,
  ChatInput,
  ChatContentWrapper,
} from "../themes/componentsStyles";

function Chat(props) {
  const [content, setContent] = useState("");
  const { email } = useSelector((state) => state.user);
  const roomId = useLoaderData();
  const filter = new Filter();
  const [chatOpen, setChatOpen] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [chatHeight, setChatHeight] = useState("30px");
  const { messages } = props;
  const filterContent = (hasBadWords) => {
    const filteredContent = hasBadWords
      ? "This message was deleted due to inappropriate language"
      : content;

    return filteredContent;
  };

  const toggleChat = () => {
    if (chatOpen) {
      setUnreadMessages(0);
      setChatHeight("40px");
    } else {
      setChatHeight("88vh");
    }
    setChatOpen(!chatOpen);
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
    <ChatContainer chatOpen={chatOpen} chatHeight={chatHeight}>
      <div className="icons-wrapper">
        {!chatOpen && unreadMessages >= 0 && (
          <IconButton color="inherit" onClick={toggleChat}>
            <div className="icon">
              <Badge badgeContent={unreadMessages} color="secondary">
                <ChatOutlinedIcon color="primary" fontSize="large" />
              </Badge>
            </div>
          </IconButton>
        )}
      </div>

      {chatOpen && (
        <IconButton
          style={{ backgroundColor: "transparent" }}
          onClick={toggleChat}
        >
          <div className="icon">
            <CloseIcon color="primary" />
          </div>
        </IconButton>
      )}
      <ChatContent>
        <ChatContentWrapper hidden={!chatOpen}>
          {messages &&
            messages?.map((m) => (
              // eslint-disable-next-line react/jsx-key
              <p>
                <strong>{m.email}:</strong> {m.content}
              </p>
            ))}
        </ChatContentWrapper>
      </ChatContent>
      {chatOpen && (
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
      )}
    </ChatContainer>
  );
}

export default Chat;

const StyledChatForm = styled(ChatForm)`
  display: flex;
  justify-content: space-between;
`;
