import React from "react";
import pauseRecord from "../assets/Pause.svg";
import closePurple from "../assets/closePurple.svg";
import styled from "styled-components";
import { Button } from "../themes/componentsStyles";
import videoRecordRed from "../assets/videoRecordRed.svg";
import theme from "../themes/theme";
import { Colors } from "../themes/colors";

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
              width: "30px",
              height: "30px",
              marginRight: "4px",
              border: "2px solid red",
            }}
            onClick={stopRecording}
          >
            <img
              width="15px"
              height="15px"
              src={videoRecordRed}
              alt="Video Record"
            />
          </Button>
          <Button
            $customStyles={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "30px",
              width: "max-content",
              border: "2px solid rgba(101, 46, 173, 0.18)",
            }}
            onClick={() => {}}
          >
            <img width="18px" height="18px" src={pauseRecord} alt="Pause" />
            <StyledText>Stop recording</StyledText>
          </Button>
          <StyledTimer>00:00</StyledTimer>
          <Button
            $customStyles={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "30px",
              height: "30px",
              marginLeft: "5px",
            }}
            alt="Stop"
            onClick={stopRecording}
          >
            <img
              width="15px"
              height="15px"
              src={closePurple}
              alt="Stop recording"
            />
          </Button>
        </Div>
      )}
    </StyledDiv>
  );
}
const StyledDiv = styled.div`
  display: flex;
  border-radius: 35px;
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
  color: ${Colors.black};
  line-height: 15px;
  margin: 0 0 0 5px;
`;

const StyledTimer = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  margin: 0 8px;
`;

export default VideoRecorder;
