/* eslint-disable react/jsx-props-no-spreading */
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

function Video(props) {
  const videoRef = useRef();

  const {
    stream, muted, size,
  } = props;

  useEffect(() => {
    if (
      videoRef.current
      && videoRef.current.srcObject !== stream
    ) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      autoPlay
      ref={videoRef}
      style={{ width: `${size}%` }}
      muted={muted}
    >
      <track kind="captions" {...props} />
    </video>
  );
}

Video.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  stream: PropTypes.object,
  muted: PropTypes.bool,
  size: PropTypes.number,
};

Video.defaultProps = {
  stream: undefined,
  muted: false,
  size: 100,
};

export default Video;
