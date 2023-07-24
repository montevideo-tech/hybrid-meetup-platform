import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ButtonGroup, Tooltip } from "@mui/material";
import {
  ScreenShare as ScreenShareIcon,
  StopScreenShare as StopScreenShareIcon,
  HeadsetMic as HeadsetMicIcon,
  HeadsetOff as HeadsetOffIcon,
} from "@mui/icons-material";
import { ROLES } from "../../../utils/supabaseSDK/roles";
import { setGuestMuted } from "../../../utils/supabaseSDK/room";
import { Colors } from "../../../themes/colors";
import camera from "../../../assets/camera.svg";
import noCamera from "../../../assets/no-camera.svg";
import mic from "../../../assets/mic.svg";
import noMic from "../../../assets/no-mic.svg";
import noMicRed from "../../../assets/no-mic-red.svg";
import close from "../../../assets/close.svg";
import videoRecord from "../../../assets/videoRecord.svg";
import { getProvider } from "../../../utils/supabaseSDK/environment";
import Button from "../../../components/Button";
import Icon from "../../../components/Icon";
function RoomControls(props) {
  const navigate = useNavigate();
  const [videoActive, setVideoActive] = useState(true);
  const {
    updateScreenShare,
    isSharingScreen,
    participantSharingScreen,
    localTracks,
    updateLocalTracksMuted,
    leaveRoom,
    disabled,
    permissionRole,
    isEnableToUnmute,
    localParticipant,
    isBlockedRemotedGuest,
    setIsBlockedRemotedGuest,
    setLocalTracks,
    startRecording,
    isRecording,
  } = props;
  const [localVideoTrack, setLocalVideoTrack] = useState(localTracks.video);
  const [providerName, setProviderName] = useState("");

  const toggleMuteTrack = async (t) => {
    if (isEnableToUnmute || t.kind === "video") {
      if (t.kind === "video") {
        if (!videoActive) {
          setVideoActive(true);
          const tracks = await localParticipant.publishTracks({
            constraints: { video: true, audio: false },
          });
          const newLocalTracks = { ...localTracks };
          newLocalTracks[tracks[0].kind] = tracks[0];
          setLocalVideoTrack(tracks[0]);
          setLocalTracks(newLocalTracks);
          if (providerName === "MUX") {
            updateLocalTracksMuted(t.kind, false);
          }
        } else {
          setVideoActive(false);
          if (providerName === "MUX") {
            localParticipant.unpublishTracks([localVideoTrack]);
            updateLocalTracksMuted(localVideoTrack.kind, true);
            localVideoTrack.mute();
          } else {
            localParticipant.unpublishVideoTrack();
          }
        }
      } else {
        if (t.muted) {
          t.unmute();
          updateLocalTracksMuted(t.kind, false);
        } else {
          t.mute();
          updateLocalTracksMuted(t.kind, true);
        }
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      const provider = await getProvider();
      setProviderName(provider);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (!isEnableToUnmute && localTracks.audio) {
      setTimeout(function () {
        localTracks.audio.mute();
        updateLocalTracksMuted(localTracks.audio.kind, true);
      }, 500);
    }
  }, [localTracks.audio]);

  useEffect(() => {
    setLocalVideoTrack(localTracks.video);
  }, [localTracks.video]);

  const endCall = () => {
    leaveRoom();
    navigate("/rooms");
  };

  const shareScreen = async () => {
    updateScreenShare();
  };

  const blockMuteAllParticipants = () => {
    localParticipant.blockMuteAllRemoteParticipants(!isBlockedRemotedGuest);
    setIsBlockedRemotedGuest(!isBlockedRemotedGuest);
    setGuestMuted(!isBlockedRemotedGuest);
  };

  return (
    <Container variant="contained" size="large" disabled={disabled}>
      {permissionRole === ROLES.HOST && (
        <Tooltip title={!isRecording ? "Start recording" : "Stop recording"}>
          <StyledDiv>
            <Button
              onClick={startRecording}
              width="50px"
              height="50px"
              customStyles={{
                backgroundColor: Colors.lightPurple,
                border: `2px solid ${Colors.purple}`,
              }}
            >
              <Icon
                icon={videoRecord}
                name="record"
                width="27px"
                height="27px"
              />
            </Button>
          </StyledDiv>
        </Tooltip>
      )}
      <Tooltip
        title={
          !localTracks.video || !videoActive
            ? "Turn On Camera"
            : "Turn Off Camera"
        }
      >
        <StyledDiv>
          <Button
            disabled={!localTracks.video}
            onClick={() => toggleMuteTrack(localTracks.video)}
            width="50px"
            height="50px"
            customStyles={{
              backgroundColor: Colors.lightPurple,
              border: `2px solid ${Colors.purple}`,
            }}
          >
            {!localTracks.video || !videoActive ? (
              <Icon
                icon={noCamera}
                name="camera off"
                width="26px"
                height="26px"
                customStyles={{ marginTop: "2px" }}
              />
            ) : (
              <Icon
                icon={camera}
                name="camera on"
                width="23.2px"
                height="24px"
              />
            )}
          </Button>
        </StyledDiv>
      </Tooltip>

      <Tooltip
        title={
          !localTracks.audio || localTracks.audio.muted ? "Unmute" : "Mute"
        }
      >
        <StyledDiv>
          <Button
            disabled={!localTracks.audio || !isEnableToUnmute}
            onClick={() => toggleMuteTrack(localTracks.audio)}
            width="50px"
            height="50px"
            customStyles={{
              backgroundColor: Colors.lightPurple,
              border: `2px solid ${Colors.purple}`,
            }}
          >
            {!localTracks.audio ||
            localTracks.audio.muted ||
            !isEnableToUnmute ? (
              isEnableToUnmute ? (
                <Icon
                  icon={noMic}
                  name="microphone off"
                  height="26px"
                  width="26px"
                />
              ) : (
                <Icon
                  icon={noMicRed}
                  name="microphone disabled"
                  height="26px"
                  width="26px"
                />
              )
            ) : (
              <Icon
                icon={mic}
                name="microphone on"
                height="28px"
                width="28px"
                customStyles={{ marginTop: "2px" }}
              />
            )}
          </Button>
        </StyledDiv>
      </Tooltip>
      {(permissionRole === ROLES.PRESENTER ||
        permissionRole === ROLES.HOST) && (
        <Tooltip
          title={
            !isSharingScreen
              ? "Share screen"
              : participantSharingScreen &&
                participantSharingScreen !== localParticipant.displayName
              ? ""
              : "Stop sharing screen"
          }
        >
          <StyledDiv>
            <Button
              onClick={() => shareScreen()}
              disabled={
                participantSharingScreen &&
                participantSharingScreen !== localParticipant.displayName
              }
              width="50px"
              height="50px"
              customStyles={{
                backgroundColor: Colors.lightPurple,
                color: Colors.purple,
                border: `2px solid ${Colors.purple}`,
              }}
            >
              {!isSharingScreen ? <ScreenShareIcon /> : <StopScreenShareIcon />}
            </Button>
          </StyledDiv>
        </Tooltip>
      )}
      {permissionRole === ROLES.HOST && (
        <Tooltip
          title={
            !isBlockedRemotedGuest ? "Mute all Guests" : "Unmute all Guests"
          }
        >
          <StyledDiv>
            <Button
              onClick={() => blockMuteAllParticipants()}
              width="50px"
              height="50px"
              customStyles={{
                backgroundColor: Colors.lightPurple,
                color: Colors.purple,
                border: `2px solid ${Colors.purple}`,
              }}
            >
              {!isBlockedRemotedGuest ? (
                <HeadsetMicIcon />
              ) : (
                <HeadsetOffIcon sx={{ marginBottom: "1.4px" }} />
              )}
            </Button>
          </StyledDiv>
        </Tooltip>
      )}

      <Tooltip title="Leave room">
        <StyledDiv>
          <Button
            primary
            width="50px"
            height="50px"
            customStyles={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={endCall}
          >
            <Icon icon={close} name="close" height="25px" width="25px" />
          </Button>
        </StyledDiv>
      </Tooltip>
    </Container>
  );
}

RoomControls.defaultProps = {
  localTracks: { audio: null, video: null },
  disabled: true,
  isSharingScreen: false,
  permissionRole: "GUEST",
  isEnableToUnmute: true,
  localParticipant: null,
  isBlockedRemotedGuest: false,
};

const Container = styled(ButtonGroup)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  border: transparent !important;
`;

const StyledDiv = styled.div`
  padding: 5px;
`;

export default RoomControls;
