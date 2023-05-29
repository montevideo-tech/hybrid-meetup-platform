import React from "react";
import { useDispatch } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Colors } from "../../themes/colors";
import { Button } from "../../themes/componentsStyles";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import styled from "styled-components";
import { deleteRoom } from "../../actions";
import { ROLES } from "../../utils/roles";
import { onDeleteRoomMessage } from "../../utils/chat";

export const RoomItem = ({ currentUser, room }) => {
  const { id, name, providerId, createdBy } = room;
  const navigate = useNavigate();
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
            <Button $primary onClick={() => navigate(`/rooms/${providerId}`)}>
              Join room
            </Button>
          </CardActions>
        ) : (
          <CardActions>
            <Button $primary onClick={() => navigate(`/rooms/${providerId}`)}>
              Join room
            </Button>
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

const StyledCard = styled(Card)`
  &&.custom-card {
    border: 1px solid ${Colors.lightPurple};
    box-shadow: 0px 3px 2px ${Colors.dimGray};
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

export default RoomItem;
