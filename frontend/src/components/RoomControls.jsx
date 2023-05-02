/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import { ButtonGroup, Button, Tooltip } from '@mui/material';
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
    updateScreenShare,
    isSharingScreen,
    localTracks,
    updateLocalTracksMuted,
    leaveRoom,
    disabled,
    permissionRole
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
    updateScreenShare();
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
      <Tooltip title={!localTracks.video || localTracks.video.muted ? 'Turn On Camera' : 'Turn Off Camera'}>
        <div style={{ padding: '2px' }}>
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
        </div>
      </Tooltip>

      <Tooltip title={!localTracks.audio || localTracks.audio.muted ? 'Unmute' : 'Mute'}>
        <div style={{ padding: '2px' }}>
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
        </div>
      </Tooltip>
      {
        (permissionRole === 'PRESENTER' || permissionRole === 'HOST') && (
          <Tooltip title={!isSharingScreen ? 'Share screen' : 'Stop sharing screen'}>
            <div style={{ padding: '2px' }}>
              <Button
                size="large"
                hover="onHoverTest"
                onClick={() => shareScreen()}
              >
                {!isSharingScreen ? (
                  <ScreenShareIcon />
                ) : (
                  <StopScreenShareIcon />
                )}
              </Button>
            </div>
          </Tooltip>
        )
      }

      <Tooltip title="Leave room">
        <div style={{ padding: '2px' }}>
          <Button
            size="large"
            color="error"
            onClick={endCall}
          >
            <CancelIcon />
          </Button>
        </div>
      </Tooltip>

    </ButtonGroup>
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
};

RoomControls.defaultProps = {
  localTracks: { audio: null, video: null },
  disabled: true,
  isSharingScreen: false,
  permissionRole: 'GUEST',
};

export default RoomControls;
