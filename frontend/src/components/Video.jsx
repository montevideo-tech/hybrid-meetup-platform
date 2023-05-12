import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
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
    width,
    height,
    onClick,
    onClickMute,
    style,
    permissionRole,
  } = props;
  // const [isPinned, setIsPinned] = useState(false);

  // const handlePinClick = () => {
  // setIsPinned(!isPinned); // Cambiar el valor de la variable de estado al hacer clic en el icono
  // };

  useEffect(() => {
    if (!stream) {
      return;
    }

    if (videoRef.current && videoRef.current.srcObject !== stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const outlineWidth = 3;

  return (
    <Box
      sx={{
        position: "relative",
        width: `${width - outlineWidth * 2}px`,
        height: `${height - outlineWidth * 2}px`,
        minWidth: "160px",
        minHeight: "90px",
        background: "rgb(60,64,67)",
        borderRadius: "5px",
        overflow: "hidden",
        border: `${isSpeaking ? "5px solid red" : {}}`,
        ...style,
      }}
    >
      {isVideoMuted && (
        <img
          src={logo}
          alt="Montevideo Tech Summer Camp logo"
          style={{
            width: `${size}%`,
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      )}
      <video
        autoPlay
        ref={videoRef}
        style={{ width: `${size}%` }}
        muted={isStreamLocal}
      >
        <track kind="captions" />
      </video>
      {name && <ParticipantInfo name={name} parentHeight={height} />}
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
            bgcolor: "rgba(0, 0, 0, 0.2)",
            border: "2px solid",
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
            bgcolor: "rgba(0, 0, 0, 0.2)",
            border: "2px solid",
          }}
        >
          <DeleteOutlineIcon sx={{ ml: "2px" }} />
        </IconButton>
      )}

      {/* <IconButton
        onClick={handlePinClick}
        sx={{
          position: 'absolute',
          bottom: 10,
          left: 10,
          color: {Colors.white},
          bgcolor: 'rgba(0, 0, 0, 0.2)',
          border: '2px solid',
          fontSize: `${size * 2}%`,
        }}
      >
        {isPinned
          ? <PushPinRoundedIcon sx={{ ml: '2px' }} /> : <PushPinOutlinedIcon sx={{ ml: '2px' }} />}
      </IconButton> */}
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
  width: PropTypes.number,
  height: PropTypes.number,
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
  width: 160,
  height: 90,
  onClick: () => {},
  onClickMute: () => {},
  style: {},
  permissionRole: ROLES.GUEST,
};

export default Video;
