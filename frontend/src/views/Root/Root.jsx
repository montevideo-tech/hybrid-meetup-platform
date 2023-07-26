import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";

function Root() {
  return (
    <RootContainer>
      <Outlet />
    </RootContainer>
  );
}

const RootContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
`;

export default Root;
