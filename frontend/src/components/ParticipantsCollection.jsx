import React, {
  useCallback, useMemo, useState, ReactNode,
} from 'react';
import PropTypes from 'prop-types';
import { Box, IconButton } from '@mui/material';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';
import { MAX_PARTICIPANTS_PER_PAGE } from '../lib/constants';
import Audio from './Audio';
import Video from './Video';
import ParticipantLayout from './ParticipantLayout';

function ParticipantsCollection(props) {
  const {
    width, height, participantsPerPage, participantsCount, gap, children,
  } = props;

  const [currentPage, setCurrentPage] = useState(1);

  const numberPages = useMemo(() => {
    if (participantsCount >= participantsPerPage) {
      return Math.ceil(participantsCount / participantsPerPage);
    }
    return 1;
  }, [participantsCount, participantsPerPage]);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((page) => page - 1);
    }
  }, [currentPage]);

  const currentParticipants = useMemo(() => {
    const startIndex = (currentPage - 1) * participantsPerPage;
    let endIndex = startIndex + participantsPerPage;
    if (endIndex > participantsCount) {
      endIndex = participantsCount;
    }
    const pageParticipants = children.slice(startIndex, endIndex);
    if (pageParticipants.length === 0 && currentPage > 1) {
      goToPreviousPage();
    }
    return pageParticipants;
  }, [currentPage, participantsPerPage, participantsCount, children, goToPreviousPage]);

  const goToNextPage = () => {
    if (currentPage < numberPages) {
      setCurrentPage((page) => page + 1);
    }
  };

  const widthBetweenPagination = numberPages === 1 ? width : width - 80;

  return (
    <Box style={{
      display: 'flex',
      backgroundColor: 'rgb(32,33,36)',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '100%',
    }}
    >
      <Box style={{
        width: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '12px',
      }}
      >
        <IconButton
          disableRipple
          onClick={goToPreviousPage}
          opacity={numberPages === 1 ? 0 : 1}
          sx={
            currentPage === 1 ? { display: 'none' } : {
              color: 'white',
              border: '2px solid',
              borderColor: '#666666',
              bgcolor: '383838',
              variant: 'outline',
              zIndex: '2',
            }
          }
        >
          <ChevronLeftIcon />
        </IconButton>
      </Box>

      <Box style={{ width: { width }, zIndex: '100' }}>
        {children.map(({
          audioStream, name,
        }) => (
          <Audio
            key={name}
            stream={audioStream}
          />
        ))}
        <ParticipantLayout
          width={widthBetweenPagination}
          height={height}
          gap={gap - 6}
        >
          {currentParticipants.map(({
            videoStream, name, audioMuted, videoMuted, speaking
          }) => (
            <Video
              key={name}
              stream={videoStream}
              isAudioMuted={audioMuted || false}
              isVideoMuted={videoMuted || false}
              isSpeaking={speaking || false}
              name={name}
            />
          ))}
        </ParticipantLayout>
      </Box>
      <Box style={{
        width: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '12px',
      }}
      >
        <IconButton
          disableRipple
          onClick={goToNextPage}
          opacity={numberPages === 1 ? 0 : 1}
          sx={
            currentPage === numberPages ? { display: 'none' } : {
              color: 'white',
              border: '2px solid',
              borderColor: '#666666',
              bgcolor: '383838',
              variant: 'outline',
              zIndex: '2',
            }
          }
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

ParticipantsCollection.propTypes = {
  children: ReactNode,
  width: PropTypes.number,
  height: PropTypes.number,
  gap: PropTypes.number,
  participantsPerPage: PropTypes.number,
  participantsCount: PropTypes.number,

};

ParticipantsCollection.defaultProps = {
  children: [],
  width: 886,
  height: 609,
  gap: 10,
  participantsPerPage: MAX_PARTICIPANTS_PER_PAGE,
  participantsCount: 1,
};

export default ParticipantsCollection;