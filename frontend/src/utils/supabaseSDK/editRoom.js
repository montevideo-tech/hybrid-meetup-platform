import { getRoomsData, getUsersData } from "./shared";

const fetchUsers = async (setUsers) => {
  try {
    const users = await getUsersData("email");
    if (users.error) {
      throw users.error;
    }
    setUsers(
      users.data.map((user) => {
        return user.email;
      }),
    );
  } catch (error) {
    console.error(error.message);
  }
};

const getRoomName = async (setRoomName, roomId) => {
  try {
    const roomsQuery = await getRoomsData();
    if (roomsQuery.error) {
      throw roomsQuery.error;
    }
    setRoomName(
      roomsQuery.data.filter((room) => room.providerId === roomId)[0].name,
    );
  } catch (err) {
    console.error(`Error getting room name: ${err.message}`);
  }
};

export { getRoomName, fetchUsers };
