import styled, { css } from "styled-components";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { TextField } from "@mui/material";
import { Colors } from "./colors";

export const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  "&:disabled": {
    backgroundColor: theme.palette.grey[400],
  },
  textDecoration: "none",
  " &:hover": {
    textDecoration: "underline",
  },
}));

export const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.palette.secondary.main};
`;

export const StyledHeader = styled(Typography)`
  font-weight: bold;
  text-align: center;
`;

export const StyledAvatar = styled(Avatar)`
  background-color: ${({ theme }) => theme.palette.secondary.main};
`;

export const formVariants = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  exit: { opacity: 0, y: -100, transition: { duration: 0.7 } },
};

// Chat Styles
export const ChatContainer = styled.div`
  position: fixed;
  z-index: 100;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: width 0.3s ease;
  border: 1px solid ${Colors.white};
  background-color: ${Colors.white};
  border-radius: 35px;
  padding: 10px;
  width: ${(props) => (props.chatOpen ? "350px" : "40px")};
  height: ${(props) => (props.chatOpen ? "88vh" : props.chatHeight)};

  & > .icons-wrapper {
    position: absolute;
    bottom: 2px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  & > .icons-wrapper > .icon {
    width: 40px;
    height: 40px;
    background-color: ${Colors.white};
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    transition: left 0.3s ease;
  }
`;

export const ChatForm = styled.form`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

export const ChatInput = styled(TextField)`
  flex: 4;
  overflow-y: auto;
`;

export const ChatButton = styled(Button)`
  flex: 1;
  margin-left: 15px;
`;

export const ChatContent = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  transition: opacity 0.3s ease;
`;

export const ChatContentWrapper = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  transition: opacity 0.3s ease;

  ${(props) =>
    props.hidden &&
    css`
      opacity: 0;
      height: 0;
      visibility: hidden;
    `};

  ${(props) =>
    !props.hidden &&
    css`
      text-align: left;
    `};
`;
