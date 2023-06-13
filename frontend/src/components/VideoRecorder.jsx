import React from "react";
import pauseRecord from "../assets/Pause.svg";
import close from "../assets/close.svg";
import styled from "styled-components";
import { Button } from "../themes/componentsStyles";
import videoRecord from "../assets/videoRecord.svg";
import theme from "../themes/theme";
function VideoRecorder({ isRecording, stopRecording }) {
  return (
    <StyledDiv>
      {isRecording && (
        <Div>
          <Button
            $customStyles={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "40px",
              height: "40px",
              marginRight: "4px",
              border: "2px solid red",
            }}
            size="large"
            onClick={stopRecording}
            hover="onHoverTest"
          >
            <img src={videoRecord} alt="Video Record" />
          </Button>
          <Button
            $customStyles={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "40px",
            }}
            size="large"
            onClick={() => {}}
            hover="onHoverTest"
          >
            <img width="30px" src={pauseRecord} alt="Pause" />
            <StyledText>Stop recording</StyledText>
          </Button>
          <StyledTimer>00:00</StyledTimer>
          <Button
            $primary
            $customStyles={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "40px",
              height: "40px",
              marginLeft: "5px",
            }}
            alt="Stop"
            onClick={stopRecording}
          >
            <img src={close} alt="Stop recording" />
          </Button>
        </Div>
      )}
    </StyledDiv>
  );
}
const StyledDiv = styled.div`
  display: flex;
  border-radius: 35px;
  width: 200px;
  height: 50px;
  position: absolute;
  top: 8%;
  right: 20%;
  z-index: 100;
  font-family: "Poppins";
  background-color: ${(props) =>
    props.$primary ? theme.palette.primary.main : theme.palette.secondary.main};
`;

const Div = styled.div`
  padding: 6px;
  display: flex;
  border-radius: 35px;
  font-family: "Poppins";
  background-color: ${(props) =>
    props.$primary ? theme.palette.primary.main : theme.palette.secondary.main};
  align-items: center;
`;

const StyledText = styled.p`
  font-size: 12px;
  line-height: 15px;
  margin-left: 10px;
`;

const StyledTimer = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-left: 8px;
  margin-right: 8px;
`;

export default VideoRecorder;
