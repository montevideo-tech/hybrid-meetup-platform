import React from 'react';
import PropTypes from 'prop-types';
import {
  Box, Tooltip, Typography, IconButton
} from '@mui/material';
import { ExitToApp as ExitToAppIcon } from '@mui/icons-material';

function ParticipantInfo(props) {
  const {
    name, parentHeight, isAdmin, setParticipantKick
  } = props;

  let height = '30px';
  let fontSize = '14px';
  if (parentHeight <= 200) {
    height = '20px';
    fontSize = '10px';
  }
  if (parentHeight <= 90) {
    height = '15px';
    fontSize = '10px';
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        bgcolor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0px 6px',
        boxSizing: 'border-box',
        height: { height }
      }}
    >
      <Typography
        variant="h6"
        fontWeight="700"
        fontSize={fontSize}
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {name}
      </Typography>

      {isAdmin && (
      <Tooltip title="Remove participant from the call">
        <IconButton
          onClick={() => { setParticipantKick(name); }}
          sx={{
            color: 'white',
          }}
        >
          <ExitToAppIcon />
        </IconButton>
      </Tooltip>
      )}
    </Box>
  );
}

ParticipantInfo.propTypes = {
  name: PropTypes.string,
  parentHeight: PropTypes.number,
  isAdmin: PropTypes.bool,
  setParticipantKick: PropTypes.string,
};

ParticipantInfo.defaultProps = {
  name: '',
  parentHeight: 40,
  isAdmin: false,
  setParticipantKick: '',
};

export default ParticipantInfo;
