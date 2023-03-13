import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import {
  MicOffOutlined as MicOffOutlinedIcon,
} from '@mui/icons-material';

import logo from '../assets/MVDTSC.png';

function Audio(props) {
  const audioref = useRef();

  const {
    stream
  } = props;

  useEffect(() => {
    if (!stream) {
      return;
    }

    if (
        audioref.current
      && audioref.current.srcObject !== stream
    ) {
        audioref.current.srcObject = stream;
    }
  }, [stream]);

    return <audio ref={audioref} autoPlay />;
}

Audio.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  stream: PropTypes.object,
  isStreamLocal: PropTypes.bool,
  isAudioMuted: PropTypes.bool,
  isVideoMuted: PropTypes.bool,
  isSpeaking: PropTypes.bool,
  size: PropTypes.number,
  name: PropTypes.string,
};

Audio.defaultProps = {
  stream: undefined,
  isStreamLocal: false,
  isAudioMuted: false,
  isVideoMuted: false,
  isSpeaking: false,
  size: 100,
  name: '',
};

export default Audio;
