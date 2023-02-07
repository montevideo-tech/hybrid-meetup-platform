/* eslint-disable react/prop-types */
import { React, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import Button from '@mui/material/Button';

export async function roomLoader({ params }) {
  return params.roomId;
}

function Room() {
  const [idCount, setIdCount] = useState(0);
  const [participants, setParticipants] = useState([]);
  const roomId = useLoaderData();
  const addParticipant = () => {
    // adds a dummy participant to test the view's adaptiveness
    // to the amount of participants in the room
    const participantsCopy = [...participants];
    participantsCopy.push({ id: idCount });
    setIdCount(idCount + 1);
    setParticipants(participantsCopy);
  };
  return (
    <div>
      <h1>
        Room
        {' '}
        {roomId}
      </h1>
      {participants.map((participant) => (
        <div key={participant.id}>dummy</div>
      ))}
      <Button onClick={addParticipant}>Add participant</Button>
    </div>
  );
}

export default Room;
