import React, { useState, useRef } from 'react';

import { Room } from '../lib/webrtc';
import { REACT_APP_MUX_SPACE_JWT } from '../lib/constants';

const RoomTest = (props) => {
  const [room, setRoom] = useState();
  const [loading, setLoading] = useState(false);
  const [participant, setParticipant] = useState();
  const [sharingMedia, setSharingMedia] = useState(false);
  const [remoteStreams, setRemoteStreams] = useState([]);

  const videoRef = useRef();

  const joinRoom = async () => {
    setLoading(true);
    try {
      const newRoom = new Room(REACT_APP_MUX_SPACE_JWT);
      const newParticipant = await newRoom.join();

      setRoom(newRoom);
      setParticipant(newParticipant);
      console.log(newRoom);
      console.log('local participants is:', newParticipant);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const leaveRoom = async () => {
    if (!room) {
      return;
    }

    setLoading(true);
    try {
      await participant.unpublishAllTracks(); // also stops them
      await room.leave();
      setRoom(null);
      setParticipant(null);
      setSharingMedia(false);

      console.log('you left the room');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToRemoteStreams = async () => {
    // TODO
  };

  const shareMedia = async () => {
    if (!room || !participant) {
      return;
    }

    setLoading(true);
    try {
      // NOTE: this is a workaround the limitations imposed by Mux on creating new Tracks
      const tracks = await participant.publishTracks({ constraints: { video: true, audio: false } });
      const stream = new MediaStream();
      tracks.forEach((track) => stream.addTrack(track.mediaStreamTrack));

      if (
        videoRef.current &&
        videoRef.current.srcObject !== stream
      ) {
        videoRef.current.srcObject = stream;
      }
      setSharingMedia(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // TODO test sharing media

  // TODO test subscribing to media

  // TODO try events
  return (
    <>
      {!!participant && (
        <>
          <p>You are a participant in the room!</p>
          <button style={{ fontSize: 20 }} onClick={shareMedia} disabled={sharingMedia || loading}>Video</button>
          {!!remoteStreams.length && (
            <div style={{ display: 'flex' }}></div>
          )}
          <video
            ref={videoRef}
            autoPlay
            style={{ width: 300, height: 150 }}
          />
        </>
      )}
      <button style={{ fontSize: 30 }} onClick={joinRoom} disabled={!!room || loading}>JOIN</button>
      <button style={{ fontSize: 30, color: 'darkred' }} onClick={leaveRoom} disabled={!room || loading}>LEAVE</button>
    </>
  );
};

export default RoomTest;
