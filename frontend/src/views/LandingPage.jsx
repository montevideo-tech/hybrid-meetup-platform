import React from "react";
import styled from "styled-components";
import { Colors } from "../themes/colors";
import meeting from "../assets/meeting.png";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

function LandingPage() {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <Container>
        <Headline>
          <Title>
            <TitleParts $fontStyle="normal" $color={Colors.davyGray}>
              A hybrid event platform with
            </TitleParts>
            <TitleParts
              $fontStyle="italic"
              $color={Colors.purple}
              $marginLeft="10px"
            >
              adaptable WebRTC providers
            </TitleParts>
          </Title>
          <StyledButton onClick={() => navigate("/signIn")}>
            Check available rooms
          </StyledButton>
        </Headline>
        <Image src={meeting} alt="hybridly meeting" />
      </Container>
    </>
  );
}

export default LandingPage;

const Container = styled.div`
  padding: 70px;
  height: 100%;
  display: grid;
  grid-template-areas: "headline img";
  column-gap: 21px;
  @media (max-width: 1025px) {
    grid-template-areas:
      "headline"
      "img";
    padding: 50px;
  }
`;

const Headline = styled.div`
  grid-area: headline;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (max-width: 1025px) {
    align-items: center;
    text-align: center;
  }
`;

const Title = styled.h1`
  margin: 0 0 23px 0;
  padding: 0;
  font-size: 3rem;
  font-weight: 600;
  line-height: 60px;
  @media (max-width: 1025px) {
    font-size: 2rem;
    line-height: 40px;
  }
`;

const TitleParts = styled.span`
  font-style: ${({ $fontStyle }) => $fontStyle};
  color: ${({ $color }) => $color};
  margin-left: ${({ $marginLeft }) => $marginLeft};
`;

const Image = styled.img`
  grid-area: img;
  width: 539.25px;
  height: 382.22px;
  align-self: center;
  @media (max-width: 1025px) {
    justify-self: center;
    width: 429.25px;
    height: 272.22px;
    margin-top: 20px;
  }
`;

const StyledButton = styled.button`
  cursor: pointer;
  width: 14.5rem;
  height: 2.813rem;
  color: ${Colors.purple};
  background-color: ${Colors.lightPurple};
  font-weight: 500;
  font-size: 1rem;
  border: 2px solid ${Colors.purple};
  border-radius: 35px;
  @media (max-width: 1025px) {
    width: 11.165rem;
    height: 2.166rem;
    font-size: 0.8rem;
  }
`;
