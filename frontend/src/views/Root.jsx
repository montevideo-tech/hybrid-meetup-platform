import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import "@fontsource/poppins/400.css"; // weight 400
import "@fontsource/poppins/500.css"; // weight 500
import "@fontsource/poppins/600.css"; // weight 600
import "@fontsource/poppins/700.css"; // weight 700
import "@fontsource/poppins/800.css"; // weight 800

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
