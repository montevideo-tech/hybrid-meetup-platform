import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLoaderData } from "react-router-dom";
import { onSendMessage, onDeleteMessage } from "../utils/supabaseSDK/chat";
import Filter from "bad-words";
import styled from "styled-components";
import { Colors } from "../themes/colors";
import { DeleteOutline as DeleteOutlineIcon } from "@mui/icons-material";
import { Input } from "../themes/componentsStyles";
import Card from "../components/Card";
import Button from "../components/Button";
import send from "../assets/send.svg";
import Icon from "../components/Icon";

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
    <Card
      width="calc(100% - 20px)"
      height="calc(100% - 20px)"
      customStyles={{
        maxHeight: "65vh",
        flexDirection: "column",
        borderRadius: "15px",
        border: "none",
        padding: "15px",
        overflowY: "auto",
      }}
    >
      <ChatContent>
        <ChatContentWrapper>
          {messages?.map((m) => (
            <MessageChat key={m.id}>
              <TextChat>
                <Email>{m.email}:</Email>
                <span>{m.content}</span>
              </TextChat>
              {isUserAdmin && (
                <Button
                  onClick={() => {
                    onDeleteMessage(m.id);
                  }}
                >
                  <DeleteOutlineIcon
                    fontSize="small"
                    sx={{ color: Colors.red }}
                  />
                </Button>
              )}
            </MessageChat>
          ))}
        </ChatContentWrapper>
      </ChatContent>
      <StyledChatForm onSubmit={handleSubmit}>
        <StyledInput
          $customStyles={{
            width: "100%",
            fontWeight: "400",
            fontSize: "0.75rem",
            lineHeight: "1.125rem",
            border: `1px solid ${Colors.purple}`,
            padding: "0 40px 0 12px",
          }}
          type="text"
          placeholder="Message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          multiline
          minRows={1}
          maxRows={3}
          inputProps={{ maxLength: 150 }}
        />
        <Button
          type="submit"
          secondary
          width="fit-content"
          height="fit-content"
          customStyles={{
            position: "absolute",
            marginTop: "5px",
            marginLeft: "calc(250px - 60px)",
            border: "none",
          }}
        >
          <Icon icon={send} name="send message" />
        </Button>
      </StyledChatForm>
    </Card>
  );
}

const MessageChat = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const TextChat = styled.p`
  margin: 8px 0;
  font-family: "Poppins";
  font-size: 0.8rem;
  max-width: 80%;
  word-wrap: break-word;
`;

const Email = styled.span`
  margin-right: 4px;
  font-weight: 600;
  color: ${Colors.purple};
`;

const StyledChatForm = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const ChatContent = styled.div`
  margin-bottom: 10px;
  width: 100%;
  flex-grow: 1;
  overflow-y: auto;
`;

const ChatContentWrapper = styled.div`
  flex-grow: 1;
`;

const StyledInput = styled(Input)`
  :focus-visible {
    border: 1px solid ${Colors.purple};
    box-shadow: 0 0 1px ${Colors.purple};
  }
`;

export default Chat;
