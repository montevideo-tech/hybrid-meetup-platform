/* eslint-disable react/prop-types */
/*
This component assumes that it will be given a list of active participants that will
be constantly recalcultated by the parent component or an external function so that
the subgroup of people that are actually being shown in the room (as opposed to always
showing everyone, which is impossible) gets decided outside this component.

That external function could work something like this:
A "visibleParticipants" array could be calculated. This array would hold the
{rowsLimit}*{tilesPerRowLimit} (at most) room participants that are visible at any given moment.
It's also ordered by visiblity priority. This means that when a currently hidden participant needs
to be shown, the currently visible participant with the least visibility priority
(the last in the array) will be hidden to make place for this new one. By default, a participant
is shown with middle priority (It gets inserted in the middle of the visibleParticipants array).
*/
import { React, useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { Grid, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Video from '../components/Video';
import { Room as WebRoom } from '../lib/webrtc';

// get jwt from env for testing purposes. will get using roomId eventually
const JWT = process.env.REACT_APP_MUX_SPACE_JWT;

export async function roomLoader({ params }) {
  return params.roomId;
}

function Room() {
  const [room, setRoom] = useState();
  // const [userParticipant, setUserParticipant] = useState();
  const [localStream, setLocalStream] = useState();
  const [remoteStreams, setRemoteStreams] = useState([]);
  // const [participants, setParticipants] = useState([]);
  // we eventually need the full list of participants, not only the visible ones
  // this array will hold data such as name foor the purpose of
  // having a participants name list, etc.

  // It's possible that visibleParitcipants will eventually not need to be in the state,
  // if it ends up being a component property passed in by the parent component.
  // for now it needs to be in the state so that the "Add Participant" test button can work
  const rowsLimit = { xs: 2, sm: 4, md: 6 };
  const tilesPerRowLimit = { xs: 2, sm: 6, md: 10 };
  // it's assumed that we'll get a maximum of rowsLimit*tilesPerRowLimit visibleParticipants
  // if this precondition isn't true then the video grid can't be expected to render properly
  const calculateTilesPerRow = (screenSize) => {
    // screenSize should be either 'xs', 'sm' or 'md'
    const tilesAmount = remoteStreams.length;
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
  // initialize room
  useEffect(() => {
    const joinRoom = async () => {
      const newRoom = new WebRoom(JWT);
      const newParticipant = await newRoom.join();

      newRoom.on('ParticipantTrackSubscribed', (remoteParticipant, track) => {
        const stream = new MediaStream();
        stream.addTrack(track.mediaStreamTrack);
        const streamObj = { stream, participantId: remoteParticipant.id };
        setRemoteStreams([...remoteStreams, streamObj]);
      });

      newRoom.on('ParticipantJoined', (p) => console.log('someone joined', p));
      newRoom.on('ParticipantLeft', (p) => console.log('someone left', p));

      setRoom(newRoom);
      const tracks = await newParticipant.publishTracks(
        { constraints: { video: true, audio: true } },
      );
      const stream = new MediaStream();
      tracks.forEach((track) => stream.addTrack(track.mediaStreamTrack));
      setLocalStream(stream);
    };
    joinRoom();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    room ? (
      <>
        <Typography variant="h4" component="h1">
          Room
          {' '}
          {roomId}
        </Typography>
        <Grid container spacing={2} columns={tilesPerRow} alignItems="center" justifyContent="center">
          {remoteStreams.map((stream) => (
            <Grid item xs={1} sm={1} md={1} key={stream.participantId}>
              <div style={{ borderStyle: 'solid' }}>
                <Video
                  stream={stream.stream}
                />
              </div>
            </Grid>
          ))}
        </Grid>
        <Video
          stream={localStream}
        />
      </>
    ) : <CircularProgress />
  );
}

export default Room;
