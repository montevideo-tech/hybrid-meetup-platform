import { React, useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import {
  List, ListItem, IconButton, Typography, TextField, MenuItem, Button, Card,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { giveUserRoleOnRoom } from '../actions';

export async function roomLoader({ params }) {
  return params.roomId;
}

function EditRoom() {
  const roomId = useLoaderData();
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
    // here we load the existing roles (TODO)
    setRoles({
      hosts: ['some@email.com', 'other@email.com'],
      presenters: ['loremipsum@sitamet.com'],
    }); // hardcoded for testing purposes
  }, []);

  return (
    <div style={{
      marginTop: '15px',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
    }}
    >
      <Typography component="h1" variant="h4" sx={{ textAlign: 'center' }}>
        Edit Room
        {' '}
        {roomId}
      </Typography>
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
