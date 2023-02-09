import React, { useState, useEffect } from 'react';
import { Paper, Typography } from '@mui/material';

import RoomsList from '../components/RoomsList';

const dummyRoomsList = [
  { id: '1', name: 'Room 1' },
  { id: '2', name: 'Room 2' },
  { id: '3', name: 'Room 3' },
  { id: '4', name: 'Room 4' },
];

// this is just for test. we're going to call our supabase DB
const fetchRooms = async () => new Promise((resolve) => {
  resolve(dummyRoomsList);
});

function Rooms() {
  // eslint-disable-next-line no-unused-vars
  const [roomsList, setRoomsList] = useState([]);

  useEffect(() => {
    const getRoomsList = async () => {
      try {
        // eslint-disable-next-line no-unused-vars
        const rooms = await fetchRooms();
        // setRoomsList(rooms);
      } catch (err) {
        console.error(err);
      }
    };
    getRoomsList();
  }, []);

  return (
    <Paper sx={{ m: 2, p: 2 }}>
      <Typography variant="h4" component="h1">
        Rooms
      </Typography>
      <RoomsList list={dummyRoomsList} />
    </Paper>
  );
}

export default Rooms;
