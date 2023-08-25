import { useEffect, useState } from "react";
import { epochToISO8601 } from "../utils/time";
import {
  subscribeToNewMessages,
  subscribeToDeleteMessages,
  fetchMessages,
} from "../utils/supabaseSDK/chat";

const useChat = (roomId, chatOpen, setUnreadMessages) => {
  const [messages, setMessages] = useState([]);
  const [dateTimeJoined] = useState(epochToISO8601(Date.now()));
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

  return { messages };
};

export default useChat;
