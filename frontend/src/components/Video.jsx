/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

function Video(props) {
  const videoRef = useRef();

  const {
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
    <>
      {isAudioMuted && (
        <p>audio muted</p>
      )}
      <video
        autoPlay
        ref={videoRef}
        style={{ width: `${size}%` }}
        muted={isStreamLocal}
      >
        <track kind="captions" />
      </video>
    </>
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
