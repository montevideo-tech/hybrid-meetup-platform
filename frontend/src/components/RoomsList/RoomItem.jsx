import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Colors } from "../../themes/colors";
import Button from "../Button";
import { Grid, Card, CardContent, CardActions } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import styled from "styled-components";
import { deleteRoom } from "../../actions";
import { ROLES } from "../../utils/supabaseSDK/roles";
import { onDeleteRoomMessage } from "../../utils/supabaseSDK/chat";
import ConfirmationToast from "../ConfirmationToast/ConfirmationToast";
import deletePurple from "../../assets/deletePurple.svg";

export const RoomItem = ({ currentUser, room }) => {
  const { id, name, providerId, createdBy } = room;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

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
    <>
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
              <Button primary onClick={() => navigate(`/rooms/${providerId}`)}>
                Join room
              </Button>
            </StyledCardActions>
          ) : (
            <StyledCardActions>
              <Button
                onClick={() => setShowToast(true)}
                width="35px"
                customStyles={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `2px solid ${Colors.purple}`,
                }}
              >
                <img
                  src={deletePurple}
                  alt="delete room"
                  width="15px"
                  height="15px"
                />
              </Button>
              <Button
                onClick={() => navigate(`/rooms/${providerId}/edit`)}
                width="35px"
                customStyles={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `2px solid ${Colors.purple}`,
                  color: Colors.purple,
                }}
              >
                <EditIcon fontSize="small" />
              </Button>
              <Button primary onClick={() => navigate(`/rooms/${providerId}`)}>
                Join room
              </Button>
            </StyledCardActions>
          )}
        </StyledCard>
      </Grid>
      {showToast && (
        <ConfirmationToast
          text={`Are you sure you want to delete ${name}?`}
          confirmationText="Delete"
          onCancel={() => setShowToast(false)}
          onConfirmation={handleDeleteRoom}
        />
      )}
    </>
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
