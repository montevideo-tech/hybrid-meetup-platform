import { React, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ButtonGroup, Button, Tooltip } from "@mui/material";
import {
  Videocam as VideocamIcon,
  VideocamOffOutlined as VideocamOffOutlinedIcon,
  Mic as MicIcon,
  MicOffOutlined as MicOffOutlinedIcon,
  Cancel as CancelIcon,
  ScreenShare as ScreenShareIcon,
  StopScreenShare as StopScreenShareIcon,
  HeadsetMic as HeadsetMicIcon,
  HeadsetOff as HeadsetOffIcon,
} from "@mui/icons-material";
import { LocalParticipant } from "@mux/spaces-web";
import { ROLES } from "../utils/roles";
import { setGuestMuted } from "../utils/room";

function RoomControls(props) {
  const navigate = useNavigate();
  const [muted, setMuted] = useState(false);

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
  } = props;
  const [localVideoTrack, setLocalVideoTrack] = useState(localTracks.video);

  const toggleMuteTrack = async (t) => {
    if (isEnableToUnmute || t.kind === "video") {
      if (t.kind === "video") {
        if (muted) {
          setMuted(false);
          const tracks = await localParticipant.publishTracks({
            constraints: { video: true, audio: false },
          });
          console.log(tracks[0])
          const newLocalTracks = { ...localTracks };
          newLocalTracks[tracks[0].kind] = tracks[0];
          setLocalVideoTrack(tracks[0]);
          setLocalTracks(newLocalTracks);
          updateLocalTracksMuted(t.kind, false);
        } else {
          setMuted(true);
          // localVideoTrack.mute();
          localParticipant.unpublishVideoTrack();
          // localParticipant.unpublishTracks([localVideoTrack]);
          // updateLocalTracksMuted(localVideoTrack.kind, true);
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
      <Tooltip
        title={
          !localTracks.video || localTracks.video.muted
            ? "Turn On Camera"
            : "Turn Off Camera"
        }
      >
        <StyledDiv>
          <Button
            size="large"
            disabled={!localTracks.video}
            onClick={() => toggleMuteTrack(localTracks.video)}
          >
            {!localTracks.video || localTracks.video.muted ? (
              <VideocamOffOutlinedIcon />
            ) : (
              <VideocamIcon />
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
            size="large"
            disabled={!localTracks.audio || !isEnableToUnmute}
            onClick={() => toggleMuteTrack(localTracks.audio)}
          >
            {!localTracks.audio ||
            localTracks.audio.muted ||
            !isEnableToUnmute ? (
              <MicOffOutlinedIcon color={isEnableToUnmute ? "" : "error"} />
            ) : (
              <MicIcon />
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
              size="large"
              hover="onHoverTest"
              onClick={() => shareScreen()}
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
              size="large"
              hover="onHoverTest"
              onClick={() => blockMuteAllParticipants()}
            >
              {!isBlockedRemotedGuest ? <HeadsetOffIcon /> : <HeadsetMicIcon />}
            </Button>
          </StyledDiv>
        </Tooltip>
      )}

      <Tooltip title="Leave room">
        <StyledDiv>
          <Button size="large" color="error" onClick={endCall}>
            <CancelIcon />
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

export default RoomControls;
