import { React, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLoaderData, useNavigate } from "react-router-dom";
import {
  List,
  ListItem,
  IconButton,
  Typography,
  TextField,
  MenuItem,
  Button,
  Card,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import styled from "styled-components";
import { giveUserRoleOnRoom } from "../actions";
import { ROLES } from "../utils/roles";
import { updateParticipantRoles } from "../utils/helpers";

export async function roomLoader({ params }) {
  return params.roomId;
}

function EditRoom() {
  const participants = useSelector((state) => state.room.participants);
  const dispatch = useDispatch();
  const roomId = useLoaderData();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [roleToAdd, setRoleToAdd] = useState("presenter");
  // TODO:
  // get actual hosts/presenters from db
  const [roles, setRoles] = useState({ hosts: [], presenters: [] });
  const handleAddRole = async () => {
    const currentHosts = roles.hosts;
    const currentPresenters = roles.presenters;
    await giveUserRoleOnRoom(email, roomId, roleToAdd);
    if (roleToAdd === "host") {
      setRoles({
        hosts: [...currentHosts, email],
        presenters: [...currentPresenters],
      });
    }
    if (roleToAdd === "presenter") {
      setRoles({
        hosts: [...currentHosts],
        presenters: [...currentPresenters, email],
      });
    }
  };

  const getRoles = () => {
    const rolesCopy = { ...roles };
    const newPresenters = rolesCopy.presenters.slice();
    const newHosts = rolesCopy.hosts.slice();

    participants.forEach((participant) => {
      if (participant.role === ROLES.PRESENTER && !newPresenters.includes(participant.name)) {
        newPresenters.push(participant.name);
      } else if (participant.role === ROLES.HOST && !newHosts.includes(participant.name)) {
        newHosts.push(participant.name);
      }
    });
  
    setRoles({ hosts: newHosts, presenters: newPresenters });
  };

  const handleDeleteRole = (e, r) => {
    const currentHosts = roles.hosts;
    const currentPresenters = roles.presenters;
    const newRoles = {
      hosts: [...currentHosts],
      presenters: [...currentPresenters],
    };
    newRoles[r].every((element, index) => {
      if (element === e) {
        newRoles[r].splice(index, 1); // remove
        return false; // break out of loop
      }
      return true; // keep looping
    });
    setRoles(newRoles);
  };

  useEffect(() => {
    getRoles();
  }, [participants.length]);

  useEffect(() => {
    updateParticipantRoles(roomId, dispatch);
  }, [roles]);

  return (
    <Container $cont1>
      <Container $cont2>
        <Button
          variant="contained"
          onClick={() => navigate(`/rooms/${roomId}`)}
        >
          Go to Room
        </Button>
        <Typography component="h1" variant="h4" sx={{ textAlign: "center" }}>
          {`Edit Room ${roomId}`}
        </Typography>
      </Container>
      <Container $cont3>
        <Card variant="outlined">
          <Container $cont4>
            <Typography
              component="h2"
              variant="h5"
              sx={{ textAlign: "center" }}
            >
              Hosts
            </Typography>
            <List>
              {roles.hosts.map((e) => {
                return (
                  <ListItem
                    key={e}
                    secondaryAction={
                      <IconButton edge="end">
                        <DeleteIcon
                          onClick={() => {
                            handleDeleteRole(e, "hosts");
                          }}
                        />
                      </IconButton>
                    }
                  >
                    <Typography>{e}</Typography>
                  </ListItem>
                );
              })}
            </List>
          </Container>
        </Card>
        <Card sx={{ marginLeft: "2vw" }} variant="outlined">
          <Container $cont4>
            <Typography
              component="h2"
              variant="h5"
              sx={{ textAlign: "center" }}
            >
              Presenters
            </Typography>
            <List>
              {roles.presenters.map((e) => {
                return (
                  <ListItem
                    key={e}
                    secondaryAction={
                      <IconButton edge="end">
                        <DeleteIcon
                          onClick={() => {
                            handleDeleteRole(e, "presenters");
                          }}
                        />
                      </IconButton>
                    }
                  >
                    <Typography>{e}</Typography>
                  </ListItem>
                );
              })}
            </List>
          </Container>
        </Card>
        <Card sx={{ marginLeft: "2vw" }} variant="outlined">
          <Container $cont5>
            <TextField
              variant="outlined"
              label="Email"
              sx={{ width: 1, marginBottom: "1vh" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              select
              label="Role"
              sx={{ width: 1, marginBottom: "1vh" }}
              defaultValue="presenter"
              value={roleToAdd}
              onChange={(e) => setRoleToAdd(e.target.value)}
            >
              <MenuItem value="presenter">Presenter</MenuItem>
            </TextField>
            <Button variant="contained" onClick={handleAddRole}>
              Add
            </Button>
          </Container>
        </Card>
      </Container>
    </Container>
  );
}

export default EditRoom;

const Container = styled.div`
  ${({ $cont1, $cont2, $cont3, $cont4, $cont5 }) =>
    $cont1
      ? `
      margin-top: 15px;
      display: flex;
      align-items: center;
      flex-direction: column;`
      : $cont2
      ? `
        display: grid;
        grid-template-columns: 0.15fr 1fr;
        gap: 15px;`
      : $cont3
      ? `
        display: flex
        `
      : $cont4
      ? `
        padding: 1vh 0.5vw;
      `
      : $cont5
      ? `
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 1vh 0.5vw;
      `
      : ""}
`;
