import styled from "styled-components";
import { Colors } from "../themes/colors";

function Card(props) {
  const { width, height, customStyles, children } = props;

  return (
    <StyledCard
      $width={width}
      $height={height}
      $customStyles={customStyles}
      {...props}
    >
      {children}
    </StyledCard>
  );
}

export default Card;

const StyledCard = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${Colors.lightPurple};
  border: 2px solid ${Colors.purple};
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.1);
  border-radius: 30px;
  padding: 30px;
  width: ${({ $width }) => ($width ? $width : "370px")};
  height: ${({ $height }) => ($height ? $height : "max-content")};

  ${({ $customStyles }) =>
    $customStyles}// these styles override all the above ones, leave them here
`;
