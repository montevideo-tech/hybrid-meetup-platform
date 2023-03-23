import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  IconButton,
} from '@mui/material';
import {
  MicOffOutlined as MicOffOutlinedIcon,
} from '@mui/icons-material';
import ParticipantInfo from './ParticipantInfo';
import logo from '../assets/MVDTSC.png';

function Video(props) {
  const videoRef = useRef();
  const {
    // eslint-disable-next-line no-unused-vars
    stream, isStreamLocal, isAudioMuted, isVideoMuted, isSpeaking, size, name, width, height,
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

  const outlineWidth = 3;

  return (
    <Box sx={{
      position: 'relative',
      width: `${width - outlineWidth * 2}px`,
      height: `${height - outlineWidth * 2}px`,
      minWidth: '160px',
      minHeight: '90px',
      background: 'rgb(60,64,67)',
      borderRadius: '5px',
      overflow: 'hidden',
    }}
    >
      {isVideoMuted && (
        <img
          src={logo}
          alt="Montevideo Tech Summer Camp logo"
          style={{
            width: `${size}%`,
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      )}
      <video
        autoPlay
        ref={videoRef}
        style={{ width: `${size}%` }}
        muted={isStreamLocal}
      >
        <track kind="captions" />
      </video>
      {name && (
      <ParticipantInfo name={name} parentHeight={height} />
      )}
      {isAudioMuted && (
        <IconButton
          disableRipple
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            color: 'white',
            bgcolor: 'rgba(0, 0, 0, 0.2)',
            border: '2px solid',
          }}
        >
          <MicOffOutlinedIcon sx={{ ml: '2px' }} />
        </IconButton>
      )}
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
  width: PropTypes.number,
  height: PropTypes.number,
  name: PropTypes.string,
};

Video.defaultProps = {
  stream: undefined,
  isStreamLocal: false,
  isAudioMuted: false,
  isVideoMuted: false,
  isSpeaking: false,
  size: 100,
  name: '',
  width: 160,
  height: 90,
};

export default Video;
