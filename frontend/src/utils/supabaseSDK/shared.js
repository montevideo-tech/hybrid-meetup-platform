import { supabase } from "../../lib/api";

const getUsersData = async (columnName = null) => {
  const users = await supabase.from("users-data").select(columnName);
  return users;
};

const getRoomsData = async (columnName = null) => {
  const roomsQuery = await supabase.from("rooms").select(columnName);
  return roomsQuery;
};

export { getUsersData, getRoomsData };
