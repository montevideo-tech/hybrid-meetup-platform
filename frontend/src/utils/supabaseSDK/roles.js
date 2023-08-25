import { supabase } from "../../lib/api";

const ROLES = {
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
    .channel("changeRole")
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

const deleteRole = async (userEmail) => {
  const urlParams = window.location.pathname;
  const parts = urlParams.split("/");
  const roomId = parts[2];

  const { data } = await supabase
    .from("rooms-data")
    .select("id, userEmail")
    .eq("providerId", roomId);
  const roleToDelete = data.find((element) => element.userEmail === userEmail);
  if (roleToDelete) {
    await supabase.from("rooms-data").delete().eq("id", roleToDelete.id);
  }
};

export { ROLES, subscribeToRoleChanges, deleteRole };
