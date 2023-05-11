import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

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
  display: flex;
  flex-direction: column;
`;

export default Root;
