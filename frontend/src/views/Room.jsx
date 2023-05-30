// Room
import { React, useState, useEffect, useRef, forwardRef } from "react";
import { useLoaderData, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { CircularProgress, Badge } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import styled from "styled-components";
import useWindowDimensions from "../hooks/useWindowDimesion";
import useUserPermission from "../hooks/useUserPermission";
import RoomControls from "../components/RoomControls";

import { Room as WebRoom } from "../lib/webrtc";
import { roomJWTprovider } from "../actions";
import {
  initRoom,
  addUpdateParticipant,
  removeParticipant,
  removeRole,
  cleanRoom,
  SnackbarAlert,
} from "../reducers/roomSlice";
import subscribeToRoleChanges, { ROLES } from "../utils/roles";
import ParticipantsCollection from "../components/ParticipantsCollection";
import Chat from "../components/Chat";
import { comparator, updateParticipantRoles } from "../utils/helpers";
import { getGuestMuted } from "../utils/room";
import { epochToISO8601 } from "../utils/time";
import {
  subscribeToNewMessages,
  subscribeToDeleteMessages,
  fetchMessages,
} from "../utils/chat";
import { Colors } from "../themes/colors";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";

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
  const paddingY = height < 600 ? 10 : 40;
  const paddingX = width < 800 ? 40 : 60;
  const navigate = useNavigate();
  const [isEnableToUnmute, setIsEnableToUnmute] = useState(true);
  const [isBlockedRemotedGuest, setIsBlockedRemotedGuest] = useState(false);
  const [dateTimeJoined] = useState(epochToISO8601(Date.now()));
  const [messages, setMessages] = useState([]);
  const [participantSharingScreen, setParticipantSharingScreen] =
    useState(null);
  const [chatOpen, setChatOpen] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);

  // To add a new criteria to the comparator you need to
  // Decide if it's higher or lower pririoty compared to the already established
  // if it's higher you must add the 'if' before otherwise add it after.
  const setRemoteStreamsRef = (data) => {
    remoteStreamsRef.current = data;
    const remoteStreamsSorted = Array.from(data.values()).sort(comparator);
    setRemoteStreams(remoteStreamsSorted);
  };

  const participantsCount = remoteStreams.length;

  let collectionWidth = isChatVisible
    ? width - paddingX * 2 - 330
    : width - paddingX * 2;

  if (isSharingScreen) {
    if (participantsCount < 6) {
      collectionWidth = width * 0.25 - paddingX;
    } else {
      collectionWidth = width * 0.33 - paddingX / 2;
    }

    collectionWidth = Math.max(collectionWidth, 160);
  }
  let collectionHeight = height - headerHeight - paddingY * 2;

  if (width < height) {
    collectionWidth = width - paddingX * 2;
    if (isSharingScreen) {
      collectionHeight = height - headerHeight - (width / 4) * 3;
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

  useEffect(() => {
    subscribeToNewMessages(() =>
      fetchMessages(roomId, dateTimeJoined, setMessages),
    );
    subscribeToDeleteMessages(() =>
      fetchMessages(roomId, dateTimeJoined, setMessages),
    );
  }, []);

  useEffect(() => {
    if (!chatOpen) {
      setUnreadMessages((prevUnreadMessages) => prevUnreadMessages + 1);
    }
  }, [messages]);

  const handleRoleChange = (payload) => {
    if (payload.eventType === "INSERT") {
      const { id, userEmail } = payload;
      const permission = payload["rooms-permission"].name;
      dispatch(
        addUpdateParticipant({
          name: userEmail,
          role: permission,
          id,
        }),
      );
    }
    // Supabase realtime only sends the ID that was deleted from the rooms-data table
    if (payload.eventType === "DELETE") {
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

  const RenderParticipantCollection = () => {
    return (
      <ParticipantsCollection
        participantsPerPage={participantsPerPage}
        participantsCount={participantsCount}
        localParticipant={localParticipant}
        permissionRole={userRole}
        isEnableToUnmute={isEnableToUnmute}
      >
        {remoteStreams.filter((p) => !p.isSharingScreen)}
      </ParticipantsCollection>
    );
  };

  const subscribeToRemoteStreams = async (r) => {
    const { remoteParticipants } = r;
    const rps = Array.from(remoteParticipants.values());
    // Listen to all the participants that are already on the call
    rps.map(async (rp) => {
      rp.on("StartedSpeaking", () => {
        updateIsSpeakingStatus(rp.connectionId, true);
      });
      rp.on("StoppedSpeaking", () => {
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
      if (track.kind === "audio") {
        streamData.audioStream = stream;
      } else {
        streamData.videoStream = stream;
      }
      remoteStreamsRef.current.set(remoteParticipant.id, streamData);
    } else {
      const audioStream = new MediaStream();
      const videoStream = new MediaStream();
      let isSharingScreen = false;

      if (track.kind === "audio") {
        audioStream.addTrack(track.mediaStreamTrack);
      } else {
        videoStream.addTrack(track.mediaStreamTrack);
      }
      if (track.provider.source === "screenshare") {
        isSharingScreen = true;
        setIsSharingScreen(isSharingScreen);
        setParticipantSharingScreen(
          remoteParticipant.displayName.substring(
            0,
            remoteParticipant.displayName.indexOf("-screen-share"),
          ),
        );
      }
      remoteStreamsRef.current.set(remoteParticipant.id, {
        audioStream,
        videoStream,
        [`${track.kind}Muted`]: track.muted,
        speaking: false,
        name: remoteParticipant.displayName,
        isSharingScreen, // set isSharingScreen for remote participant
        lastSpokenTime: 0,
      });
    }
    setRemoteStreamsRef(remoteStreamsRef.current);

    // add event handler for Muted/Unmuted events
    track.on("Muted", () => handleTrackMuted(remoteParticipant, track));
    track.on("Unmuted", () => handleTrackUnmuted(remoteParticipant, track));
  };

  const handleParticipantLeft = (p) => {
    // Check if the participant who left the room was sharing screen
    if (remoteStreamsRef.current.get(p.id)?.isSharingScreen) {
      setIsSharingScreen(false);
      setParticipantSharingScreen(null);
    }
    remoteStreamsRef.current.delete(p.id);
    setRemoteStreamsRef(remoteStreamsRef.current);
    dispatch(removeParticipant({ name: p.displayName }));
  };

  const handleParticipantJoined = (p) => {
    p.subscribe();
    p.on("StartedSpeaking", () => {
      updateIsSpeakingStatus(p.id, true);
    });
    p.on("StoppedSpeaking", () => {
      updateIsSpeakingStatus(p.id, false);
    });
  };

  const Alert = forwardRef((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
  ));

  Alert.displayName = "errorAlert";

  const handleRemoveParticipant = (resp, participant) => {
    if (resp.participantId === participant.displayName) {
      leaveRoom();
      navigate("/rooms");
    }
  };

  const handleBlockMuteRemote = (resp, participant, localTracks) => {
    if (
      resp.participantId === participant.displayName &&
      currentUser.role !== ROLES.ADMIN
    ) {
      setIsEnableToUnmute(resp.isMuted);
      localTracks.audio.mute();
    }
  };

  const handleBlockMuteAllGuests = (resp, localTracks) => {
    if (currentUser.role !== ROLES.ADMIN) {
      setIsEnableToUnmute(!resp.blockMuted);
      if (resp.blockMuted) {
        localTracks.audio.mute();
      }
    } else {
      setIsBlockedRemotedGuest(resp.blockMuted);
    }
  };

  const joinRoom = async () => {
    const JWT = await roomJWTprovider(
      roomId,
      currentUser.email,
      null,
      null,
      () => {
        setRoomNotFound(true);
      },
    );
    const guestMuted = await getGuestMuted();
    setIsBlockedRemotedGuest(guestMuted);
    if (currentUser.role !== ROLES.ADMIN) {
      setIsEnableToUnmute(!guestMuted);
    }
    try {
      const newRoom = new WebRoom(JWT);
      const newParticipant = await newRoom.join();
      setLocalParticipant(newParticipant);
      if (newParticipant) {
        dispatch(
          initRoom({
            id: roomId,
            participants: [{ name: currentUser.email, role: ROLES.GUEST }],
          }),
        );

        // add event handler for TrackStarted event
        newRoom.on("RemoveRemoteParticipant", (resp) =>
          handleRemoveParticipant(resp, newParticipant),
        );
        newRoom.on("ParticipantTrackSubscribed", handleTrackStarted);
        newRoom.on("ParticipantJoined", handleParticipantJoined);
        newRoom.on("ParticipantLeft", handleParticipantLeft);

        setRoom(newRoom);
        roomRef.current = newRoom;
        const tracks = await newParticipant.publishTracks({
          constraints: { video: true, audio: true },
        });
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

        newRoom.on("BlockMuteRemoteParticipant", (resp) =>
          handleBlockMuteRemote(resp, newParticipant, newLocalTracks),
        );
        newRoom.on("BlockMuteAllRemoteParticipants", (resp) =>
          handleBlockMuteAllGuests(resp, newLocalTracks),
        );
      } else {
        const error = "A duplicate session has been detected";
        dispatch(SnackbarAlert({ error }));
        navigate("/rooms");
        setErrorJoiningRoom(true);
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
      const JWT = await roomJWTprovider(
        roomId,
        `${currentUser.email}-screen-share`,
        null,
        null,
        () => {
          setRoomNotFound(true);
        },
      );
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
          if (track.kind === "audio") {
            audioStream.addTrack(track.mediaStreamTrack);
          } else {
            videoStream.addTrack(track.mediaStreamTrack);
          }
          stream.addTrack(track.mediaStreamTrack);
          newLocalTracks[track.kind] = track;
        });

        setLocalTracks({ ...localTracks });
        // add listener on `Stop sharing` browser's button
        stream.getVideoTracks()[0].addEventListener("ended", () => {
          newScreenRoom.leave();
        });
      } catch {
        newScreenRoom.leave();
      }
    } else {
      screenRoom.leave();
    }
  };

  useEffect(
    () => () => {
      if (isSharingScreen) {
        updateScreenShare();
      }
    },
    [isSharingScreen],
  );

  const updateLocalTracksMuted = (kind, muted) => {
    localTracks[kind].muted = muted;
    setLocalTracks({ ...localTracks });
  };

  const OnClickChatButton = () => {
    setChatOpen(!chatOpen);
    setUnreadMessages(0);
  };
  return (
    <>
      {roomNotFound && <Navigate to="/rooms/404" />}
      {room ? (
        <Container $chatOpen={chatOpen}>
          <VideosContainer>
            <RenderParticipantCollection />
          </VideosContainer>
          {chatOpen && (
            <ShowChat>
              <Chat messages={messages} isUserAdmin={isUserAdmin} />
            </ShowChat>
          )}
          <Buttons>
            <>
              <CenteredDiv>
                <RoomControls
                  permissionRole={userRole}
                  updateScreenShare={updateScreenShare}
                  isSharingScreen={isSharingScreen}
                  participantSharingScreen={participantSharingScreen}
                  localTracks={localTracks}
                  updateLocalTracksMuted={updateLocalTracksMuted}
                  leaveRoom={leaveRoom}
                  disabled={!room}
                  isEnableToUnmute={isEnableToUnmute}
                  localParticipant={localParticipant}
                  isBlockedRemotedGuest={isBlockedRemotedGuest}
                  setIsBlockedRemotedGuest={setIsBlockedRemotedGuest}
                  setLocalTracks={setLocalTracks}
                />
              </CenteredDiv>
              <ChatButton onClick={OnClickChatButton}>
                <Badge badgeContent={unreadMessages} color="secondary">
                  {chatOpen ? (
                    <ChatBubbleIcon color="primary" fontSize="large" />
                  ) : (
                    <ChatOutlinedIcon color="primary" fontSize="large" />
                  )}
                </Badge>
              </ChatButton>
            </>
          </Buttons>
        </Container>
      ) : (
        <StyledContainer>
          {!errorJoiningRoom && <CircularProgress />}
        </StyledContainer>
      )}
    </>
  );
}

export default Room;

const Container = styled.div`
  display: grid;
  grid-template-rows: 1fr 60px;
  height: 100%;
  ${({ $chatOpen }) =>
    $chatOpen
      ? `
    grid-template-columns: 1fr 360px;
    transition: grid-template-columns 1s ease; 
    `
      : `
    grid-template-columns: 1fr 0px;
    transition: grid-template-columns 1s ease;
    `};
`;

const CenteredDiv = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ChatButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const Buttons = styled.div`
  grid-column: 1 / span 2;
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  background-color: ${Colors.black};
  padding: 0 40px;
`;

const ShowChat = styled.div`
  background: ${Colors.black};
  padding: 20px 30px 20px 0;
`;

const VideosContainer = styled.div`
  background: ${Colors.black};
`;

const StyledContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;
