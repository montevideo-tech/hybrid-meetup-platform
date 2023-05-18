import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLoaderData } from "react-router-dom";
import { onSendMessage, onDeleteMessage } from "../utils/chat";
import Filter from "bad-words";
import styled from "styled-components";
import { Badge, Button, TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { Colors } from "../themes/colors";
import { DeleteOutline as DeleteOutlineIcon } from "@mui/icons-material";

function Chat(props) {
  const [content, setContent] = useState("");
  const { email } = useSelector((state) => state.user);
  const roomId = useLoaderData();
  const filter = new Filter();
  const [chatOpen, setChatOpen] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [chatHeight, setChatHeight] = useState("30px");
  const { messages, isUserAdmin } = props;

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
          {messages?.map((m) => (
            // eslint-disable-next-line react/jsx-key
            <MessageChat>
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

export default Chat;

const StyledChatForm = styled.form`
  display: flex;
`;

const ChatContainer = styled.div`
  position: fixed;
  z-index: 100;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid ${Colors.white};
  background-color: ${Colors.white};
  border-radius: 35px;
  padding: 10px;
  width: ${(props) => (props.chatOpen ? "350px" : "40px")};
  height: ${(props) => (props.chatOpen ? "88vh" : props.chatHeight)};

  & > .icons-wrapper {
    position: absolute;
    bottom: 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  & > .icons-wrapper > .icon {
    width: 40px;
    height: 40px;
    background-color: ${Colors.white};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    transition: left 0.3s ease;
  }
`;
const ChatInput = styled(TextField)`
  flex: 4;
  overflow-y: auto;
`;
const ChatButton = styled(Button)`
  flex: 1;
  margin-left: 15px;
`;
const ChatContent = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;
const ChatContentWrapper = styled.div`
  flex-grow: 1;
`;
