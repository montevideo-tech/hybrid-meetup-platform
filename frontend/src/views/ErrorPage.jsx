import React from "react";
import { useRouteError, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import styled from "styled-components";

function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <ErrorPageContainer>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
      <Button onClick={() => navigate("/")}>Back to home</Button>
    </ErrorPageContainer>
  );
}

const ErrorPageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default ErrorPage;
