import React, {
  Children,
  cloneElement,
  isValidElement,
  ReactNode,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import calcOptimalBoxes from "../lib/participantsCollection";

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
    return null; // default return value when children is falsy
  }, [children, width, height, gap]);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        alignItems: "center",
        gap: `${gap}px`,
        justifyContent: "center",
      }}
    >
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
    </div>
  );
}

ParticipantLayout.propTypes = {
  children: ReactNode,
  width: PropTypes.number,
  height: PropTypes.number,
  gap: PropTypes.number,
};

ParticipantLayout.defaultProps = {
  children: undefined,
  width: 886,
  height: 609,
  gap: 10,
};

export default ParticipantLayout;
