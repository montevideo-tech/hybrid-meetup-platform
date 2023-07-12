import { useEffect } from "react";

import {
  subscribeToNewMessages,
  subscribeToDeleteMessages,
  fetchMessages,
} from "../utils/chat";

const useChat = (
  roomId,
  dateTimeJoined,
  setMessages,
  chatOpen,
  setUnreadMessages,
  messages,
) => {
  useEffect(() => {
    subscribeToNewMessages(() =>
      fetchMessages(roomId, dateTimeJoined, setMessages),
    );
    subscribeToDeleteMessages(() =>
      fetchMessages(roomId, dateTimeJoined, setMessages),
    );
  }, []);

  useEffect(() => {
    if (!chatOpen) {
      setUnreadMessages((prevUnreadMessages) => prevUnreadMessages + 1);
    } else {
      setUnreadMessages(0);
    }
  }, [messages]);
};

export default useChat;
