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
  Box, CircularProgress,
} from '@mui/material';

import useWindowDimensions from '../hooks/useWindowDimesion';
import RoomControls from '../components/RoomControls';
import Video from '../components/Video';

import { Room as WebRoom } from '../lib/webrtc';
import { roomJWTprovider, getRoomPermissions } from '../actions';
import {
  initRoom, addUpdateParticipant, removeParticipant, removeRole, cleanRoom,
} from '../reducers/roomSlice';
import subscribeToRoleChanges, { ROLES } from '../utils/roles';
import ParticipantsCollection from '../components/ParticipantsCollection';

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
  // const roomData = useSelector((state) => state.room);
  const dispatch = useDispatch();
  const { width = 0, height = 0 } = useWindowDimensions();
  const headerHeight = 153.6; // 8vh
  let gap = 10;
  const paddingY = height < 600 ? 10 : 40;
  const paddingX = width < 800 ? 40 : 60;

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
  let screenShareWidth = isSharingScreen ? width - collectionWidth : 0;
  let direction = 'row';
  if (width < height) {
    gap = 8;
    collectionWidth = width - paddingX * 2;
    if (isSharingScreen) {
      direction = 'column';
      screenShareWidth = width;
      collectionHeight = height - headerHeight - (width / 4) * 3;
    }
  }
  const scaleFactor = 2.25;
  const rows = Math.max(Math.ceil(collectionHeight / (90 * scaleFactor)), 1);
  const columns = Math.max(Math.ceil(collectionWidth / (160 * scaleFactor)), 1);
  const participantsPerPage = Math.round(rows * columns);

  const setRemoteStreamsRef = (data) => {
    remoteStreamsRef.current = data;
    setRemoteStreams(Array.from(data.values()));
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
      // subscribe ta all remote participants for testing purposes
      const { remoteParticipants } = r;
      const rps = Array.from(remoteParticipants.values());
      await Promise.all(rps.map(async (rp) => {
        dispatch(addUpdateParticipant({
          name: rp.id,
          role: ROLES.GUEST,
        }));
        rp.subscribe();
        // Add remote participants to participants list.
      }));

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
              audioStream, videoStream, [`${track.kind}Muted`]: track.muted, name: remoteParticipant.displayName,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
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
            display: 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            position: 'relative',
            justifyContent: 'center',
            direction: { direction },
          }}
          >
            <ParticipantsCollection
              gap={gap}
              width={collectionWidth}
              height={collectionHeight}
              participantsPerPage={participantsPerPage}
              participantsCount={participantsCount}
            >
              {remoteStreams}
            </ParticipantsCollection>
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
