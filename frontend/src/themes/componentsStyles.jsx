import styled from "styled-components";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import theme from "./theme";

export const Button = styled.button`
  cursor: pointer;
  width: 136px;
  height: 35px;
  border-radius: 35px;
  font-family: "Poppins";
  font-weight: 500;
  transition: 0.4s;
  background-color: ${(props) =>
    props.$primary ? theme.palette.primary.main : theme.palette.secondary.main};
  color: ${(props) =>
    props.$primary ? theme.palette.common.white : theme.palette.primary.main};
  border: ${(props) =>
    props.$primary ? "none" : `2px solid ${theme.palette.primary.main}`};
  font-size: ${(props) => (props.$primary ? "0.875rem" : "1rem")};
  line-height: ${(props) => (props.$primary ? "21px" : "24px")};

  ${(props) =>
    props.$customStyles} // these styles override all the above ones, leave them here
  &:hover {
    background-color: ${(props) =>
      props.$primary
        ? theme.palette.primary.dark
        : theme.palette.secondary.main};
  }
  &:disabled {
    background-color: ${theme.palette.disabled.main};
  }
`;

export const Card = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 320px;
  background-color: ${theme.palette.secondary.main};
  border: 2px solid ${theme.palette.primary.main};
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.1);
  border-radius: 30px;
  padding: 30px;

  ${(props) =>
    props.$customStyles}// these styles override all the above ones, leave them here
`;

export const Input = styled.input`
  width: calc(100% - 50px);
  height: 35px;
  border: 1.98px solid ${theme.palette.primary.main};
  border-radius: 34px;
  background-color: ${theme.palette.secondary.main};
  color: ${theme.palette.fonts.main};
  font-family: "Poppins";
  font-weight: 500;
  font-size: 1rem;
  line-height: 23px;
  padding-right: 30px;
  ::placeholder {
    color: ${theme.palette.disabled.secondary};
    opacity: 50%;
  }

  ${(props) =>
    props.$customStyles}// these styles override all the above ones, leave them here
`;

export const Label = styled.label`
  font-family: "Poppins";
  font-style: italic;
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 18px;
  color: ${theme.palette.disabled.secondary};

  ${(props) =>
    props.$customStyles}// these styles override all the above ones, leave them here
`;

export const StyledLink = styled(Link)`
  color: ${theme.palette.primary.main};
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
