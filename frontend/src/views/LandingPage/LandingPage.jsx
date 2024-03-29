import React from "react";
import styled from "styled-components";
import { Colors } from "../../themes/colors";
import meeting from "../../assets/meeting.png";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

function LandingPage() {
  const navigate = useNavigate();
  return (
    <Container>
      <Headline>
        <Title>
          <TitleParts
            data-test="landing-page-title-parts"
            $fontStyle="normal"
            $color={Colors.davyGray}
          >
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
        <Button
          width="14.5rem"
          height="2.813rem"
          secondary
          onClick={() => navigate("/signIn")}
        >
          Check available rooms
        </Button>
      </Headline>
      <Image src={meeting} alt="hybridly meeting" />
    </Container>
  );
}

export default LandingPage;

const Container = styled.div`
  margin: auto 6%;
  height: 100%;
  display: grid;
  grid-template-areas: "headline img";
  column-gap: 21px;
  @media (min-width: 1025px) {
    grid-template-columns: 1.3fr 1fr;
  }
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
    justify-content: end;
  }
`;

const Title = styled.h1`
  margin: 0 0 23px 0;
  padding: 0;
  font-family: "Poppins";
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
  justify-self: center;
  @media (max-width: 1025px) {
    justify-self: center;
    width: 500px;
    height: 342.97px;
    margin-top: 20px;
  }
`;
