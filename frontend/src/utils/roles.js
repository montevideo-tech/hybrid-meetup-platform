import { supabase } from "../lib/api";

export const ROLES = {
  // app roles
  ADMIN: "admin",
  USER: "user",
  // room permissions
  HOST: "HOST",
  PRESENTER: "PRESENTER",
  GUEST: "GUEST",
};

const subscribeToRoleChanges = (roomId, handleRoleChange) => {
  supabase
    .channel("any")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "rooms-data",
        filter: `providerId=eq.${roomId}`,
      },
      async (payload) => {
        const data = await supabase
          .from("rooms-data")
          .select(
            `
            id,
            providerId,
            rooms-permission(name),
            userEmail)
          `,
          )
          .eq("id", payload.new.id);
        const newPermission = data.data[0];
        newPermission.eventType = "INSERT";
        handleRoleChange(newPermission);
      },
    )
    .on(
      "postgres_changes",
      {
        event: "DELETE",
        schema: "public",
        table: "rooms-data",
        filter: `providerId=eq.${roomId}`,
      },
      (payload) => handleRoleChange(payload),
    )
    .subscribe();
};

export default subscribeToRoleChanges;
