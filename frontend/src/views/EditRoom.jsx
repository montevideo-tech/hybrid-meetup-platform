import { React, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import {
  List, ListItem, IconButton, Typography, TextField, MenuItem, Button, Card,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export async function roomLoader({ params }) {
  return params.roomId;
}

function EditRoom() {
  const roomId = useLoaderData();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  console.log(role);
  return (
    <div style={{ padding: '2vh 1vw' }}>
      <Typography component="h1" variant="h4" sx={{ textAlign: 'left' }}>
        Edit Room
        {' '}
        { roomId }
      </Typography>
      <div style={{ display: 'flex' }}>
        <Card variant="outlined">
          <div style={{ padding: '1vh 0.5vw' }}>
            <Typography component="h2" variant="h5" sx={{ textAlign: 'center' }}>
              Hosts
            </Typography>
            <List>
              <ListItem
                secondaryAction={(
                  <IconButton edge="end" aria-label="????">
                    <DeleteIcon />
                  </IconButton>
                )}
              >
                <Typography>Loremipsum@sitamet.com</Typography>
              </ListItem>
              <ListItem
                secondaryAction={(
                  <IconButton edge="end" aria-label="????">
                    <DeleteIcon />
                  </IconButton>
                )}
              >
                <Typography>Loremipsum@sitamet.com</Typography>
              </ListItem>
            </List>
          </div>
        </Card>
        <Card sx={{ marginLeft: '2vw' }} variant="outlined">
          <div style={{ padding: '1vh 0.5vw' }}>
            <Typography component="h2" variant="h5" sx={{ textAlign: 'center' }}>
              Presenters
            </Typography>
            <List>
              <ListItem
                secondaryAction={(
                  <IconButton edge="end" aria-label="????">
                    <DeleteIcon />
                  </IconButton>
                )}
              >
                <Typography>Loremipsum@sitamet.com</Typography>
              </ListItem>
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
              defaultValue="Host"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="Host">
                Host
              </MenuItem>
              <MenuItem value="Presenter">
                Presenter
              </MenuItem>
            </TextField>
            <Button variant="contained" onClick={() => { console.log('TODO add role'); }}>
              Add
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default EditRoom;
