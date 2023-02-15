/* eslint-disable react/jsx-props-no-spreading */
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

function Video(props) {
  const videoRef = useRef();

  const {
    stream, muted, width, height,
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
    <video
      autoPlay
      ref={videoRef}
      style={{ width, height }}
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
  width: PropTypes.number,
  height: PropTypes.number,
};

Video.defaultProps = {
  stream: undefined,
  muted: false,
  width: 300,
  height: 150,
};

export default Video;
