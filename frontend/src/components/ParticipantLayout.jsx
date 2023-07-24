import React, {
  Children,
  cloneElement,
  isValidElement,
  ReactNode,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import calcOptimalBoxes from "../lib/participantsCollection";
import styled from "styled-components";

function ParticipantLayout(props) {
  const { children, width, height, gap } = props;

  const bestFit = useMemo(() => {
    if (children) {
      return calcOptimalBoxes(
        width,
        height,
        Children.count(children),
        16 / 9,
        gap,
      );
    }
    return null;
  }, [children, width, height, gap]);

  return (
    <Container $gap={gap}>
      {Children.map(children, (child) => {
        if (
          isValidElement(child) &&
          bestFit &&
          bestFit.width &&
          bestFit.height
        ) {
          return cloneElement(child, {
            width: bestFit.width,
            height: bestFit.height,
          });
        }
        return child;
      })}
    </Container>
  );
}

export default ParticipantLayout;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  gap: ${(props) => `${props.$gap}px`};
  justify-content: center;
`;
