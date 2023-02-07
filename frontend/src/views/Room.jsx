/* eslint-disable react/prop-types */
/*
This component assumes that it will be given a list of active participants that will
be constantly recalcultated by the parent component or an external function so that
the subgroup of people that are actually being shown in the room (as opposed to always
showing everyone, which is impossible) gets decided outside this component.

That external function could work something like this:
A "visibleParticipants" array could be calculated. This array would hold the
{ROWS_LIMIT}*{TILES_PER_ROW_LIMIT} (at most) room participants that are visible at any given moment.
It's also ordered by visiblity priority. This means that when a currently hidden participants needs
to be shown, the currently visible participant with the least visibility priority
(the last in the array) will be hidden to make place for this new one. By default, a participant
is shown with middle priority (It gets inserted in the middle of the visibleParticipants array).
*/
import { React, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import Button from '@mui/material/Button';
import { Box, Grid, Typography } from '@mui/material';

export async function roomLoader({ params }) {
  return params.roomId;
}

function Room() {
  // const [ROWS_LIMIT, TILES_PER_ROW_LIMIT] = [2, 6]; // TODO calculate instead of harcode
  // It'll be assumed that the received/computed visibleParticipants will
  // abide by these values. I guess these values should be calculated according to the
  // current viewport. TILES_PER_ROW_LIMIT <= 12.
  const [idCount, setIdCount] = useState(0);
  // const [participants, setParticipants] = useState([]);
  // we eventually need the full list of participants, not only the visible ones
  // this array will hold data such as name foor the purpose of
  // having a participants name list, etc.

  // It's possible that visibleParitcipants will eventually not need to be in the state,
  // if it ends up being a component property passed in by the parent component.
  // for now it needs to be in the state so that the "Add Participant" test button can work
  const [visibleParticipants, setVisibleParticipants] = useState([]);
  const roomId = useLoaderData();
  const computeTileSize = () => {
    /*
    Calculates the tile size based on the current amount of visible participants
    */
    // TODO
    const result = { xs: 6, sm: 2 };
    return result;
  };
  const tileSize = computeTileSize();
  const addParticipant = () => {
    // adds a dummy participant to test the view's adaptiveness
    // to the amount of participants in the room
    const participantsCopy = [...visibleParticipants, { id: idCount }];
    setIdCount(idCount + 1);
    setVisibleParticipants(participantsCopy);
  };
  return (
    <>
      <Typography variant="h4" component="h1">
        Room
        {' '}
        {roomId}
      </Typography>
      <Grid container spacing={2}>
        {visibleParticipants.map((participant) => (
          <Grid item xs={tileSize.xs} sm={tileSize.sm} key={participant.id}>
            <Box sx={{ backgroundColor: 'black', color: 'white' }}>
              participant
              {' '}
              {participant.id}
            </Box>
          </Grid>
        ))}
        <Grid item xs={tileSize.xs} sm={tileSize.sm}>
          <Box sx={{ backgroundColor: 'black', color: 'white' }}>user slot (you)</Box>
        </Grid>
      </Grid>
      <Button variant="outlined" onClick={addParticipant}>Add participant</Button>
    </>
  );
}

export default Room;
