import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLoaderData } from 'react-router-dom';
import { subscribeToNewMessages, onSendMessage } from '../utils/chat';
import { supabase } from '../lib/api';
import {
  ChatButton, ChatContainer, ChatContent, ChatForm, ChatInput
} from '../themes/componentsStyles';

function Chat() {
  const [content, setContent] = useState('');
  const { email } = useSelector((state) => state.user);
  const roomId = useLoaderData();
  const [messages, setMessages] = useState([]);

  async function fetchMessages() {
    const { data, error } = await supabase
      .from('message-chat')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) {
      console.log('Error Fetching Messages:', error);
    } else {
      setMessages(data);
    }
  }

  useEffect(() => {
    fetchMessages();
    subscribeToNewMessages();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !content) return;

    onSendMessage({ email, content, providerId: roomId }, fetchMessages);
    setContent('');
  };
  return (
    <ChatContainer>
      <ChatContent>
        {messages?.map((m) => (
          <p>
            <strong>
              {m.email}
              :
            </strong>
            {' '}
            {m.content}
          </p>
        ))}
      </ChatContent>
      <ChatForm onSubmit={handleSubmit} style={{ display: 'flex', justifyContent: 'space-between' }}>
        <ChatInput
          type="text"
          placeholder="Message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ flex: '4', marginRight: '10px' }}
        />
        <ChatButton variant="contained" type="submit">
          Send
        </ChatButton>
      </ChatForm>
    </ChatContainer>
  );
}

export default Chat;
