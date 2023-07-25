import React, { forwardRef } from "react";
import styled from "styled-components";
import { Colors } from "../themes/colors";

const Input = forwardRef((props, ref) => {
  const { width, height, focusStyles, customStyles, children } = props;
  return (
    <StyledInput
      ref={ref}
      $width={width}
      $height={height}
      $focusStyles={focusStyles}
      $customStyles={customStyles}
      {...props}
    >
      {children}
    </StyledInput>
  );
});

Input.displayName = "Input";
export default Input;

const StyledInput = styled.input`
  border: 2px solid ${Colors.purple};
  border-radius: 34px;
  background-color: ${Colors.lightPurple};
  color: ${Colors.blackPurple};
  font-family: "Poppins";
  font-weight: 500;
  font-size: 1rem;
  line-height: 23px;
  padding: 0px 15px;
  width: ${({ $width }) => ($width ? $width : "150px")};
  height: ${({ $height }) => ($height ? $height : "37px")};

  ::placeholder {
    color: ${Colors.davyGray};
    opacity: 50%;
  }

  // the following styles override all the above ones, leave them here
  ${({ $customStyles }) => $customStyles}
  ${({ $focusStyles }) => `
    :focus-visible {
      outline: none !important;
      ${
        $focusStyles
          ? $focusStyles
          : `
            border: 2px solid ${Colors.purple};
            box-shadow: 0 0 2px ${Colors.purple};
            `
      }
    }
  `}
`;
