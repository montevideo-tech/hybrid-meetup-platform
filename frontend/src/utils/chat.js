import { supabase } from "../lib/api";

export async function onSendMessage(message) {
  const { error } = await supabase.from("message-chat").insert([message]);
  if (error) {
    console.error("Error Sending Messages: ", error);
  }
}

export function subscribeToNewMessages(fetchMessages) {
  supabase
    .channel("custom-insert-channel")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "message-chat",
      },
      fetchMessages,
    )
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
