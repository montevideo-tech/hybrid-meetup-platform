import styled from "styled-components";

function Icon(props) {
  const { icon, name, customStyles } = props;

  return (
    <StyledIcon src={icon} alt={name} $customStyles={customStyles} {...props} />
  );
}

export default Icon;

const StyledIcon = styled.img`
  ${({ $customStyles }) => $customStyles}
`;
