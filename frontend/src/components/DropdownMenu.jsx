import { useState } from "react";
import styled from "styled-components";
import Menu from "@mui/material/Menu";
import { Colors } from "../themes/colors";
import arrow from "../assets/arrow.svg";
import Button from "../components/Button";
import Icon from "../components/Icon";

function DropdownMenu(props) {
  const { label, labelStyles, iconWidth, children, buttonStyles } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Button
        onClick={handleMenu}
        aria-controls="menu-appbar"
        aria-haspopup="true"
        secondary
        hoverStyles="opacity: 100%"
        customStyles={
          ({
            display: "grid",
            gridTemplateColumns: "repeat(2, auto)",
            columnGap: "5px",
            color: Colors.davyGray,
            textTransform: "capitalize",
          },
          { ...buttonStyles })
        }
      >
        <StyledSpan $labelStyles={labelStyles}>{label}</StyledSpan>
        <Icon icon={arrow} name="open" width={iconWidth} />
      </Button>
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

export default DropdownMenu;

const StyledSpan = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ $labelStyles }) => $labelStyles}
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
