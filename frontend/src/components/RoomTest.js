import React, { useState } from 'react';

import { Room } from '../lib/webrtc';
import { REACT_APP_MUX_SPACE_JWT } from '../lib/constants';

const RoomTest = (props) => {
  const [room, setRoom] = useState();
  const [participant, setParticipant] = useState();

  const joinRoom = async () => {
    try {
      console.log(REACT_APP_MUX_SPACE_JWT)
      const newRoom = new Room(REACT_APP_MUX_SPACE_JWT);
      const newParticipant = await newRoom.join();

      setRoom(newRoom);
      setParticipant(newParticipant);
      console.log(newRoom);
      console.log('ID is:', newRoom.id);
    } catch (err) {
      console.error(err);
    }
  };

  const leaveRoom = async () => {
    if (!room) {
      return;
    }

    try {
      await room.leave();
      setRoom(null);
      console.log('you left the room');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <button style={{ fontSize: 40 }} onClick={joinRoom} disabled={!!room}>JOIN</button>
      <button style={{ fontSize: 40, color: 'darkred' }} onClick={leaveRoom} disabled={!room}>LEAVE</button>
    </>
  );
};

export default RoomTest;
