import React from "react";

import { Grid, Typography } from "@mui/material";

import { useSelector } from "react-redux";
import RoomItem from "./RoomItem";

function RoomsList(props) {
  const currentUser = useSelector((state) => state.user);
  const { list } = props; // TODO use store

  if (!list.length) {
    return <Typography variant="body1">There are no rooms yet!</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {list.map((room) => {
        return <RoomItem currentUser={currentUser} room={room} key={room.id} />;
      })}
    </Grid>
  );
}

export default RoomsList;
