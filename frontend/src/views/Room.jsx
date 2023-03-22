/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
/* eslint-disable no-undef */
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
import { useSelector, useDispatch } from 'react-redux';
import {
  Box, CircularProgress, Grid, Typography, useMediaQuery, useTheme,
} from '@mui/material';

import RoomControls from '../components/RoomControls';
import Video from '../components/Video';
import Audio from '../components/Audio';

import { Room as WebRoom } from '../lib/webrtc';
import { roomJWTprovider, getRoomPermissions } from '../actions';
import {
  initRoom, addUpdateParticipant, removeParticipant, removeRole, cleanRoom,
} from '../reducers/roomSlice';
import subscribeToRoleChanges, { ROLES } from '../utils/roles';

export async function roomLoader({ params }) {
  return params.roomId;
}

function Room() {
  const [room, setRoom] = useState();
  // const [userParticipant, setUserParticipant] = useState();
  const [localStream, setLocalStream] = useState();
  // this helps keep track of muting/unmuting with RoomControls
  const [localTracks, setLocalTracks] = useState({ video: null, audio: null });
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [screenRoom, setScreenRoom] = useState();

  const [remoteStreams, setRemoteStreams] = useState([]);
  const [roomNotFound, setRoomNotFound] = useState(false);
  const roomId = useLoaderData();

  // create reference to access room state var in useEffect cleanup func
  const roomRef = useRef();
  const remoteStreamsRef = useRef(new Map());
  const currentUser = useSelector((state) => state.user);
  const roomData = useSelector((state) => state.room);
  const dispatch = useDispatch();

  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLg = useMediaQuery(theme.breakpoints.between('lg', 'xl'));

  const getScreenSizeBreakpoint = () => {
    if (isXs) {
      return 'xs';
    } if (isSm) {
      return 'sm';
    } if (isMd) {
      return 'md';
    } if (isLg) {
      return 'lg';
    }
    return 'xl';
  };

  // this are arbitrary values, we'll revisit this
  const getLimitOfCameras = {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 6,
  };

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
    lg: calculateTilesPerRow('lg'),
    xl: calculateTilesPerRow('xl'),
  };

  const leaveRoom = async () => {
    if (roomRef.current) {
      // await userParticipant.unpublishAllTracks(); // also stops them
      await roomRef.current.leave();
    }
  };

  const handleRoleChange = (payload) => {
    if (payload.eventType === 'INSERT') {
      const { id, userEmail } = payload;
      const permission = payload['rooms-permission'].name;
      dispatch(addUpdateParticipant({
        name: userEmail,
        role: permission,
        id,
      }));
    }
    // Supabase realtime only sends the ID that was deleted from the rooms-data table
    if (payload.eventType === 'DELETE') {
      const { id } = payload.old;
      dispatch(removeRole({ id }));
    }
  };

  const updateIsSpeakingStatus = (id, newStatus) => {
    const streamData = remoteStreamsRef.current.get(id);
    streamData.speaking = newStatus;
    setRemoteStreamsRef(remoteStreamsRef.current);

    if (bool) { // if the person is talking
      const idx = remoteStreams.findIndex((stream) => stream.id === id); // find index of person in array
      console.log(idx);
      if (idx !== 0) { // if you are not the first person on the list
        const newRemoteStreams = [...remoteStreams];
        newRemoteStreams.splice(idx, 1); // remove person from array
        newRemoteStreams.unshift(streamData); // add it to the beginning of the array
        setRemoteStreams(newRemoteStreams);
      }
    }
  };

  // initialize room
  useEffect(() => {
    const updateParticipantRoles = async () => {
      const initialParticipantRoles = await getRoomPermissions(roomId);
      initialParticipantRoles.map((part) => dispatch(addUpdateParticipant({
        name: part.userEmail,
        role: part['rooms-permission'].name,
        id: part.id,
      })));
    };

    const subscribeToRemoteStreams = async (r) => {
      const { remoteParticipants } = r;
      const rps = Array.from(remoteParticipants.values());
      // Listen to all the participants that are already on the call
      rps.map(async (rp) => {
        rp.on('StartedSpeaking', () => {
          updateIsSpeakingStatus(rp.connectionId, true);
        });
        rp.on('StoppedSpeaking', () => {
          updateIsSpeakingStatus(rp.connectionId, false);
        });
        await rp.subscribe();
      });
      updateParticipantRoles();
    };

    const joinRoom = async () => {
      const JWT = await roomJWTprovider(
        roomId,
        currentUser.email,
        null,
        null,
        () => { setRoomNotFound(true); },
      );
      const newRoom = new WebRoom(JWT);
      const newParticipant = await newRoom.join();

      dispatch(initRoom({
        id: roomId,
        participants: [{ name: currentUser.email, role: ROLES.GUEST }],
      }));

      // participantsRef.current = [...participantsRef.current,
      //   { name: currentUser.email, role: ROLES.GUEST }];
      // setParticipants(participantsRef.current);
      newRoom.on('ParticipantTrackSubscribed', (remoteParticipant, track) => {
        // if there's already a stream for this participant, add the track to it
        // this avoid having two different streams for the audio/video tracks of the
        // same participant.

        if (remoteStreamsRef.current.has(remoteParticipant.id)) {
          const streamData = remoteStreamsRef.current.get(remoteParticipant.id);
          streamData[`${track.kind}Muted`] = track.muted;
          const stream = new MediaStream();
          stream.addTrack(track.mediaStreamTrack);
          if (track.kind === 'audio') {
            streamData.audioStream = stream;
          } else {
            streamData.videoStream = stream;
          }
          remoteStreamsRef.current.set(remoteParticipant.id, streamData);
        } else {
          const audioStream = new MediaStream();
          const videoStream = new MediaStream();
          if (track.kind === 'audio') {
            audioStream.addTrack(track.mediaStreamTrack);
          } else {
            videoStream.addTrack(track.mediaStreamTrack);
          }

          remoteStreamsRef.current.set(
            remoteParticipant.id,
            {
              audioStream, videoStream, [`${track.kind}Muted`]: track.muted, speaking: false, name: remoteParticipant.displayName,
            },
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

      newRoom.on('ParticipantJoined', async (p) => {
        p.subscribe();
        p.on('StartedSpeaking', () => {
          updateIsSpeakingStatus(p.id, true);
        });
        p.on('StoppedSpeaking', () => {
          updateIsSpeakingStatus(p.id, false);
        });
        const participantData = await getRoomPermissions(roomId, p.displayName);
        if (participantData.length > 0) {
          dispatch(addUpdateParticipant({
            name: participantData[0].userEmail,
            role: participantData[0]['rooms-permission'].name,
            id: participantData[0].id,
          }));
        } else { dispatch(addUpdateParticipant({ name: p.displayName, role: ROLES.GUEST })); }
      });

      newRoom.on('ParticipantLeft', (p) => {
        remoteStreamsRef.current.delete(p.id);
        setRemoteStreamsRef(remoteStreamsRef.current);
        dispatch(removeParticipant({ name: p.displayName }));
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
      subscribeToRoleChanges(roomId, handleRoleChange);
    };
    joinRoom();
    return () => {
      dispatch(cleanRoom());
      leaveRoom();
    };
  }, []);

  const updateLocalTracksMuted = (kind, muted) => {
    localTracks[kind].muted = muted;
    setLocalTracks({ ...localTracks });
  };

  const updateScreenShare = async () => {
    // TODO add flag isSharingScreen
    if (!isSharingScreen) {
      const JWT = await roomJWTprovider(roomId, `${currentUser.email}-screen-share`, null, null, () => { setRoomNotFound(true); });
      const newScreenRoom = new WebRoom(JWT);
      const newParticipant = await newScreenRoom.join();
      setScreenRoom(newScreenRoom);
      const tracks = await newParticipant.startScreenShare();
      const stream = new MediaStream();
      const newLocalTracks = { ...localTracks };

      tracks.forEach((track) => {
        stream.addTrack(track.mediaStreamTrack);
        newLocalTracks[track.kind] = track;
      });
      setLocalTracks({ ...localTracks });
      // add listener on `Stop sharing` browser's button
      stream.getVideoTracks()[0]
        .addEventListener('ended', () => {
          newScreenRoom.leave();
        });
    } else {
      screenRoom.leave();
    }

    setIsSharingScreen(!isSharingScreen);
  };

  const localStreamStyle = {
    width: '25vw',
    position: 'fixed',
    bottom: 0,
    right: 0,
    marginLeft: '2vw',
    marginRight: '2vw',
  };

  return (
    <>
      {
        roomNotFound
        && <Navigate to="/rooms/404" />
      }
      {
        room ? (
          <Box style={{
            position: 'relative', marginLeft: '2vw', marginRight: '2vw',
          }}
          >
            <Grid sx={{ width: '65vw', height: '60vh' }} container spacing={2} columns={tilesPerRow} alignItems="center" justifyContent="center">
              {
                remoteStreams.slice(0, getLimitOfCameras[getScreenSizeBreakpoint()]).map(({
                  videoStream, name, audioMuted, videoMuted, speaking
                }) => (
                  <Grid item xs={1} sm={1} md={1} key={videoStream.id}>
                    <Box>
                      <Video
                        stream={videoStream}
                        isAudioMuted={audioMuted || false}
                        isVideoMuted={videoMuted || false}
                        isSpeaking={speaking || false}
                        name={name}
                      />
                      <Typography variant="caption" display="block" gutterBottom>
                        {roomData.participants
                          .find((part) => part.name === name)?.role}
                      </Typography>
                    </Box>
                  </Grid>
                ))
              }
            </Grid>
            <div style={localStreamStyle}>
              <Video
                stream={localStream}
                isStreamLocal
              />
            </div>
          </Box>
        ) : (
          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%',
          }}
          >
            <CircularProgress />
          </div>
        )
      }
      <div>
        {remoteStreams.map(({
          audioStream,
        }) => (
          <Audio
            stream={audioStream}
          />
        ))}
      </div>

      <RoomControls
        updateScreenShare={updateScreenShare}
        isSharingScreen={isSharingScreen}
        localTracks={localTracks}
        updateLocalTracksMuted={updateLocalTracksMuted}
        leaveRoom={leaveRoom}
        disabled={!room}
      />
    </>
  );
}

export default Room;
