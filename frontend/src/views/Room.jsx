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
import {
  React, useState, useEffect, useRef,
} from 'react';
import { useLoaderData, Navigate } from 'react-router-dom';
import { Box, Grid } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import RoomControls from '../components/RoomControls';
import Video from '../components/Video';

import { Room as WebRoom } from '../lib/webrtc';
import { roomJWTprovider } from '../actions';

export async function roomLoader({ params }) {
  return params.roomId;
}

function Room() {
  const [room, setRoom] = useState();
  // const [userParticipant, setUserParticipant] = useState();
  const [localStream, setLocalStream] = useState();
  // this helps keep track of muting/unmuting with RoomControls
  const [localTracks, setLocalTracks] = useState({ video: null, audio: null });
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [roomNotFound, setRoomNotFound] = useState(false);
  // const [participants, setParticipants] = useState([]);
  // we eventually need the full list of participants, not only the visible ones
  // this array will hold data such as name foor the purpose of
  // having a participants name list, etc.

  const roomId = useLoaderData();

  // create reference to access room state var in useEffect cleanup func
  const roomRef = useRef();
  const remoteStreamsRef = useRef(new Map());

  const setRemoteStreamsRef = (data) => {
    remoteStreamsRef.current = data;
    setRemoteStreams(Array.from(data.values()));
  };

  // It's possible that visibleParitcipants will eventually not need to be in the state,
  // if it ends up being a component property passed in by the parent component.
  // for now it needs to be in the state so that the "Add Participant" test button can work
  const rowsLimit = { xs: 2, sm: 3, md: 4 };
  const tilesPerRowLimit = { xs: 2, sm: 3, md: 6 };
  // it's assumed that we'll get a maximum of rowsLimit*tilesPerRowLimit visibleParticipants
  // if this precondition isn't true then the video grid can't be expected to render properly
  const calculateTilesPerRow = (screenSize) => {
    // screenSize should be either 'xs', 'sm' or 'md'
    /* This function attempts to distribute the tiles between
    rows as evenly as possible. It does so while trying to mantain
    the amount of tiles per row bigger or equal that the total amount
    of rows, as this looks better than the opposite relation. */
    const tilesAmount = remoteStreams.length;
    let rows = 1;
    while (rows <= rowsLimit[screenSize]) {
      const tilesPerRow = Math.ceil(tilesAmount / (rows + 1));
      if (
        tilesPerRow >= rows + 1
      ) {
        rows += 1;
      } else {
        break;
      }
    }
    /*
    TODO? fix the "7" case (ask Nico Reyes)
    const finalTilesPerRow = Math.ceil(tilesAmount / (rows));
    const tilesInLastRow = finalTilesPerRow % rows;
    if (finalTilesPerRow - (tilesInLastRow) >= 2) {
      rows -= 1;
    }
    */
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

  const leaveRoom = async () => {
    if (roomRef.current) {
      // await userParticipant.unpublishAllTracks(); // also stops them
      await roomRef.current.leave();
    }
  };

  // initialize room
  useEffect(() => {
    const subscribeToRemoteStreams = async (r) => {
      // subscribe ta all remote participants for testing purposes
      const { remoteParticipants } = r;
      const rps = Array.from(remoteParticipants.values());
      await Promise.all(rps.map(async (rp) => {
        await rp.subscribe();
      }));
    };
    const joinRoom = async () => {
      const JWT = await roomJWTprovider(roomId, null, null, () => { setRoomNotFound(true); });
      const newRoom = new WebRoom(JWT);
      const newParticipant = await newRoom.join();

      newRoom.on('ParticipantTrackSubscribed', (remoteParticipant, track) => {
        // console.log('ParticipantTrackSubscribed event');

        // if there's already a stream for this participant, add the track to it
        // this avoid having two different streams for the audio/video tracks of the
        // same participant.
        if (remoteStreamsRef.current.has(remoteParticipant.id)) {
          const streamData = remoteStreamsRef.current.get(remoteParticipant.id);
          streamData.stream.addTrack(track.mediaStreamTrack);
          streamData[`${track.kind}Muted`] = track.muted;
        } else {
          const stream = new MediaStream();
          stream.addTrack(track.mediaStreamTrack);
          remoteStreamsRef.current.set(
            remoteParticipant.id,
            { stream, [`${track.kind}Muted`]: track.muted },
          );
        }
        setRemoteStreamsRef(remoteStreamsRef.current);

        // add event handler for Muted/Unmuted events
        track.on('Muted', () => {
          const streamData = remoteStreamsRef.current.get(remoteParticipant.id);
          streamData[`${track.kind}Muted`] = true;
          setRemoteStreamsRef(remoteStreamsRef.current);
        });
        track.on('Unmuted', () => {
          const streamData = remoteStreamsRef.current.get(remoteParticipant.id);
          streamData[`${track.kind}Muted`] = false;
          setRemoteStreamsRef(remoteStreamsRef.current);
        });
      });

      newRoom.on('ParticipantJoined', (p) => {
        // console.log('someone joined', p);
        p.subscribe();
      });
      newRoom.on('ParticipantLeft', (p) => {
        // console.log('someone left', p);
        remoteStreamsRef.current.delete(p.id);
        setRemoteStreamsRef(remoteStreamsRef.current);
      });

      setRoom(newRoom);
      roomRef.current = newRoom;
      const tracks = await newParticipant.publishTracks(
        { constraints: { video: true, audio: true } },
      );
      const stream = new MediaStream();

      const newLocalTracks = { ...localTracks };

      tracks.forEach((track) => {
        stream.addTrack(track.mediaStreamTrack);
        newLocalTracks[track.kind] = track;
      });

      setLocalStream(stream);
      setLocalTracks(newLocalTracks);
      // setUserParticipant(newParticipant);
      subscribeToRemoteStreams(newRoom);
    };
    joinRoom();
    return leaveRoom;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateLocalTracksMuted = (kind, muted) => {
    localTracks[kind].muted = muted;
    setLocalTracks({ ...localTracks });
  };

  const localStreamStyle = {
    width: '25vw',
    position: 'fixed',
    bottom: 0,
    right: 0,
  };
  return (
    <>
      {
        roomNotFound
        && <Navigate to="/rooms/404" />
      }
      {
        room ? (
          <Box style={{ position: 'relative' }}>
            <Grid sx={{ width: '65vw', height: '60vh' }} container spacing={2} columns={tilesPerRow} alignItems="center" justifyContent="center">
              {
                remoteStreams.map(({ stream, audioMuted, videoMuted }) => (
                  <Grid item xs={1} sm={1} md={1} key={stream.id}>
                    <Box>
                      <Video
                        stream={stream}
                        isAudioMuted={audioMuted || false}
                        isVideoMuted={videoMuted || false}
                      />
                    </Box>
                  </Grid>
                ))
              }
            </Grid>
            <div style={localStreamStyle}>
              <Video
                stream={localStream}
                // isAudioMuted={localTracks.audio?.muted || false}
                muted
              />
            </div>
          </Box>
        ) : <CircularProgress />
      }

      <RoomControls
        localTracks={localTracks}
        updateLocalTracksMuted={updateLocalTracksMuted}
        leaveRoom={leaveRoom}
        disabled={!room}
      />
    </>
  );
}

export default Room;
