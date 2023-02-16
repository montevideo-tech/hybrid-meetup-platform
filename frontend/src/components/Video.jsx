import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Box, IconButton } from '@mui/material';
import {
  MicOffOutlined as MicOffOutlinedIcon,
} from '@mui/icons-material';

function Video(props) {
  const videoRef = useRef();

  const {
    // eslint-disable-next-line no-unused-vars
    stream, isStreamLocal, isAudioMuted, isVideoMuted, isSpeaking, size,
  } = props;

  useEffect(() => {
    if (!stream) {
      return;
    }

    if (
      videoRef.current
      && videoRef.current.srcObject !== stream
    ) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <Box sx={{ position: 'relative' }}>
      {isAudioMuted && (
        <IconButton
          disableRipple
          color="primary"
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            bgcolor: 'rgba(255, 255, 255, 0.4)',
            border: '2px solid',
          }}
        >
          <MicOffOutlinedIcon sx={{ ml: '2px' }} />
        </IconButton>
      )}
      {isVideoMuted && (
        <p>video muted</p>
      )}
      <video
        autoPlay
        ref={videoRef}
        style={{ width: `${size}%` }}
        muted={isStreamLocal}
      >
        <track kind="captions" />
      </video>
    </Box>
  );
}

Video.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  stream: PropTypes.object,
  isStreamLocal: PropTypes.bool,
  isAudioMuted: PropTypes.bool,
  isVideoMuted: PropTypes.bool,
  isSpeaking: PropTypes.bool,
  size: PropTypes.number,
};

Video.defaultProps = {
  stream: undefined,
  isStreamLocal: false,
  isAudioMuted: false,
  isVideoMuted: false,
  isSpeaking: false,
  size: 100,
};

export default Video;
