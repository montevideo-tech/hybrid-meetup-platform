import { useState } from "react";
import styled from "styled-components";
import Menu from "@mui/material/Menu";
import { Button } from "../themes/componentsStyles";
import { Colors } from "../themes/colors";
import arrow from "../assets/arrow.svg";

export function DropdownMenu(props) {
  const { label, iconWidth, children, buttonStyles } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <StyledButton
        onClick={handleMenu}
        aria-controls="menu-appbar"
        aria-haspopup="true"
        $customStyles={buttonStyles}
      >
        {label}
        <img alt="arrow" width={iconWidth} src={arrow} />
      </StyledButton>
      <StyledMenu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {children}
      </StyledMenu>
    </>
  );
}

const StyledButton = styled(Button)`
  display: grid;
  grid-template-columns: repeat(2, auto);
  column-gap: 5px;
  color: ${Colors.davyGray};
  text-transform: capitalize;
  :hover {
    opacity: 100%;
  }
`;

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
