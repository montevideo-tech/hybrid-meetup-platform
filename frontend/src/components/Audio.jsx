import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

function Audio(props) {
  const audioref = useRef();

  const {
    stream,
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

  // eslint-disable-next-line jsx-a11y/media-has-caption
  return <audio ref={audioref} autoPlay />;
}

Audio.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  stream: PropTypes.object,
  // isStreamLocal: PropTypes.bool,
  // isAudioMuted: PropTypes.bool,
  // isVideoMuted: PropTypes.bool,
  // isSpeaking: PropTypes.bool,
  // size: PropTypes.number,
  // name: PropTypes.string,
};

Audio.defaultProps = {
  stream: undefined,
  // isStreamLocal: false,
  // isAudioMuted: false,
  // isVideoMuted: false,
  // isSpeaking: false,
  // size: 100,
  // name: '',
};

export default Audio;
