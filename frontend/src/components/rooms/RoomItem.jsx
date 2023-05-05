import React from "react";

import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Button from "@mui/material/Button";
import { ROLES } from "../../utils/roles";
import { deleteRoom } from "../../actions";

function RoomItem(room) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);

  const { id, name, providerId, createdBy } = room;

  if (!id || !name || !providerId) {
    return null;
  }

  let createdByStr = "Created by ";
  if (createdBy?.username) {
    createdByStr += createdBy.username;
    if (createdBy?.email) {
      createdByStr += ` (${createdBy.email})`;
    }
  } else if (createdBy?.email) {
    createdByStr += createdBy.email;
  } else {
    createdByStr += "event organizer";
  }

  return (
    <Grid item xs={12} sm={6} md={4} key={room.id}>
      <StyledCard className="custom-card">
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {room.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {createdByStr}
          </Typography>
        </CardContent>
        <CardActions>
          <StyledButton
            className="custom-button"
            component={RouterLink}
            to={`/rooms/${room.providerId}`}
          >
            Join Room
          </StyledButton>
          {currentUser?.role !== ROLES.USER && (
            <>
              <IconButton
                aria-label="delete"
                size="medium"
                onClick={() => dispatch(deleteRoom(room.providerId))}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
              <IconButton
                aria-label="edit"
                size="medium"
                component={RouterLink}
                to={`/rooms/${room.providerId}/edit`}
              >
                <EditIcon fontSize="inherit" />
              </IconButton>
            </>
          )}
        </CardActions>
      </StyledCard>
    </Grid>
  );
}

const StyledButton = styled(Button)`
  &&.custom-button {
    background-color: #652ead;
    color: #ffffff;
  }
  &&.custom-button:hover {
    background-color: #391052;
  }
  &&.custom-button:disabled {
    background-color: #cccccc;
  }
`;

const StyledCard = styled(Card)`
  &&.custom-card {
    border: 1px solid #f0e4ff;
    box-shadow: 0px 3px 2px rgba(77, 71, 71, 0.349);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

export default RoomItem;
