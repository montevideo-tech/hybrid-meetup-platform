import { React, useState, useEffect, useRef, forwardRef } from "react";
import { useLoaderData, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { CircularProgress, Badge } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import styled from "styled-components";
import useUserPermission from "../hooks/useUserPermission";
import RoomControls from "../components/RoomControls";

import { Room as DolbyWebRoom } from "../Dolby/dolbyProvider";
import { Room as MuxWebRoom } from "../lib/webrtc";
import { roomJWTprovider } from "../actions";
import {
  initRoom,
  addUpdateParticipant,
  removeParticipant,
  removeRole,
  cleanRoom,
  SnackbarAlert,
} from "../reducers/roomSlice";
import {subscribeToRoleChanges, ROLES } from "../utils/roles";
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
import ShareScreen from "../components/ShareScreen";
import { Colors } from "../themes/colors";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import Audio from "../components/Audio";
import Video from "../components/Video";
import { Button } from "../themes/componentsStyles";
import ChatIcon from "@mui/icons-material/Chat";
import participants from "../assets/participants.svg";
import VideoRecorder from "../components/VideoRecorder";
import {
  VITE_WEBRTC_PROVIDER_NAME,
  VITE_DOLBY_API_KEY,
} from "../lib/constants";

export async function roomLoader({ params }) {
  return params.roomId;
}

function Room() {
  const [room, setRoom] = useState();
  const [localParticipant, setLocalParticipant] = useState();
  const userRole = useUserPermission();
  const [localTracks, setLocalTracks] = useState({ video: null, audio: null });
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [screenRoom, setScreenRoom] = useState();
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [roomNotFound, setRoomNotFound] = useState(false);
  const [errorJoiningRoom, setErrorJoiningRoom] = useState(false);
  const roomId = useLoaderData();
  const roomRef = useRef();
  const remoteStreamsRef = useRef(new Map());
  const currentUser = useSelector((state) => state.user);
  const isUserAdmin = currentUser?.role === ROLES.ADMIN;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEnableToUnmute, setIsEnableToUnmute] = useState(true);
  const [isBlockedRemotedGuest, setIsBlockedRemotedGuest] = useState(false);
  const [dateTimeJoined] = useState(epochToISO8601(Date.now()));
  const [messages, setMessages] = useState([]);
  const [participantSharingScreen, setParticipantSharingScreen] =
    useState(null);
  const [chatOpen, setChatOpen] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [screenWidth, setScreenWidth] = useState(0);
  const [localVideoStream, setLocalVideoStream] = useState(undefined);
  const [localAudioStream, setLocalAudioStream] = useState(undefined);
  const [localName, setLocalName] = useState(undefined);
  const [isRecording, setIsRecording] = useState(false);
  // To add a new criteria to the comparator you need to
  // Decide if it's higher or lower pririoty compared to the already established
  // if it's higher you must add the 'if' before otherwise add it after.
  const setRemoteStreamsRef = (data) => {
    remoteStreamsRef.current = data;
    const remoteStreamsSorted = Array.from(data.values()).sort(comparator);
    setRemoteStreams(remoteStreamsSorted);
  };

  const startRecording = () => {
    setIsRecording(!isRecording);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const participantsCount = remoteStreams.length;

  const leaveRoom = async () => {
    if (roomRef.current) {
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
    if (VITE_WEBRTC_PROVIDER_NAME === "MUX") {
      if (localParticipant?.provider?.videoTracks?.entries().next()?.value) {
        const localVideoStream = new MediaStream();
        localVideoStream.addTrack(
          localParticipant?.provider?.videoTracks?.entries().next()?.value[1]
            .track,
        );
        setLocalVideoStream(localVideoStream);
      }
      if (localParticipant?.provider?.audioTracks?.entries().next()?.value) {
        setLocalAudioStream(
          localParticipant?.provider?.audioTracks?.entries().next()?.value[1],
        );
      }
      setLocalName(localParticipant?.displayName);
    } else {
      if (localTracks.video) {
        const newlocalVideoStream = new MediaStream();
        newlocalVideoStream.addTrack(localTracks.video.mediaStreamTrack);
        setLocalVideoStream(newlocalVideoStream);
      }
    }
  }, [
    localParticipant?.provider?.audioTracks?.entries().next().done,
    localParticipant?.provider?.videoTracks?.entries().next().done,
    localTracks,
  ]);

  useEffect(() => {
    if (!chatOpen) {
      setUnreadMessages((prevUnreadMessages) => prevUnreadMessages + 1);
    } else {
      setUnreadMessages(0);
    }
  }, [messages]);

  const divRef = useRef(null);
  useEffect(() => {
    if (divRef.current) {
      const divElement = divRef.current;
      const { width } = divElement.getBoundingClientRect();
      setScreenWidth(width);
    }
  }, [divRef.current]);

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

  const onClickRemove = (r) => {
    localParticipant.removeRemoteParticipant(r);
  };

  const onClickMute = (r, isMuted) => {
    localParticipant.blockMuteRemoteParticipant(r, isMuted);
  };

  const RenderParticipantCollection = () => {
    return (
      <ParticipantsCollection
        participantsCount={participantsCount}
        localParticipant={localParticipant}
        permissionRole={userRole}
        isEnableToUnmute={isEnableToUnmute}
        localVideoStream={localVideoStream}
        localAudioStream={localAudioStream}
        localName={localName}
      >
        {remoteStreams.filter((p) => !p.isSharingScreen)}
      </ParticipantsCollection>
    );
  };

  const RenderSharingScreen = () => {
    const maxParticipant = Math.trunc(screenWidth / 200) - 1;
    return (
      <ShareScreenContainer>
        {remoteStreams.map(({ audioStream, name }) => (
          <Audio key={name} stream={audioStream} />
        ))}
        <ShareScreenParticipants>
          <Video
            permissionRole=""
            key={localName}
            stream={localVideoStream}
            isAudioMuted={localAudioStream.muted || false}
            isVideoMuted={localVideoStream.muted || false}
            isSpeaking={false}
            name={localName}
            isSharingScreen={isSharingScreen}
          />
          {remoteStreams
            .filter((p) => !p.isSharingScreen)
            .slice(0, maxParticipant)
            .map(({ videoStream, name, audioMuted, videoMuted, speaking }) => {
              return (
                <Video
                  permissionRole={userRole}
                  key={name}
                  stream={videoStream}
                  isAudioMuted={audioMuted || false}
                  isVideoMuted={videoMuted || false}
                  isSpeaking={speaking || false}
                  name={name}
                  onClick={() => onClickRemove(name)}
                  onClickMute={() => onClickMute(name, audioMuted)}
                  isSharingScreen={isSharingScreen}
                />
              );
            })}
        </ShareScreenParticipants>
        <ShareScreen>
          {remoteStreams.find((p) => p.isSharingScreen)}
        </ShareScreen>
      </ShareScreenContainer>
    );
  };

  const subscribeToRemoteStreams = async (r) => {
    const { remoteParticipants } = r;
    if (remoteParticipants) {
      const rps = Array.from(remoteParticipants.values());
      // Listen to all the participants that are already on the call
      rps.map(async (rp) => {
        rp.on("StartedSpeaking", () => {
          updateIsSpeakingStatus(rp.connectionId, true);
        });
        rp.on("StoppedSpeaking", () => {
          updateIsSpeakingStatus(rp.connectionId, false);
        });
        if (VITE_WEBRTC_PROVIDER_NAME === "MUX") {
          await rp.subscribe();
        } else {
          await r.subscribeRemoteParticipants();
        }
      });
      updateParticipantRoles(roomId, dispatch);
    }
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

  const handleTrackUpdated = (remoteParticipant, track) => {
    const currentRemoteStreamsRef = remoteStreamsRef.current;
    const currentRemoteStream = remoteStreamsRef.current.get(
      remoteParticipant.id,
    );
    const stream = new MediaStream();
    stream.addTrack(track.mediaStreamTrack);
    if (currentRemoteStream) {
      if (track.kind === "video") {
        currentRemoteStream.videoStream = stream;
      } else {
        currentRemoteStream.audioStream = stream;
      }
      currentRemoteStreamsRef.set(remoteParticipant.id, currentRemoteStream);
      setRemoteStreamsRef(currentRemoteStreamsRef);
    }
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
      try {
        if (track.kind === "audio") {
          audioStream.addTrack(track.mediaStreamTrack);
        } else {
          videoStream.addTrack(track.mediaStreamTrack);
        }
      } catch (error) {
        console.error(error);
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
    const MuxJWT = await roomJWTprovider(
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
      const newRoom =
        VITE_WEBRTC_PROVIDER_NAME === "MUX"
          ? new MuxWebRoom(MuxJWT)
          : new DolbyWebRoom(VITE_DOLBY_API_KEY, currentUser.email);
      const newParticipant = await newRoom.join();
      setLocalParticipant(newParticipant);
      if (newParticipant) {
        dispatch(
          initRoom({
            id: roomId,
            participants: [{ name: currentUser.username, role: ROLES.GUEST }],
          }),
        );

        // add event handler for TrackStarted event
        newRoom.on("RemoveRemoteParticipant", (resp) =>
          handleRemoveParticipant(resp, newParticipant),
        );
        newRoom.on("ParticipantTrackSubscribed", handleTrackStarted);
        newRoom.on("ParticipantTrackUpdated", handleTrackUpdated);
        newRoom.on("ParticipantJoined", handleParticipantJoined);
        newRoom.on("ParticipantLeft", handleParticipantLeft);

        setRoom(newRoom);
        roomRef.current = newRoom;
        const propsTracks = {
          constraints: {
            video: true,
            audio: true,
          },
        };
        const tracks = await newParticipant.publishTracks(propsTracks);
        const stream = new MediaStream();
        const newLocalTracks = { ...localTracks };
        tracks.forEach((track) => {
          stream.addTrack(track.mediaStreamTrack);
          newLocalTracks[track.kind] = track;
        });
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
      const newScreenRoom = new MuxWebRoom(JWT);
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
      {isRecording && (
        <VideoRecorder
          isRecording={isRecording}
          stopRecording={stopRecording}
        />
      )}
      {roomNotFound && <Navigate to="/rooms/404" />}
      {room ? (
        <Container $chatOpen={chatOpen}>
          <VideosContainer ref={divRef}>
            {isSharingScreen ? (
              <RenderSharingScreen />
            ) : (
              localVideoStream && <RenderParticipantCollection />
            )}
          </VideosContainer>
          {chatOpen && (
            <ShowChat>
              <Chat messages={messages} isUserAdmin={isUserAdmin} />
            </ShowChat>
          )}
          <Buttons>
            <>
              <NumberParticipantsContainer>
                <span>Hybridly Meeting</span>
                <img
                  src={participants}
                  alt="number of participans"
                  width="19.25px"
                  height="14px"
                />
                <span>
                  {room.getNumberOfParticipants()}
                </span>
              </NumberParticipantsContainer>
              <CenteredDiv>
                <RoomControls
                  startRecording={startRecording}
                  stopRecording={stopRecording}
                  isRecording={isRecording}
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
              <Button
                $customStyles={{ width: "40px", height: "40px" }}
                onClick={OnClickChatButton}
              >
                <Badge badgeContent={unreadMessages} color="secondary">
                  {chatOpen ? (
                    <ChatIcon fontSize="small" />
                  ) : (
                    <ChatOutlinedIcon color="primary" fontSize="small" />
                  )}
                </Badge>
              </Button>
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
    grid-template-columns: 1fr 290px;
    `
      : `
    grid-template-columns: 1fr 0px;
    `};
`;

const NumberParticipantsContainer = styled.div`
  display: flex;
  align-items: center;
  span {
    font-family: "Poppins";
    font-weight: 400;
    font-size: 0.938rem;
    line-height: 22px;
    color: ${Colors.white};
  }
  img {
    margin: 0 3px 0 10px;
  }
`;

const CenteredDiv = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
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

const ShareScreenContainer = styled.div`
  display: grid;
  height: 100%;
  grid-template-rows: 170px 1fr;
`;

const ShareScreenParticipants = styled.div`
  padding: 10px 0;
  display: flex;
`;
