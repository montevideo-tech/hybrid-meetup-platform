import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Colors } from "../themes/colors";
import { Box } from "@mui/material";
import ParticipantInfo from "./ParticipantInfo";
import logo from "../assets/MVDTSC.png";
import { ROLES } from "../utils/supabaseSDK/roles";
import Button from "../components/Button";
import mic from "../assets/mic.svg";
import noMic from "../assets/no-mic.svg";
import deletePurple from "../assets/delete-purple.svg";
import Icon from "../components/Icon";
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
    isSharingScreen,
    isScreenShared,
  } = props;

  useEffect(() => {
    if (!stream) {
      return;
    }

    if (videoRef.current && videoRef.current.srcObject !== stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  const boxHeight = isSharingScreen
    ? "150px"
    : isAlone
    ? "calc((100vh - 170px))"
    : "calc((100vh - 204px)/2)";
  const boxWidth = isScreenShared
    ? "auto"
    : isSharingScreen
    ? "200px"
    : twoParticipant
    ? "60vh"
    : "100%";

  return (
    <Box
      sx={{
        position: "relative",
        height: boxHeight,
        width: boxWidth,
        background: `${Colors.darkGrey}`,
        borderRadius: "5px",
        overflow: "hidden",
        border: `${
          isSpeaking ? `2px solid ${Colors.red}` : `2px solid ${Colors.black}`
        }`,
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
      {permissionRole === ROLES.HOST && (
        <Button
          onClick={() => onClick(name)}
          width="40px"
          height="40px"
          customStyles={{
            position: "absolute",
            top: 10,
            right: 70,
            border: `2px solid ${Colors.lightPurple}`,
          }}
        >
          <Icon
            icon={deletePurple}
            name="remove participant"
            width="18px"
            height="18px"
          />
        </Button>
      )}
      {(isAudioMuted || permissionRole === ROLES.HOST) && (
        <Button
          onClick={() => onClickMute(name, isAudioMuted)}
          disabled={permissionRole !== ROLES.HOST}
          width="40px"
          height="40px"
          customStyles={{
            position: "absolute",
            top: "10px",
            right: "10px",
            border: `2px solid ${Colors.lightPurple}`,
          }}
          onDisabled={
            (`border: 2px solid ${Colors.lightPurple}`,
            "backgroundColor: transparent",
            "cursor: auto")
          }
        >
          {isAudioMuted ? (
            <Icon icon={noMic} name="disable microphone" />
          ) : (
            <Icon icon={mic} name="microphone" />
          )}
        </Button>
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

export default Video;

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
