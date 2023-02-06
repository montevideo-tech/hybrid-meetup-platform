/* eslint-disable react/prop-types */
import React from 'react';
import { useLoaderData } from 'react-router-dom';

export async function roomLoader({ params }) {
  return params.roomId;
}

function Room() {
  const roomId = useLoaderData();
  return (
    <div>
      This will eventually be a room with ID:
      {' '}
      {roomId}
    </div>
  );
}

export default Room;
