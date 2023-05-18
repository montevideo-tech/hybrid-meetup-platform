import React, { useCallback, useMemo, useState, ReactNode } from "react";
import { LocalParticipant } from "@mux/spaces-web";
import PropTypes from "prop-types";
import { Box, IconButton } from "@mui/material";
import ChevronLeftIcon from "./icons/ChevronLeftIcon";
import ChevronRightIcon from "./icons/ChevronRightIcon";
import { MAX_PARTICIPANTS_PER_PAGE } from "../lib/constants";
import Audio from "./Audio";
import Video from "./Video";
import ParticipantLayout from "./ParticipantLayout";
import { ROLES } from "../utils/roles";
import { Colors } from "../themes/colors";
import styled from "styled-components";

function ParticipantsCollection(props) {
  const {
    width,
    height,
    participantsPerPage,
    participantsCount,
    gap,
    children,
    localParticipant,
    permissionRole,
  } = props;

  const [currentPage, setCurrentPage] = useState(1);
  // const [selectedParticipant, setSelectedParticipant] = useState(null);

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
  }, [
    currentPage,
    participantsPerPage,
    participantsCount,
    children,
    goToPreviousPage,
  ]);

  const goToNextPage = () => {
    if (currentPage < numberPages) {
      setCurrentPage((page) => page + 1);
    }
  };

  const widthBetweenPagination = numberPages === 1 ? width : width - 80;

  const onClickRemove = (r) => {
    localParticipant.removeRemoteParticipant(r);
  };

  const onClickMute = (r, isMuted) => {
    localParticipant.blockMuteRemoteParticipant(r, isMuted);
  };

  // const handleParticipantSelection = (participant) => {
  //   setSelectedParticipant(participant);
  // };

  // const selectedParticipantStyle = {
  //   border: '2px solid blue',
  //   transform: 'scale(1.5)',
  // };

  // const normalParticipantStyle = {
  //   border: 'none',
  //   transform: 'none',
  // };

  return (
    <StyledBox $box1>
      <StyledBox $box2>
        <IconButton
          disableRipple
          onClick={goToPreviousPage}
          opacity={numberPages === 1 ? 0 : 1}
          sx={
            currentPage === 1
              ? { display: "none" }
              : {
                  color: Colors.white,
                  border: "2px solid",
                  borderColor: Colors.gray,
                  bgcolor: Colors.darkGray,
                  variant: "outline",
                  zIndex: "2",
                }
          }
        >
          <ChevronLeftIcon />
        </IconButton>
      </StyledBox>

      <StyledBox $box3 $width={`${width}px`}>
        {children.map(({ audioStream, name }) => (
          <Audio key={name} stream={audioStream} />
        ))}
        <ParticipantLayout
          width={widthBetweenPagination}
          height={height}
          gap={gap}
        >
          {currentParticipants.map(
            ({ videoStream, name, audioMuted, videoMuted, speaking }) => (
              <Video
                permissionRole={permissionRole}
                key={name}
                stream={videoStream}
                isAudioMuted={audioMuted || false}
                isVideoMuted={videoMuted || false}
                isSpeaking={speaking || false}
                name={name}
                onClick={() => onClickRemove(name)}
                onClickMute={() => onClickMute(name, audioMuted)}
                // style={selectedParticipant === name
                //   ? selectedParticipantStyle : normalParticipantStyle}
                // onClick={() => handleParticipantSelection(name)}
              />
            ),
          )}
        </ParticipantLayout>
      </StyledBox>
      <StyledBox $box4>
        <IconButton
          disableRipple
          onClick={goToNextPage}
          opacity={numberPages === 1 ? 0 : 1}
          sx={
            currentPage === numberPages
              ? { display: "none" }
              : {
                  color: Colors.white,
                  border: "2px solid",
                  borderColor: Colors.gray,
                  bgcolor: Colors.darkGray,
                  variant: "outline",
                  zIndex: "2",
                }
          }
        >
          <ChevronRightIcon />
        </IconButton>
      </StyledBox>
    </StyledBox>
  );
}

ParticipantsCollection.propTypes = {
  children: ReactNode,
  width: PropTypes.number,
  height: PropTypes.number,
  gap: PropTypes.number,
  participantsPerPage: PropTypes.number,
  participantsCount: PropTypes.number,
  localParticipant: LocalParticipant,
  permissionRole: PropTypes.string,
  isEnableToUnmute: PropTypes.bool,
};

ParticipantsCollection.defaultProps = {
  children: [],
  width: 886,
  height: 609,
  gap: 10,
  participantsPerPage: MAX_PARTICIPANTS_PER_PAGE,
  participantsCount: 1,
  localParticipant: null,
  permissionRole: ROLES.GUEST,
  isEnableToUnmute: true,
};

export default ParticipantsCollection;

const StyledBox = styled(Box)`
  ${({ $box1, $box2, $box3, $box4, $width }) =>
    $box1
      ? `
        display: flex;
        background-color: rgb(32,33,36);
        align-items: center;
        justify-content: space-between;
        height: 100%;`
      : $box2
      ? `
          width: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 12px;
        `
      : $box3
      ? `
        width: ${$width};
        z-index: 100;
      `
      : $box4
      ? `
        width: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 12px;
      `
      : ""}
`;
