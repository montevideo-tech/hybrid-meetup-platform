import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Colors } from "../../themes/colors";

import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";

import { useDispatch } from "react-redux";
import styled from "styled-components";
import Button from "@mui/material/Button";
import { deleteRoom } from "../../actions";
import { ROLES } from "../../utils/roles";
import theme from "../../themes/theme";
import { onDeleteRoomMessage } from "../../utils/chat";

export const RoomItem = ({ currentUser, room }) => {
  const { id, name, providerId, createdBy } = room;

  const dispatch = useDispatch();

  if (!id || !name || !providerId) {
    return null;
  }

  const handleDeleteRoom = () => {
    onDeleteRoomMessage(providerId);
    dispatch(deleteRoom(providerId));
  };

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
    <Grid item xs={12} sm={6} md={4} key={id}>
      <StyledCard className="custom-card">
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {createdByStr}
          </Typography>
        </CardContent>
        {currentUser?.role === ROLES.USER ? (
          <CardActions>
            <StyledButton
              className="custom-button"
              component={RouterLink}
              to={`/rooms/${providerId}`}
            >
              Join Room
            </StyledButton>
          </CardActions>
        ) : (
          <CardActions>
            <StyledButton
              className="custom-button"
              component={RouterLink}
              to={`/rooms/${providerId}`}
            >
              Join Room
            </StyledButton>
            <IconButton
              aria-label="delete"
              size="medium"
              onClick={handleDeleteRoom}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              aria-label="edit"
              size="medium"
              component={RouterLink}
              to={`/rooms/${providerId}/edit`}
            >
              <EditIcon fontSize="inherit" />
            </IconButton>
          </CardActions>
        )}
      </StyledCard>
    </Grid>
  );
};

const StyledButton = styled(Button)`
  &&.custom-button {
    background-color: ${theme.palette.primary.main};
    color: ${Colors.white};
  }
  &&.custom-button:hover {
    background-color: ${theme.palette.primary.dark};
  }
  &&.custom-button:disabled {
    background-color: #cccccc;
  }
`;

const StyledCard = styled(Card)`
  &&.custom-card {
    border: 1px solid ${Colors.lightPurple};
    box-shadow: 0px 3px 2px rgba(77, 71, 71, 0.349);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

export default RoomItem;
