import React from "react";
import styled from "styled-components";
import { MenuItem } from "@mui/material";
import { Button } from "../themes/componentsStyles";
import Menu from "@mui/material/Menu";
import { Colors } from "../themes/colors";
import line from "../assets/line.svg";

export function DropdownMenu(props) {
  const {
    handleSignOut,
    handleClose,
    anchorEl,
    currentUser,
    buttonStyles,
    anchorOrigin,
    transformOrigin,
  } = props;

  return (
    <StyledMenu
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={anchorOrigin}
      keepMounted
      transformOrigin={transformOrigin}
      open={Boolean(anchorEl)}
      onClose={handleClose}
  >
    <EmailContainer>
      <span>{currentUser.email}</span>
      <img alt="line" src={line} />
    </EmailContainer>
    <MenuItem>
      <Button
        onClick={handleSignOut}
        $primary
        $customStyles={buttonStyles}
      >
        Log out
      </Button>
    </MenuItem>
  </StyledMenu>
  )
}

const StyledMenu = styled(Menu)`
  .MuiPopover-paper {
    background-color: ${Colors.lightPurple};
    border-radius: 15px;
  }
  .MuiMenu-list {
    padding: 0;
  }
  .MuiMenuItem-root {
    padding: 6px 14px 12px 14px;
    :hover {
      background-color: transparent;
    }
  }
`;

const EmailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 14px 0 14px;
  img {
    width: 100%;
    height: 2px;
    object-fit: cover;
  }
  span {
    color: ${Colors.blackPurple};
    font-weight: 500;
    font-size: 0.8rem;
    line-height: 0.938rem;
    margin-bottom: 6px;
  }
`;