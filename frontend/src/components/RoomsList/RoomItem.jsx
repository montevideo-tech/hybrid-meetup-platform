import React from "react";
import { useDispatch } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Colors } from "../../themes/colors";
import { Button } from "../../themes/componentsStyles";
import { Grid, Card, CardContent, CardActions } from "@mui/material";
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
          <Title gutterBottom variant="h5" component="div">
            {name}
          </Title>
          <CreatedBy variant="body2" color="text.secondary">
            {createdByStr}
          </CreatedBy>
        </CardContent>
        {currentUser?.role === ROLES.USER ? (
          <StyledCardActions>
            <Button $primary onClick={() => navigate(`/rooms/${providerId}`)}>
              Join room
            </Button>
          </StyledCardActions>
        ) : (
          <StyledCardActions>
            <Button
              aria-label="delete"
              size="medium"
              component={RouterLink}
              onClick={handleDeleteRoom}
              $customStyles={{
                width: "35px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DeleteIcon fontSize="medium" />
            </Button>
            <Button
              aria-label="edit"
              size="medium"
              component={RouterLink}
              onClick={() => navigate(`/rooms/${providerId}/edit`)}
              $customStyles={{
                width: "35px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <EditIcon fontSize="medium" />
            </Button>
            <Button $primary onClick={() => navigate(`/rooms/${providerId}`)}>
              Join room
            </Button>
          </StyledCardActions>
        )}
      </StyledCard>
    </Grid>
  );
};

const StyledCard = styled(Card)`
  &&.custom-card {
    border: 2px solid ${Colors.purple};
    background: ${Colors.lightPurple};
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 30px;
  }
`;

const CreatedBy = styled.div`
  font-family: "Poppins", sans-serif;
  font-style: italic;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  color: ${Colors.davyGray};
  padding: 12px 0;
`;

const Title = styled.div`
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 25px;
  line-height: 38px;
  color: ${Colors.purple};
  border-bottom: solid 2px ${Colors.purple};
`;

const StyledCardActions = styled(CardActions)`
  justify-content: flex-end;
  padding: 23px !important;
`;

export default RoomItem;
