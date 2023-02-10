import React, { useState, useEffect } from 'react';
import {
  Button, Paper, Skeleton, Typography,
} from '@mui/material';
import { useDispatch } from 'react-redux';

import { supabase } from '../lib/api';
import { createRoom } from '../actions';

import RoomsList from '../components/RoomsList';

// TODO create new room (call cloud function)

function Rooms() {
  const [roomsList, setRoomsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const onSubmit = async () => {
    console.log('on submit');

    const onSuccess = (res) => {
      // navigate('/rooms');
      console.log('Room created', res);
      // TODO insert DB entry
    };
    const onError = (error) => {
      // setAlert({ type: 'error', message: `An error occurred while creating room: ${error}` });
      console.error(`An error occurred while creating room: ${error.message}`);
    };
    dispatch(createRoom(onSuccess, onError));
  };

  const handleTableEvent = (payload) => {
    const { new: newRoom } = payload;
    switch (payload.eventType) {
      case 'INSERT':
        setRoomsList((list) => [...list, newRoom]); // functional update
        break;
      case 'UPDATE':
        setRoomsList((list) => list.map((room) => {
          if (room.id === newRoom.id) {
            return newRoom;
          }
          return room;
        }));
        break;
      case 'DELETE':
        setRoomsList((list) => list.filter((room) => room.id !== payload.old.id));
        break;
      default:
    }
  };

  useEffect(() => {
    const getRoomsList = async () => {
      setLoading(true);

      try {
        const roomsQuery = await supabase.from('rooms').select();
        if (roomsQuery.error) {
          throw roomsQuery.error;
        }

        const usersQuery = await supabase.from('users-data').select();
        if (usersQuery.error) {
          throw usersQuery.error;
        }

        setRoomsList(roomsQuery.data.map((room) => {
          const { id, providerId, name } = room;
          const createdBy = usersQuery.data.find((u) => u.user_id === room.creatorId);

          return {
            id,
            providerId,
            name,
            createdBy,
          };
        }));

        // Listen to table events
        supabase
          .channel('any')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, handleTableEvent)
          .subscribe();
      } catch (err) {
        console.error(`Error getting rooms list: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    getRoomsList();
  }, []);

  return (
    <Paper sx={{ m: 2, p: 2 }}>
      <Typography variant="h4" component="h1">
        Rooms
      </Typography>
      <Button onClick={onSubmit}>
        Create Room
      </Button>

      {loading ? (
        <>
          <Skeleton variant="text" animation="wave" width="60%" height={50} />
          <Skeleton variant="text" animation="wave" width="40%" height={50} />
          <Skeleton variant="text" animation="wave" width="30%" height={50} />
        </>
      ) : (
        <RoomsList list={roomsList} />
      )}
    </Paper>
  );
}

export default Rooms;
