import { React, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoaderData, useNavigate } from 'react-router-dom';
import {
  List, ListItem, IconButton, Typography, TextField, MenuItem, Button, Card,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import styled from 'styled-components';
import { giveUserRoleOnRoom } from '../actions';
import { ROLES } from '../utils/roles';
import { updateParticipantRoles } from '../utils/helpers';

export async function roomLoader({ params }) {
  return params.roomId;
}

function EditRoom() {
  const participants = useSelector((state) => state.room.participants);
  const dispatch = useDispatch();
  const roomId = useLoaderData();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [roleToAdd, setRoleToAdd] = useState('presenter');
  // TODO:
  // get actual hosts/presenters from db
  const [roles, setRoles] = useState({ hosts: [], presenters: [] });
  const handleAddRole = async () => {
    const currentHosts = roles.hosts;
    const currentPresenters = roles.presenters;
    await giveUserRoleOnRoom(email, roomId, roleToAdd);
    if (roleToAdd === 'host') {
      setRoles({
        hosts: [...currentHosts, email],
        presenters: [...currentPresenters],
      });
    }
    if (roleToAdd === 'presenter') {
      setRoles({
        hosts: [...currentHosts],
        presenters: [...currentPresenters, email],
      });
    }
  };
  const getRoles = () => {
    const rolesCopy = { ...roles };
    const newPresenters = [];
    const newHosts = [];

    for (let i = 0; i < participants.length; i++) {
      if (participants[i].role === ROLES.PRESENTER) {
        newPresenters.push(participants[i].name);
      } else if (participants[i].role === ROLES.HOST) {
        newHosts.push(participants[i].name);
      }
    }
    rolesCopy.hosts = [...rolesCopy.hosts, ...newHosts];
    rolesCopy.presenters = [...rolesCopy.presenters, ...newPresenters];
    setRoles(rolesCopy);
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
  }, []);

  useEffect(() => {
    updateParticipantRoles(roomId, dispatch);
  }, [roles]);

  return (
    <div style={{
      marginTop: '15px',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
    }}
    >
      <StyledContainer>
        <Button variant="contained" onClick={() => navigate(`/rooms/${roomId}`)}>
          Go to Room
        </Button>
        <Typography component="h1" variant="h4" sx={{ textAlign: 'center' }}>
          {`Edit Room ${roomId}`}
        </Typography>
      </StyledContainer>
      <div style={{ display: 'flex' }}>
        <Card variant="outlined">
          <div style={{ padding: '1vh 0.5vw' }}>
            <Typography component="h2" variant="h5" sx={{ textAlign: 'center' }}>
              Hosts
            </Typography>
            <List>
              {
                /* eslint-disable arrow-body-style */
                roles.hosts.map((e) => {
                  return (
                    <ListItem
                      key={e}
                      secondaryAction={(
                        <IconButton edge="end">
                          <DeleteIcon onClick={() => { handleDeleteRole(e, 'hosts'); }} />
                        </IconButton>
                      )}
                    >
                      <Typography>{e}</Typography>
                    </ListItem>
                  );
                })
              }
            </List>
          </div>
        </Card>
        <Card sx={{ marginLeft: '2vw' }} variant="outlined">
          <div style={{ padding: '1vh 0.5vw' }}>
            <Typography component="h2" variant="h5" sx={{ textAlign: 'center' }}>
              Presenters
            </Typography>
            <List>
              {
                /* eslint-disable arrow-body-style */
                roles.presenters.map((e) => {
                  return (
                    <ListItem
                      key={e}
                      secondaryAction={(
                        <IconButton edge="end">
                          <DeleteIcon onClick={() => { handleDeleteRole(e, 'presenters'); }} />
                        </IconButton>
                      )}
                    >
                      <Typography>{e}</Typography>
                    </ListItem>
                  );
                })
              }
            </List>
          </div>
        </Card>
        <Card sx={{ marginLeft: '2vw' }} variant="outlined">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyItems: 'center',
            padding: '1vh 0.5vw',
          }}
          >
            <TextField
              variant="outlined"
              label="Email"
              sx={{ width: 1, marginBottom: '1vh' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              select
              label="Role"
              sx={{ width: 1, marginBottom: '1vh' }}
              defaultValue="presenter"
              value={roleToAdd}
              onChange={(e) => setRoleToAdd(e.target.value)}
            >
              <MenuItem value="presenter">
                Presenter
              </MenuItem>
            </TextField>
            <Button variant="contained" onClick={handleAddRole}>
              Add
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default EditRoom;

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: 0.15fr 1fr;
  gap: 15px;
`;
