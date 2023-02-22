/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import { ButtonGroup, Button } from '@mui/material';
import {
  Videocam as VideocamIcon,
  VideocamOffOutlined as VideocamOffOutlinedIcon,
  Mic as MicIcon,
  MicOffOutlined as MicOffOutlinedIcon,
  Cancel as CancelIcon,
  ScreenShare as ScreenShareIcon,
  StopScreenShare as StopScreenShareIcon,
} from '@mui/icons-material';

function RoomControls(props) {
  const navigate = useNavigate();

  const {
    updateScreen, isSharingScreen, localTracks, updateLocalTracksMuted, leaveRoom, disabled,
  } = props;

  const toggleMuteTrack = (t) => {
    if (t.muted) {
      t.unmute();
      updateLocalTracksMuted(t.kind, false);
    } else {
      t.mute();
      updateLocalTracksMuted(t.kind, true);
    }
  };

  const endCall = () => {
    leaveRoom();
    navigate('/rooms');
  };

  const shareScreen = async () => {
    console.log('issharing:', isSharingScreen);
    updateScreen(isSharingScreen);
  };

  return (
    <ButtonGroup
      variant="contained"
      size="large"
      disabled={disabled}
      sx={{
        position: 'fixed', bottom: 0, left: 'calc(50% - 103px)',
      }}
    >
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
      <Button
        size="large"
        disabled={!localTracks.audio}
        onClick={() => toggleMuteTrack(localTracks.audio)}
      >
        {!localTracks.audio || localTracks.audio.muted ? (
          <MicOffOutlinedIcon />
        ) : (
          <MicIcon />
        )}
      </Button>

      {/* <Button
        size="large"
        onClick={startSharingScreen}
      >
        <ScreenShareIcon />
      </Button>
      <Button
        size="large"
        onClick={stopSharingScreen}
      >
        <StopScreenShareIcon />
      </Button> */}

      <Button
        size="large"
        onClick={() => shareScreen()}
      >
        {!isSharingScreen ? (
          <ScreenShareIcon />
        ) : (
          <StopScreenShareIcon />
        )}
      </Button>

      <Button
        size="large"
        color="error"
        onClick={endCall}
      >
        <CancelIcon />
      </Button>
    </ButtonGroup>
  );
}

RoomControls.propTypes = {
  localTracks: PropTypes.object,
  updateScreen: PropTypes.func.isRequired,
  updateLocalTracksMuted: PropTypes.func.isRequired,
  leaveRoom: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  isSharingScreen: PropTypes.bool,
};

RoomControls.defaultProps = {
  localTracks: { audio: null, video: null },
  disabled: true,
  isSharingScreen: false,

};

export default RoomControls;
