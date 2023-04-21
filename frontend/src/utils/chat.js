import { supabase } from '../lib/api';

export async function onSendMessage(message, fetchMessages) {
  console.log('message que mandamos en onSend', message);
  const { error } = await supabase.from('message-chat').insert([message]);
  if (error) {
    console.error('error en onSendMessage', error);
  }
  fetchMessages();
}

export function subscribeToNewMessages() {
  supabase
    .channel('any')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'message-chat',
      },
      async (payload) => (prevMessages) => [payload.new, ...prevMessages])
    // .on(
    //   'postgres_changes',
    //   {
    //     event: 'DELETE',
    //     schema: 'public',
    //     table: 'messages',
    //   },
    //   async (payload) => {
    // setMessages((prevMessages) =>
    // prevMessages.filter((message) => message.id !== payload.old.id));
    //   })
    .subscribe();
}
