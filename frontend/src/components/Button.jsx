import styled from "styled-components";
import { Colors } from "../themes/colors";

function Button(props) {
  const {
    primary,
    secondary,
    width,
    height,
    customStyles,
    hoverStyles,
    disabledStyles,
    children,
  } = props;

  return (
    <StyledButton
      $primary={primary}
      $secondary={secondary}
      $width={width}
      $height={height}
      $customStyles={customStyles}
      $hoverStyles={hoverStyles}
      $disabledStyles={disabledStyles}
      {...props}
    >
      {children}
    </StyledButton>
  );
}

export default Button;

const StyledButton = styled.button`
  cursor: pointer;
  border-radius: 35px;
  font-family: "Poppins";
  font-weight: 500;
  transition: 0.4s;
  width: ${({ $width }) => ($width ? $width : "136px")};
  height: ${({ $height }) => ($height ? $height : "35px")};
  ${({ $primary, $secondary, $hoverStyles }) =>
    $primary
      ? `
        background-color: ${Colors.purple};
        color: ${Colors.white};
        border: none;
        font-size: 0.875rem;
        line-height: 21px;

        &:hover{
          ${
            $hoverStyles
              ? $hoverStyles
              : `background-color: ${Colors.darkPurple}`
          } 
        }
        `
      : $secondary
      ? `
        background-color: ${Colors.lightPurple};
        color: ${Colors.purple};
        border: 2px solid ${Colors.purple};
        font-size: 1rem;
        line-height: 24px;

        &:hover{
          ${$hoverStyles ? $hoverStyles : "opacity: 80%"}
        }
        `
      : `
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: transparent;
        border: none;
        padding: 0;

        &:hover{
          ${$hoverStyles ? $hoverStyles : "opacity: 80%"}
        }
        `}

  // the following styles override all the above ones, leave them here
  ${({ $customStyles }) => $customStyles} 
  ${({ $disabledStyles }) =>
    `&:disabled {
        ${
          $disabledStyles
            ? $disabledStyles
            : `background-color: ${Colors.lightGray}; border: none; color: ${Colors.davyGray}; cursor: auto;`
        }
      }`}
`;
