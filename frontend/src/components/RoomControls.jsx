import { React, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ButtonGroup, Tooltip } from "@mui/material";
import {
  ScreenShare as ScreenShareIcon,
  StopScreenShare as StopScreenShareIcon,
  HeadsetMic as HeadsetMicIcon,
  HeadsetOff as HeadsetOffIcon,
} from "@mui/icons-material";
import { LocalParticipant } from "@mux/spaces-web";
import { ROLES } from "../utils/roles";
import { setGuestMuted } from "../utils/room";
import { Button } from "../themes/componentsStyles";
import camera from "../assets/camera.svg";
import noCamera from "../assets/no-camera.svg";
import mic from "../assets/mic.svg";
import noMic from "../assets/no-mic.svg";
import noMicRed from "../assets/no-mic-red.svg";
import close from "../assets/close.svg";
import videoRecord from "../assets/videoRecord.svg";
import { getProvider } from "../utils/environment";
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
  const [providerName, setProviderName] = useState('');

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
              $customStyles={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "40px",
                height: "40px",
              }}
              onClick={startRecording}
            >
              <img src={videoRecord} alt="record" />
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
            $customStyles={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "40px",
              height: "40px",
            }}
            disabled={!localTracks.video}
            onClick={() => toggleMuteTrack(localTracks.video)}
          >
            {!localTracks.video || !videoActive ? (
              <StyledImg src={noCamera} alt="camera off" height="19.4px" />
            ) : (
              <img src={camera} alt="camera on" />
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
            $customStyles={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "40px",
              height: "40px",
            }}
            disabled={!localTracks.audio || !isEnableToUnmute}
            onClick={() => toggleMuteTrack(localTracks.audio)}
          >
            {!localTracks.audio ||
            localTracks.audio.muted ||
            !isEnableToUnmute ? (
              isEnableToUnmute ? (
                <img src={noMic} alt="microphone off" height="23px" />
              ) : (
                <img src={noMicRed} alt="microphone disabled" height="23px" />
              )
            ) : (
              <StyledImg src={mic} alt="microphone on" height="23.5px" />
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
              disabled={
                participantSharingScreen &&
                participantSharingScreen !== localParticipant.displayName
              }
              $customStyles={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "40px",
                height: "40px",
              }}
              onClick={() => shareScreen()}
            >
              {!isSharingScreen ? (
                <ScreenShareIcon fontSize="small" />
              ) : (
                <StopScreenShareIcon fontSize="small" />
              )}
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
              $customStyles={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "40px",
                height: "40px",
              }}
              onClick={() => blockMuteAllParticipants()}
            >
              {!isBlockedRemotedGuest ? (
                <HeadsetMicIcon fontSize="small" />
              ) : (
                <HeadsetOffIcon
                  fontSize="small"
                  sx={{ marginBottom: "1.4px" }}
                />
              )}
            </Button>
          </StyledDiv>
        </Tooltip>
      )}

      <Tooltip title="Leave room">
        <StyledDiv>
          <Button
            $primary
            $customStyles={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "40px",
              height: "40px",
            }}
            onClick={endCall}
          >
            <img src={close} alt="close" />
          </Button>
        </StyledDiv>
      </Tooltip>
    </Container>
  );
}

RoomControls.propTypes = {
  localTracks: PropTypes.object,
  updateScreenShare: PropTypes.func.isRequired,
  updateLocalTracksMuted: PropTypes.func.isRequired,
  leaveRoom: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  isSharingScreen: PropTypes.bool,
  permissionRole: PropTypes.string,
  isEnableToUnmute: PropTypes.bool,
  localParticipant: LocalParticipant,
  setIsBlockedRemotedGuest: PropTypes.func.isRequired,
  isBlockedRemotedGuest: PropTypes.bool,
};

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
  padding: 2px;
`;

const StyledImg = styled.img`
  margin-top: 1.7px;
`;

export default RoomControls;
