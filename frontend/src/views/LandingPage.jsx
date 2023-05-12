import React from "react";
import styled from "styled-components";
import { Button, Typography } from "@mui/material";
import { Colors } from "../themes/colors";
import meeting from "../assets/meeting.png";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  background-color: ${Colors.lightPurple};
  padding: 50px;
  display: grid;
  height: 100%;
  grid-template-areas:
    "headline description"
    "img description"
    "img description"
    "img button";
  grid-template-rows: 1fr 3fr 1fr;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
`;

const Headline = styled.div`
  grid-area: headline;
  background-color: ${Colors.white};
  padding: 10px;
  border-radius: 4px;
`;

const Image = styled.img`
  grid-area: img;
  width: 100%;
  height: 100%;
  object-fit: contain;
  align-self: end;
`;

const Description = styled.div`
  grid-area: description;
  background-color: ${Colors.white};
  padding: 10px;
  border-radius: 4px;
`;

const GetStartedButton = styled(Button)`
  grid-area: button;
  justify-self: center;
  width: 180px;
  height: 50px;
`;

function LandingPage() {
  const navigate = useNavigate();
  return (
    <Container>
      <Headline>
        <Typography variant="h6">
          A hybrid event platform with adaptable WebRTC providers.
        </Typography>
      </Headline>
      <Description>
        <Typography variant="body1">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Typography>
      </Description>
      <Image src={meeting} alt="hybrid meeting" />
      <GetStartedButton variant="contained" onClick={() => navigate("/signIn")}>
        Get started
      </GetStartedButton>
    </Container>
  );
}

export default LandingPage;
