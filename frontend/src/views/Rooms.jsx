import React, { useState, useEffect } from 'react';
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../lib/api';
import { createRoom, addRoomToDb } from '../actions';

import RoomsList from '../components/RoomsList';

function Rooms() {
  const [roomsList, setRoomsList] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);

  const onRoomCreated = async (data) => {
    const onSuccess = () => {
      console.log('Room added to DB');
      setCreatingRoom(false);
      setNewRoomName('');
    };
    const onError = (res) => {
      setCreatingRoom(false);
      const { response: { data: { error } } } = res;
      console.error(`An error occurred while adding the room to DB: ${error.message}`);
    };
    dispatch(addRoomToDb(data, onSuccess, onError));
  };

  const onSubmit = async () => {
    if (!newRoomName) {
      return;
    }

    setShowNameInput(false);
    setCreatingRoom(true);
    const onSuccess = (res) => {
      // console.log('Room created', res);
      const { data: { data } } = res;
      if (!data?.id) {
        console.error(new Error('Bad response from provider: no room ID'));
        return;
      }

      onRoomCreated(
        {
          ...data,
          name: newRoomName,
          providerId: data.id,
          creatorEmail: user.email,
        },
      );
    };
    const onError = (res) => {
      setCreatingRoom(false);
      const { response: { data: { error } } } = res;
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
    setUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    const getRoomsList = async () => {
      setLoadingRooms(true);

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
        setLoadingRooms(false);
      }
    };
    getRoomsList();
  }, []);

  const renderCreateRoomButton = () => (
    showNameInput ? (
      <Grid container spacing={1} sx={{ ml: 1, mt: 1, pr: 1 }}>
        <Grid item xs={10}>
          <TextField
            variant="outlined"
            label="Insert Room Name"
            sx={{ width: 1 }}
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
        </Grid>
        <Grid item xs={1}>
          <IconButton
            color="primary"
            aria-label="create a room"
            size="large"
            onClick={onSubmit}
            disabled={loadingRooms || creatingRoom || !newRoomName}
          >
            <CheckIcon />
          </IconButton>
        </Grid>
        <Grid item xs={1}>
          <IconButton
            aria-label="discard room name changes"
            size="large"
            onClick={() => {
              setShowNameInput(false);
              setNewRoomName('');
            }}
            disabled={loadingRooms || creatingRoom}
          >
            <CloseIcon />
          </IconButton>
        </Grid>
      </Grid>
    ) : (
      <Button
        variant="contained"
        onClick={() => setShowNameInput(true)}
        disabled={loadingRooms || creatingRoom}
        sx={{
          my: 2, ml: 1, width: 150, height: 40,
        }}
      >
        {creatingRoom ? (
          <CircularProgress size={20} />
        ) : (
          'Create Room'
        )}
      </Button>
    )
  );

  return (
    <Paper sx={{ m: 2, p: 2 }}>
      <Typography variant="h4" component="h1">
        Rooms
      </Typography>

      {user?.role === 'admin' && renderCreateRoomButton()}

      {
        loadingRooms ? (
          <>
            <Skeleton
              width="60%"
              variant="text"
              animation="wave"
              height={50}
              sx={{ ml: 1 }}
            />
            <Skeleton
              width="40%"
              variant="text"
              animation="wave"
              height={50}
              sx={{ ml: 1 }}
            />
            <Skeleton
              width="30%"
              variant="text"
              animation="wave"
              height={50}
              sx={{ ml: 1 }}
            />
          </>
        ) : (
          <RoomsList list={roomsList} />
        )
      }
    </Paper>
  );
}

export default Rooms;
