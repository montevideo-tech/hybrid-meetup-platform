import React, { ReactNode } from 'react';
import PropTypes from 'prop-types';
import Video from './Video';

function ShareScreen(props) {
  const {
    children,
    width,
  } = props;

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <Video
        style={{
          height: '100%', maxWidth: '100%', width, margin: '0px auto'
        }}
        stream={children.videoStream}
        width={width}

      />
    </div>
  );
}

ShareScreen.propTypes = {
  children: ReactNode,
  width: PropTypes.string,

};

ShareScreen.defaultProps = {
  children: [],
  width: '500px',
};

export default ShareScreen;
