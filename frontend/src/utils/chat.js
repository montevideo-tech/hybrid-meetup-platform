import { supabase } from '../lib/api';

export async function onSendMessage(message) {
  const { error } = await supabase.from('message-chat').insert([message]);
  if (error) {
    console.error('Error Sending Messages: ', error);
  }
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

export async function fetchMessages(dateTimeJoined, setMessages) {
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
