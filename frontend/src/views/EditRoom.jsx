import React from 'react';
import { useLoaderData } from 'react-router-dom';

export async function roomLoader({ params }) {
  return params.roomId;
}

function EditRoom() {
  const roomId = useLoaderData();
  return (
    <div>
      Edit Room
      {' '}
      { roomId }
    </div>
  );
}

export default EditRoom;
