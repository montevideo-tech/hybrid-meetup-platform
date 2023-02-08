/* eslint-disable react/prop-types */
/*
This component assumes that it will be given a list of active participants that will
be constantly recalcultated by the parent component or an external function so that
the subgroup of people that are actually being shown in the room (as opposed to always
showing everyone, which is impossible) gets decided outside this component.

That external function could work something like this:
A "visibleParticipants" array could be calculated. This array would hold the
{rowsLimit}*{tilesPerRowLimit} (at most) room participants that are visible at any given moment.
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
  const [idCount, setIdCount] = useState(0);
  // const [participants, setParticipants] = useState([]);
  // we eventually need the full list of participants, not only the visible ones
  // this array will hold data such as name foor the purpose of
  // having a participants name list, etc.

  // It's possible that visibleParitcipants will eventually not need to be in the state,
  // if it ends up being a component property passed in by the parent component.
  // for now it needs to be in the state so that the "Add Participant" test button can work
  const [visibleParticipants, setVisibleParticipants] = useState([]);
  const rowsLimit = { xs: 2, sm: 2, md: 2 };
  const tilesPerRowLimit = { xs: 2, sm: 6, md: 10 };
  // it's assumed that we'll get a maximum of rowsLimit*tilesPerRowLimit visibleParticipants
  // if this precondition isn't true then the video grid can't be expected to render properly
  const calculateTilesPerRow = (screenSize) => {
    // screenSize should be either 'xs', 'sm' or 'md'
    const tilesAmount = visibleParticipants.length + 1;
    // the "+ 1" is because of the user tile
    return Math.min(
      tilesPerRowLimit[screenSize],
      Math.ceil(tilesAmount / rowsLimit[screenSize]),
    );
  };
  const tilesPerRow = {
    xs: calculateTilesPerRow('xs'),
    sm: calculateTilesPerRow('sm'),
    md: calculateTilesPerRow('md'),
  };
  const roomId = useLoaderData();
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
      <Grid container spacing={2} columns={tilesPerRow} alignItems="center" justifyContent="center">
        {visibleParticipants.map((participant) => (
          <Grid item xs={1} sm={1} md={1} key={participant.id}>
            <Box sx={{ backgroundColor: 'black', color: 'white' }}>
              participant
              {' '}
              {participant.id}
            </Box>
          </Grid>
        ))}
        <Grid item xs={1} sm={1} md={1}>
          <Box sx={{ backgroundColor: 'black', color: 'white' }}>user slot (you)</Box>
        </Grid>
      </Grid>
      <Button variant="outlined" onClick={addParticipant}>Add participant</Button>
    </>
  );
}

export default Room;
