import React from "react";
import pauseRecord from "../assets/pause.svg";
import closePurple from "../assets/close-purple.svg";
import styled from "styled-components";
import theme from "../themes/theme";
import { Colors } from "../themes/colors";
import videoRecordRed from "../assets/videoRecordRed.svg";
import Button from "../components/Button";
import Icon from "../components/Icon";

function VideoRecorder({ isRecording, stopRecording }) {
  return (
    <StyledDiv>
      {isRecording && (
        <Div>
          <Button
            onClick={stopRecording}
            width="30px"
            height="30px"
            customStyles={{
              marginRight: "4px",
              border: "2px solid red",
            }}
          >
            <Icon
              icon={videoRecordRed}
              name="video record"
              width="15px"
              height="15px"
            />
          </Button>
          <Button
            width="max-content"
            height="30px"
            customStyles={{
              border: "2px solid rgba(101, 46, 173, 0.18)",
              padding: "5px",
            }}
          >
            <Icon
              icon={pauseRecord}
              name="pause recording"
              width="18px"
              height="18px"
            />
            <StyledText>Stop recording</StyledText>
          </Button>
          <StyledTimer>00:00</StyledTimer>
          <Button
            onClick={stopRecording}
            width="30px"
            height="30px"
            customStyles={{
              border: `2px solid ${Colors.purple}`,
              marginLeft: "5px",
            }}
          >
            <Icon
              icon={closePurple}
              name="stop recording"
              width="15px"
              height="15px"
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
