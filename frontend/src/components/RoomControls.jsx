import React from 'react';
import PropTypes from 'prop-types';

import { ButtonGroup, Button } from '@mui/material';
import {
  Videocam as VideocamIcon,
  VideocamOffOutlined as VideocamOffOutlinedIcon,
  Mic as MicIcon,
  MicOffOutlined as MicOffOutlinedIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

function RoomControls(props) {
  const {
    localTracks, updateLocalTracksMuted, leaveRoom, disabled,
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
      <Button
        size="large"
        color="error"
        onClick={leaveRoom}
      >
        <CancelIcon />
      </Button>
    </ButtonGroup>
  );
}

RoomControls.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  localTracks: PropTypes.object,
  updateLocalTracksMuted: PropTypes.func.isRequired,
  leaveRoom: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

RoomControls.defaultProps = {
  localTracks: { audio: null, video: null },
  disabled: true,
};

export default RoomControls;
