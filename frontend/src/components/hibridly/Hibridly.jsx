import { Link as RouterLink } from "react-router-dom";
import styled from "styled-components";

import { Typography } from "@mui/material";

import theme from "../../themes/theme";
import { Colors } from "../../themes/colors";

export const Hibridly = () => {
  return (
    <HibridlyContainer component={RouterLink} to="/">
      <HibridlyTypography variant="button" className="typography-hibridly">
        Hybridly
      </HibridlyTypography>
      <QualabsTypography variant="caption" className="typography-qualabs">
        by Qualabs
      </QualabsTypography>
    </HibridlyContainer>
  );
};

const HibridlyContainer = styled(RouterLink)`
  display: flex;
  flex-direction: column;
  text-decoration: none;
  padding: 4px 10px;
  border-radius: 15px 15px 0 15px;
  background-color: ${theme.palette.primary.main};
  transition: background-color 1s ease-out 100ms;
  :hover {
    background-color: ${Colors.white};
    .typography-hibridly {
      color: ${theme.palette.primary.dark};
    }
    .typography-qualabs {
      opacity: 1;
    }
  }
`;

const HibridlyTypography = styled(Typography)`
  text-decoration: none;
  color: ${Colors.white};
`;

const QualabsTypography = styled(Typography)`
  position: relative;
  left: 3rem;
  top: 1px;
  height: 0;
  text-decoration: none;
  color: ${Colors.turquoise};
  opacity: 0;
  transition: opacity 1s ease-out 100ms;
`;

export default Hibridly;
