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
  const [userParticipant, setUserParticipant] = useState();
  const [localStream, setLocalStream] = useState();
  const [remoteStreams, setRemoteStreams] = useState([]);
  // const [participants, setParticipants] = useState([]);
  // we eventually need the full list of participants, not only the visible ones
  // this array will hold data such as name foor the purpose of
  // having a participants name list, etc.

  // It's possible that visibleParitcipants will eventually not need to be in the state,
  // if it ends up being a component property passed in by the parent component.
  // for now it needs to be in the state so that the "Add Participant" test button can work
  const rowsLimit = { xs: 2, sm: 3, md: 4 };
  const tilesPerRowLimit = { xs: 2, sm: 3, md: 6 };
  // it's assumed that we'll get a maximum of rowsLimit*tilesPerRowLimit visibleParticipants
  // if this precondition isn't true then the video grid can't be expected to render properly
  const createDummy = (n) => {
    let result = [];
    for (let i = 0; i < n; i += 1) {
      result = [...result, localStream];
    }
    return result;
  };
  const dummy = createDummy(8);
  const calculateTilesPerRow = (screenSize) => {
    // screenSize should be either 'xs', 'sm' or 'md'
    // const tilesAmount = remoteStreams.length;
    const tilesAmount = dummy.length;
    // a new row only gets rendered when there's enough items
    // to fill at least tilesPerRowLimit * (3 / 5) tiles on each.
    let rows = 1;
    const tilesPerRowThreshold = Math.floor(tilesPerRowLimit[screenSize] * (3 / 5));
    // I add rows until splitting the tiles into row+1 rows wouldn't reach the threshold
    while (rows <= rowsLimit[screenSize]) {
      if (Math.ceil(tilesAmount / (rows + 1)) >= tilesPerRowThreshold) {
        rows += 1;
      } else {
        break;
      }
    }
    return Math.min(
      tilesPerRowLimit[screenSize],
      Math.ceil(tilesAmount / rows),
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
    const leaveRoom = async () => {
      if (room) {
        await userParticipant.unpublishAllTracks(); // also stops them
        await room.leave();
      }
    };
    const subscribeToRemoteStreams = async (r) => {
      // subscribe ta all remote participants for testing purposes
      const { remoteParticipants } = r;
      const rps = Array.from(remoteParticipants.values());
      await Promise.all(rps.map(async (rp) => {
        await rp.subscribe();
      }));
      console.log('subscribed to remote participant(s)');
    };
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
      setUserParticipant(newParticipant);
      subscribeToRemoteStreams(newRoom);
    };
    joinRoom();
    return leaveRoom;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
  const localStreamStyle = {
    width: '25vw',
    position: 'absolute',
    bottom: 0,
    right: 0,
  };
  return (
    room ? (
      <div style={{ position: 'relative' }}>
        <Typography variant="h4" component="h1">
          Room
          {' '}
          {roomId}
        </Typography>
        <div style={{ width: '65vw' }}>
          <Grid container spacing={2} columns={tilesPerRow} alignItems="center" justifyContent="center">
            {
              dummy.map((stream) => (
              // remoteStreams.map((stream) => (
                <Grid item xs={1} sm={1} md={1} key={makeid(10)}>
                  <div style={{ borderStyle: 'solid' }}>
                    <Video
                      stream={stream}
                    />
                  </div>
                </Grid>
              ))
            }
          </Grid>
        </div>
        <div style={localStreamStyle}>
          <Video
            stream={localStream}
            size={25}
          />
        </div>
      </div>
    ) : <CircularProgress />
  );
}

export default Room;
