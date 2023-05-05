import React from "react";
import PropTypes from "prop-types";

import { Grid, Typography } from "@mui/material";

import RoomItem from "./rooms/RoomItem";

function RoomsList(props) {
  const { list } = props; // TODO use store
  return list.length ? (
    <Grid container spacing={2}>
      {list.map((room) => (
        <RoomItem room={room} />
      ))}
    </Grid>
  ) : (
    <Typography variant="body1">There are no rooms yet!</Typography>
  );
}

RoomsList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  list: PropTypes.array,
};

RoomsList.defaultProps = {
  list: [],
};

export default RoomsList;
