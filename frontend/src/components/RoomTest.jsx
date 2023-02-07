/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react';

import { Button, Grid } from '@mui/material';

import { Room } from '../lib/webrtc';
import { REACT_APP_MUX_SPACE_JWT } from '../lib/constants';

import Video from './Video';

function RoomTest() {
  const [room, setRoom] = useState();
  const [loading, setLoading] = useState(false);
  const [participant, setParticipant] = useState();
  const [sharingMedia, setSharingMedia] = useState(false);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [localStream, setLocalStream] = useState();

  useEffect(() => {
    if (!room) {
      return;
    }

    const subscribeToRemoteStreams = async () => {
      const { remoteParticipants } = room;
      const rps = Array.from(remoteParticipants.values());
      await Promise.all(rps.map(async (rp) => {
        await rp.subscribe();
      }));
      console.log('subscribed to remote participant(s)');
    };

    subscribeToRemoteStreams();
  }, [room]);

  const joinRoom = async () => {
    setLoading(true);
    try {
      const newRoom = new Room(REACT_APP_MUX_SPACE_JWT);
      const newParticipant = await newRoom.join();

      newRoom.on('ParticipantTrackSubscribed', (remoteParticipant, track) => {
        console.log(remoteParticipant, track);
        const stream = new MediaStream();
        stream.addTrack(track.track); // TODO properly wrap this
        console.log(stream);
        setRemoteStreams([...remoteStreams, stream]);
      });

      newRoom.on('ParticipantJoined', (p) => console.log('someone joined', p));
      newRoom.on('ParticipantLeft', (p) => console.log('someone left', p));

      setRoom(newRoom);
      setParticipant(newParticipant);
      console.log(newRoom);
    } catch (err) {
      console.error(err);
      leaveRoom();
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
      setParticipant(null);
      setLocalStream(null);
      setRemoteStreams([]);
      setRoom(null);
      setSharingMedia(false);

      console.log('you left the room');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const shareMedia = async () => {
    if (!room || !participant) {
      return;
    }

    setLoading(true);
    try {
      // NOTE: this is a workaround the limitations imposed by Mux on creating new Tracks
      const tracks = await participant.publishTracks({ constraints: { video: true, audio: true } });
      const stream = new MediaStream();
      tracks.forEach((track) => stream.addTrack(track.mediaStreamTrack));
      setLocalStream(stream);
      setSharingMedia(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!!participant && (
        <>
          <p>You are a participant in the room!</p>
          <Button
            sx={{ fontSize: 20 }}
            variant="outlined"
            onClick={shareMedia}
            disabled={sharingMedia || loading}
          >
            Video
          </Button>
          {!!remoteStreams.length && (
            <Grid container>
              {remoteStreams.map((stream) => (
                <Grid item key={stream.id}>
                  <Video
                    stream={stream}
                    width={300}
                    height={150}
                  />
                </Grid>
              ))}
            </Grid>
          )}
          <Video
            stream={localStream}
            muted
            width={300}
            height={150}
          />
        </>
      )}
      <Button
        sx={{ fontSize: 30 }}
        variant="contained"
        color="primary"
        onClick={joinRoom}
        disabled={!!room || loading}
      >
        JOIN
      </Button>
      <Button
        sx={{ fontSize: 30 }}
        variant="outlined"
        color="warning"
        onClick={leaveRoom}
        disabled={!room || loading}
      >
        LEAVE
      </Button>
    </>
  );
}

export default RoomTest;
