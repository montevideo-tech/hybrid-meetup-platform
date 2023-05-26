import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Colors } from "../themes/colors";
import { Box, IconButton } from "@mui/material";
import {
  KeyboardVoiceRounded as KeyboardVoiceRoundedIcon,
  MicOffOutlined as MicOffOutlinedIcon,
  PushPinOutlined as PushPinOutlinedIcon,
  PushPinRounded as PushPinRoundedIcon,
  DeleteRounded as DeleteOutlineIcon,
} from "@mui/icons-material";
import ParticipantInfo from "./ParticipantInfo";
import logo from "../assets/MVDTSC.png";
import { ROLES } from "../utils/roles";

function Video(props) {
  const videoRef = useRef();
  const {
    stream,
    isStreamLocal,
    isAudioMuted,
    isVideoMuted,
    isSpeaking,
    size,
    name,
    onClick,
    onClickMute,
    style,
    permissionRole,
    oddNumber,
    isAlone,
    twoParticipant,
  } = props;

  useEffect(() => {
    if (!stream) {
      return;
    }

    if (videoRef.current && videoRef.current.srcObject !== stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  const boxHeight= isAlone ? "calc((100vh - 164px)" : "calc((100vh - 204px)/2)";

  return (
    <Box
      sx={{
        position: "relative",
        height: boxHeight,
        width: `${twoParticipant ? "60vh" : "100%"}`,
        background: `${Colors.darkGrey}`,
        borderRadius: "5px",
        overflow: "hidden",
        border: `${isSpeaking ? `2px solid ${Colors.red}` : `2px solid ${Colors.black}`}`,
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        gridColumn: `${oddNumber ? "span 2" : ""}`,
        ...style,
      }}
    >
      {isVideoMuted && (
        <StyledImg
          $size={`${size}%`}
          src={logo}
          alt="Montevideo Tech Summer Camp logo"
        />
      )}
      <StyledVideo
        $oddNumber={oddNumber}
        autoPlay
        ref={videoRef}
        $size={`${size}%`}
        muted={isStreamLocal}
      >
        <track kind="captions" />
      </StyledVideo>
      {name && <ParticipantInfo name={name} parentHeight={boxHeight} />}
      {(isAudioMuted || permissionRole === ROLES.HOST) && (
        <IconButton
          disabled={!(permissionRole === ROLES.HOST)}
          onClick={() => onClickMute(name, isAudioMuted)}
          disableRipple
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: `${Colors.white} !important`,
            bgcolor: `${Colors.midnightBlue}`,
            border: "2px solid",
            background: "transparent",
          }}
        >
          {isAudioMuted ? (
            <MicOffOutlinedIcon sx={{ ml: "2px" }} />
          ) : (
            <KeyboardVoiceRoundedIcon sx={{ ml: "2px" }} />
          )}
        </IconButton>
      )}
      {permissionRole === ROLES.HOST && (
        <IconButton
          onClick={() => onClick(name)}
          disableRipple
          sx={{
            position: "absolute",
            top: 10,
            right: 70,
            color: Colors.white,
            bgcolor: `${Colors.midnightBlue}`,
            border: "2px solid",
            background: "transparent",
          }}
        >
          <DeleteOutlineIcon sx={{ ml: "2px" }} />
        </IconButton>
      )}
    </Box>
  );
}

Video.propTypes = {
  stream: PropTypes.object,
  isStreamLocal: PropTypes.bool,
  isAudioMuted: PropTypes.bool,
  isVideoMuted: PropTypes.bool,
  isSpeaking: PropTypes.bool,
  size: PropTypes.number,
  name: PropTypes.string,
  onClick: PropTypes.func,
  onClickMute: PropTypes.func,
  style: PropTypes.shape({}),
  permissionRole: PropTypes.string,
};

Video.defaultProps = {
  stream: undefined,
  isStreamLocal: false,
  isAudioMuted: false,
  isVideoMuted: false,
  isSpeaking: false,
  size: 100,
  name: "",
  onClick: () => {},
  onClickMute: () => {},
  style: {},
  permissionRole: ROLES.GUEST,
};

const StyledImg = styled.img`
  width: ${(props) => props.$size};
  position: absolute;
  top: 0;
  left: 0;
`;

const StyledVideo = styled.video`
  width: ${(props) => (props.$oddNumber ? "60%" : "100%")};
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
`;

export default Video;