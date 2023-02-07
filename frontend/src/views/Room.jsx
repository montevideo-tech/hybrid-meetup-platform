/* eslint-disable react/prop-types */
import { React, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Box, Grid, Typography } from '@mui/material';

export async function roomLoader({ params }) {
  return params.roomId;
}

function Room() {
  const [idCount, setIdCount] = useState(0);
  const [participants, setParticipants] = useState([]);
  const roomId = useLoaderData();
  const computeTileSize = () => {
    const amount = participants.length;
    if (amount <= 4) {
      return { xs: 6, sm: 6 };
    } if (amount <= 6) {
      return { xs: 6, sm: 4 };
    } if (amount <= 8) {
      return { xs: 6, sm: 3 };
    }
    return { xs: 6, sm: 2 };
  };
  const tileSize = computeTileSize();
  const addParticipant = () => {
    // adds a dummy participant to test the view's adaptiveness
    // to the amount of participants in the room
    const participantsCopy = [...participants, { id: idCount }];
    setIdCount(idCount + 1);
    setParticipants(participantsCopy);
  };
  return (
    <>
      <Typography variant="h4" component="h1">
        Room
        {' '}
        {roomId}
      </Typography>
      <Grid container spacing={2}>
        {participants.map((participant) => (
          <Grid item xs={tileSize.xs} sm={tileSize.sm} key={participant.id}>
            <Box sx={{ backgroundColor: 'black', color: 'white' }}>dummy</Box>
          </Grid>
        ))}
      </Grid>
      <Button variant="outlined" onClick={addParticipant}>Add participant</Button>
    </>
  );
}

export default Room;
