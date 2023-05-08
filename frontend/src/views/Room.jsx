// Room
import {
  React, useState, useEffect, useRef,
} from 'react';
import { useLoaderData, Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button, Box, CircularProgress, Slide,
} from '@mui/material';

import useWindowDimensions from '../hooks/useWindowDimesion';
import useUserPermission from '../hooks/useUserPermission';
import RoomControls from '../components/RoomControls';
import Video from '../components/Video';

import { Room as WebRoom } from '../lib/webrtc';
import { roomJWTprovider } from '../actions';
import {
  initRoom, addUpdateParticipant, removeParticipant, removeRole, cleanRoom,
} from '../reducers/roomSlice';
import subscribeToRoleChanges, { ROLES } from '../utils/roles';
import ParticipantsCollection from '../components/ParticipantsCollection';
import addFakeParticipant from '../scripts/addFakeParticipant';
import ShareScreen from '../components/ShareScreen';
import { TESTING_MODE } from '../lib/constants';
import Chat from '../components/Chat';
import { comparator, updateParticipantRoles } from '../utils/helpers';

export async function roomLoader({ params }) {
  return params.roomId;
}

function Room() {
  const [room, setRoom] = useState();
  const [localParticipant, setLocalParticipant] = useState();
  const userRole = useUserPermission();
  const [isChatVisible, setIsChatVisible] = useState(true);
  // const [userParticipant, setUserParticipant] = useState();
  const [localStream, setLocalStream] = useState();
  // this helps keep track of muting/unmuting with RoomControls
  const [localTracks, setLocalTracks] = useState({ video: null, audio: null });
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [screenRoom, setScreenRoom] = useState();
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [roomNotFound, setRoomNotFound] = useState(false);
  const [errorJoiningRoom, setErrorJoiningRoom] = useState(false);
  const roomId = useLoaderData();
  // create reference to access room state var in useEffect cleanup func
  const roomRef = useRef();
  const remoteStreamsRef = useRef(new Map());
  const currentUser = useSelector((state) => state.user);
  const isUserAdmin = currentUser?.role === ROLES.ADMIN;
  // const roomData = useSelector((state) => state.room);
  const dispatch = useDispatch();
  const { width = 0, height = 0 } = useWindowDimensions();
  const headerHeight = 153.6; // 8vh
  let gap = 10;
  const paddingY = height < 600 ? 10 : 40;
  const paddingX = width < 800 ? 40 : 60;
  const navigate = useNavigate();

  // To add a new criteria to the comparator you need to
  // Decide if it's higher or lower pririoty compared to the already established
  // if it's higher you must add the 'if' before otherwise add it after.
  const setRemoteStreamsRef = (data) => {
    remoteStreamsRef.current = data;
    const remoteStreamsSorted = Array.from(data.values()).sort(comparator);
    setRemoteStreams(remoteStreamsSorted);
  };

  const toggleChatVisibility = () => {
    setIsChatVisible((prev) => !prev);
  };

  const participantsCount = remoteStreams.length;

  let collectionWidth = isChatVisible ? (width - paddingX * 2 - 330) : (width - paddingX * 2);

  if (isSharingScreen) {
    if (participantsCount < 6) {
      collectionWidth = width * 0.25 - paddingX;
    } else {
      collectionWidth = width * 0.33 - paddingX / 2;
    }

    collectionWidth = Math.max(collectionWidth, 160);
  }
  let collectionHeight = height - headerHeight - paddingY * 2;
  let screenShareWidth = isSharingScreen
    ? Math.min(width - collectionWidth - paddingX * 2, width - paddingX * 2) : 0;
  let direction = 'row';
  if (width < height) {
    gap = 8;
    collectionWidth = width - paddingX * 2;
    if (isSharingScreen) {
      direction = 'column';
      collectionHeight = height - headerHeight - (width / 4) * 3;
      screenShareWidth = width - paddingX * 2;
    }
  }

  const scaleFactor = 2.25;
  const rows = Math.max(Math.ceil(collectionHeight / (90 * scaleFactor)), 1);
  const columns = Math.max(Math.ceil(collectionWidth / (160 * scaleFactor)), 1);
  const participantsPerPage = Math.round(rows * columns);

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
    if (newStatus) {
      streamData.lastSpokenTime = Date.now();
    }
    setRemoteStreamsRef(remoteStreamsRef.current);
  };

  const renderParticipantCollection = () => (
    <ParticipantsCollection
      gap={gap}
      width={(collectionWidth - 330)}
      height={(collectionHeight)}
      participantsPerPage={participantsPerPage}
      participantsCount={participantsCount}
      localParticipant={localParticipant}
      permissionRole={userRole}
    >
      {remoteStreams.filter((p) => !p.isSharingScreen)}
    </ParticipantsCollection>
  );

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
    updateParticipantRoles(roomId, dispatch);
  };

  const handleTrackMuted = (remoteParticipant, track) => {
    const streamData = remoteStreamsRef.current.get(remoteParticipant.id);
    streamData[`${track.kind}Muted`] = true;
    setRemoteStreamsRef(remoteStreamsRef.current);
  };

  const handleTrackUnmuted = (remoteParticipant, track) => {
    const streamData = remoteStreamsRef.current.get(remoteParticipant.id);
    streamData[`${track.kind}Muted`] = false;
    setRemoteStreamsRef(remoteStreamsRef.current);
  };

  const handleTrackStarted = (remoteParticipant, track) => {
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
      let isSharingScreen = false;

      if (track.kind === 'audio') {
        audioStream.addTrack(track.mediaStreamTrack);
      } else {
        videoStream.addTrack(track.mediaStreamTrack);
      }
      if (track.provider.source === 'screenshare') {
        isSharingScreen = true;
        setIsSharingScreen(isSharingScreen);
      }
      remoteStreamsRef.current.set(
        remoteParticipant.id,
        {
          audioStream,
          videoStream,
          [`${track.kind}Muted`]: track.muted,
          speaking: false,
          name: remoteParticipant.displayName,
          isSharingScreen, // set isSharingScreen for remote participant
          lastSpokenTime: 0
        },
      );
    }
    setRemoteStreamsRef(remoteStreamsRef.current);

    // add event handler for Muted/Unmuted events
    track.on('Muted', () => handleTrackMuted(remoteParticipant, track));
    track.on('Unmuted', () => handleTrackUnmuted(remoteParticipant, track));
  };

  const handleParticipantLeft = (p) => {
    // Check if the participant who left the room was sharing screen
    if (remoteStreamsRef.current.get(p.id)?.isSharingScreen) {
      setIsSharingScreen(false);
    }
    remoteStreamsRef.current.delete(p.id);
    setRemoteStreamsRef(remoteStreamsRef.current);
    dispatch(removeParticipant({ name: p.displayName }));
  };

  const handleParticipantJoined = (p) => {
    p.subscribe();
    p.on('StartedSpeaking', () => {
      updateIsSpeakingStatus(p.id, true);
    });
    p.on('StoppedSpeaking', () => {
      updateIsSpeakingStatus(p.id, false);
    });
  };

  const joinRoom = async () => {
    const JWT = await roomJWTprovider(
      roomId,
      currentUser.email,
      null,
      null,
      () => { setRoomNotFound(true); },
    );

    try {
      const newRoom = new WebRoom(JWT);
      const newParticipant = await newRoom.join();
      setLocalParticipant(newParticipant);
      if (newParticipant) {
        dispatch(initRoom({
          id: roomId,
          participants: [{ name: currentUser.email, role: ROLES.GUEST }],
        }));

        newRoom.on('RemoveRemoteParticipant', (resp) => {
          if (resp.participantId === newParticipant.displayName) {
            leaveRoom();
            navigate('/rooms');
          }
        });

        // add event handler for TrackStarted event
        newRoom.on('ParticipantTrackSubscribed', handleTrackStarted);
        newRoom.on('ParticipantJoined', handleParticipantJoined);
        newRoom.on('ParticipantLeft', handleParticipantLeft);

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
        subscribeToRemoteStreams(newRoom);
        subscribeToRoleChanges(roomId, handleRoleChange);
      } else {
        setErrorJoiningRoom(true);
        throw new Error('A duplicate session has been detected.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  // initialize room
  useEffect(() => {
    joinRoom();
    return () => {
      dispatch(cleanRoom());
      leaveRoom();
    };
  }, []);

  const updateScreenShare = async () => {
    if (!isSharingScreen) {
      const JWT = await roomJWTprovider(roomId, `${currentUser.email}-screen-share`, null, null, () => { setRoomNotFound(true); });
      const newScreenRoom = new WebRoom(JWT);
      const newlocalParticipant = await newScreenRoom.join();
      setScreenRoom(newScreenRoom);
      try {
        const tracks = await newlocalParticipant.startScreenShare();
        const stream = new MediaStream();
        const audioStream = new MediaStream();
        const videoStream = new MediaStream();
        const newLocalTracks = { ...localTracks };

        tracks.forEach((track) => {
          if (track.kind === 'audio') {
            audioStream.addTrack(track.mediaStreamTrack);
          } else {
            videoStream.addTrack(track.mediaStreamTrack);
          }
          stream.addTrack(track.mediaStreamTrack);
          newLocalTracks[track.kind] = track;
        });

        setLocalTracks({ ...localTracks });
        // add listener on `Stop sharing` browser's button
        stream.getVideoTracks()[0]
          .addEventListener('ended', () => {
            newScreenRoom.leave();
          });
      } catch {
        newScreenRoom.leave();
      }
    } else {
      screenRoom.leave();
    }
  };

  useEffect(() => () => {
    if (isSharingScreen) {
      updateScreenShare();
    }
  }, [isSharingScreen]);

  const updateLocalTracksMuted = (kind, muted) => {
    localTracks[kind].muted = muted;
    setLocalTracks({ ...localTracks });
  };

  const localStreamStyle = {
    position: 'absolute',
    bottom: isChatVisible ? 55 : 30,
    right: isChatVisible ? 350 : 50,
  };

  const addManyParticipants = (numberOfParticipants) => {
    let videoNumber = 1;
    for (let i = 0; i < numberOfParticipants; i++) {
      addFakeParticipant(roomId, `testing${i}@hotmail.com`, videoNumber);
      videoNumber++;
      if (videoNumber > 3) {
        videoNumber = 0;
      }
    }
  };

  return (
    <>
      {
        isUserAdmin && TESTING_MODE && (
          <Button
            size="large"
            disabled={!localTracks.video}
            onClick={() => addManyParticipants(3)}
          >
            ADD USER
          </Button>
        )
      }

      {
        roomNotFound
        && <Navigate to="/rooms/404" />
      }
      {
        room ? (
          <Box style={{
            display: 'flex',
            justifyContent: isChatVisible ? 'flex-end' : 'center',
            width: '100%',
            height: '100%',
            alignItems: 'flex-start',
            position: 'relative',
            backgroundColor: 'rgb(32,33,36)',
            direction: { direction },
          }}
          >
            <Box style={{ marginTop: '10px' }}>
              {participantsCount > 0 && renderParticipantCollection()}

              {isSharingScreen
                && (
                  <Box
                    style={{
                      display: 'flex',
                      maxHeight: '100%',
                      width: `${screenShareWidth}px`,
                      position: 'relative',
                    }}
                  >
                    <ShareScreen width={`${screenShareWidth}px`}>
                      {remoteStreams.find((p) => p.isSharingScreen)}
                    </ShareScreen>
                  </Box>
                )}

              <div style={localStreamStyle}>
                <Video
                  stream={localStream}
                  isStreamLocal
                />
              </div>
              <RoomControls
                permissionRole={userRole}
                updateScreenShare={updateScreenShare}
                isSharingScreen={isSharingScreen}
                localTracks={localTracks}
                updateLocalTracksMuted={updateLocalTracksMuted}
                leaveRoom={leaveRoom}
                disabled={!room}
              />
              <Button
                variant="contained"
                size="large"
                onClick={toggleChatVisibility}
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: '66%',
                  transform: 'translateX(-50%)',
                }}
              >
                {isChatVisible ? 'Hide Chat' : 'Show Chat'}
              </Button>
            </Box>
            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
              <Slide direction="left" in={isChatVisible} mountOnEnter unmountOnExit>
                <Box>
                  <Chat />
                </Box>
              </Slide>
            </Box>
          </Box>

        ) : (
          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%',
          }}
          >
            {!errorJoiningRoom && <CircularProgress />}
          </div>
        )
      }
    </>
  );
}

export default Room;
