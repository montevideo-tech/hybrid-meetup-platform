// Room
import {
  React, useState, useEffect, useRef,
} from 'react';
import { useLoaderData, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button, Box, CircularProgress,
} from '@mui/material';

import useWindowDimensions from '../hooks/useWindowDimesion';
import useUserPermission from '../hooks/useUserPermission';
import RoomControls from '../components/RoomControls';
import Video from '../components/Video';

import { Room as WebRoom } from '../lib/webrtc';
import { roomJWTprovider, getRoomPermissions } from '../actions';
import {
  initRoom, addUpdateParticipant, removeParticipant, removeRole, cleanRoom,
} from '../reducers/roomSlice';
import subscribeToRoleChanges, { ROLES } from '../utils/roles';
import ParticipantsCollection from '../components/ParticipantsCollection';
import addFakeParticipant from '../scripts/addFakeParticipant';
import ShareScreen from '../components/ShareScreen';

export async function roomLoader({ params }) {
  return params.roomId;
}

function Room() {
  const [room, setRoom] = useState();
  const userRole = useUserPermission();
  // const [userParticipant, setUserParticipant] = useState();
  const [localStream, setLocalStream] = useState();
  // this helps keep track of muting/unmuting with RoomControls
  const [localTracks, setLocalTracks] = useState({ video: null, audio: null });
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [screenRoom, setScreenRoom] = useState();
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [roomNotFound, setRoomNotFound] = useState(false);
  const roomId = useLoaderData();
  const [participantKick, setParticipantKick] = useState(null);
  const [kickedParticipants, setKickedParticipants] = useState([]);
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

  // To add a new criteria to the comparator you need to
  // Decide if it's higher or lower pririoty compared to the already established
  // if it's higher you must add the 'if' before otherwise add it after.
  const comparator = (participant1, participant2) => {
    if (participant1.speaking > participant2.speaking) {
      return -1;
    }

    if (participant1.lastSpokenTime > participant2.lastSpokenTime) {
      return -1;
    }

    return 1;
  };
  const setRemoteStreamsRef = (data) => {
    remoteStreamsRef.current = data;
    const remoteStreamsSorted = Array.from(data.values()).sort(comparator);
    setRemoteStreams(remoteStreamsSorted);
  };

  const participantsCount = remoteStreams.length;

  let collectionWidth = width - paddingX * 2;
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

  useEffect(() => { console.log('roomRef.remoteParticipants', roomRef.remoteParticipants); }, [roomRef]);

  const leaveRoom = async () => {
    if (roomRef.current) {
      // await userParticipant.unpublishAllTracks(); // also stops them
      await roomRef.current.leave();
    }
  };

  useEffect(() => {
    console.log('cambia participantKick---->', participantKick);
  }, [participantKick]);

  // useEffect(() => {
  //   if (participantKick) {
  //     console.log('se selecciono un participante para remover');

  //     let participantId;

  //     remoteStreamsRef.current.forEach((participant, id) => {
  //       if (participant.name === participantKick) {
  //         participantId = id;
  //       }
  //     });

  //     console.log('participantId', participantId);
  //     console.log('remoteStreamsRef.current antes de borrarlo', remoteStreamsRef.current);

  //     // Aquí se agrega el participante expulsado a la lista de kickedParticipants
  //     setKickedParticipants([...kickedParticipants, participantKick]);

  //     console.log('remoteStreamsRef.current despues de borrarlo', remoteStreamsRef.current);
  //     setParticipantKick(null);
  //   }
  // }, [participantKick]);

  // useEffect(() => {
  //   if (participantKick) {
  //     console.log('se selecciono un participante para remover');

  //     let participantId;

  //     remoteStreamsRef.current.forEach((participant, id) => {
  //       if (participant.name === participantKick) {
  //         participantId = id;
  //       }
  //     });

  //     console.log('participantId', participantId);
  //     console.log('remoteStreamsRef.current antes de borrarlo', remoteStreamsRef.current);
  //     remoteStreamsRef.current.delete(participantId);
  //     setRemoteStreamsRef(remoteStreamsRef.current);
  //     console.log('remoteStreamsRef.current despues de borrarlo', remoteStreamsRef.current);
  //     dispatch(removeParticipant({ name: participantKick }));
  //     setParticipantKick(null);
  //   }
  // }, [participantKick]);
  useEffect(() => {
    if (participantKick) {
      console.log('se selecciono un participante para remover');

      let participantId;

      remoteStreamsRef.current.forEach((participant, id) => {
        if (participant.name === participantKick) {
          participantId = id;
        }
      });

      // Emitir el evento ParticipantLeft
      room.emit('ParticipantLeft', { id: participantId });
    }
  }, [participantKick]);

  console.log('remoteStreams------', remoteStreams);

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

      // add event handler for TrackStarted event
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
      });
      newRoom.on('ParticipantLeft', (p) => {
        console.log('ParticipantLeft se ejecutoooo');
        // Check if the participant who left the room was sharing screen
        if (remoteStreamsRef.current.get(p.id)?.isSharingScreen) {
          setIsSharingScreen(false);
        }
        remoteStreamsRef.current.delete(p.id);
        setRemoteStreamsRef(remoteStreamsRef.current);
        dispatch(removeParticipant({ name: p.displayName }));
      });
      // newRoom.on('ParticipantLeft', (p) => {
      //   // Check if the participant who left the room was sharing screen
      //   if (remoteStreamsRef.current.get(p.id)?.isSharingScreen) {
      //     setIsSharingScreen(false);
      //   }

      //   // Aquí se comprueba si el participante que abandonó la sala fue expulsado
      //   const isKickedParticipant = kickedParticipants.includes(p.displayName);

      //   if (!isKickedParticipant) {
      //     remoteStreamsRef.current.delete(p.id);
      //     setRemoteStreamsRef(remoteStreamsRef.current);
      //   } else {
      //     // Si fue expulsado, se elimina de la lista de kickedParticipants
      //     setKickedParticipants(kickedParticipants.filter((name) => name !== p.displayName));
      //   }

      //   dispatch(removeParticipant({ name: p.displayName }));
      // });

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
    };
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
    } else {
      screenRoom.leave();
    }

    setIsSharingScreen(!isSharingScreen);
  };

  const updateLocalTracksMuted = (kind, muted) => {
    localTracks[kind].muted = muted;
    setLocalTracks({ ...localTracks });
  };

  const localStreamStyle = {
    position: 'fixed',
    bottom: 4,
    right: 100,
  };

  const addManyParticipants = (numberOfParticipants) => {
    let videoNumber = 0;
    for (let i = 0; i < numberOfParticipants; i++) {
      addFakeParticipant(roomId, `testing${i}@hotmail.com`, videoNumber);
      videoNumber++;
      if (videoNumber > 0) {
        videoNumber = 0;
      }
    }
  };

  return (
    <>
      {
        isUserAdmin && (
          <Button
            size="large"
            disabled={!localTracks.video}
            onClick={() => addManyParticipants(8)}
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
            width: '100%',
            height: '100%',
            alignItems: 'center',
            position: 'relative',
            justifyContent: 'center',
            backgroundColor: 'rgb(32,33,36)',
            direction: { direction },
          }}
          >
            <ParticipantsCollection
              gap={gap}
              width={collectionWidth}
              height={collectionHeight}
              participantsPerPage={participantsPerPage}
              participantsCount={participantsCount}
              isAdmin={isUserAdmin}
              setParticipantKick={setParticipantKick}
            >
              {remoteStreams.filter((p) => !p.isSharingScreen)}
            </ParticipantsCollection>

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
      <RoomControls
        permissionRole={userRole}
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
