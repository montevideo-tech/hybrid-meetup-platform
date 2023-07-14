import React, { useState } from "react";
import styled from "styled-components";
import { Colors } from "../../themes/colors";
import Button from "../Button";
import CircularProgress from "@mui/material/CircularProgress";

export default function ConfirmationToast(props) {
  const { text, confirmationText, onConfirmation, onCancel } = props;
  const [loading, setLoading] = useState(false);

  const onClick = () => {
    try {
      onConfirmation();
      setLoading(true);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Toast>
        <Text>{text}</Text>
        <ButtonsContainer>
          <Button
            onClick={onClick}
            primary
            customStyles={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              confirmationText
            )}
          </Button>
          <Button secondary onClick={onCancel}>
            Cancel
          </Button>
        </ButtonsContainer>
      </Toast>
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Toast = styled.div`
  opacity: 1;
  position: relative;
  left: calc(50% - 187px);
  top: calc(50% - 137px);
  border: 2px solid ${Colors.purple};
  background: ${Colors.lightPurple};
  border-radius: 30px;
  width: 350px;
  height: 250px;
  padding: 10px;
  display: grid;
  grid-template-rows: 70% 1fr;
  align-items: center;
  justify-items: center;
`;

const Text = styled.div`
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 25px;
  line-height: 38px;
  color: ${Colors.purple};
  text-align: center;
`;
const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;
