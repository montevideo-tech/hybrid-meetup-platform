import { React, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import {
  List, ListItem, IconButton, Typography, TextField, MenuItem,
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
  const FlexSettings = {
    display: 'flex',
  };
  return (
    <div>
      Edit Room
      {' '}
      { roomId }
      <div style={FlexSettings}>
        <div>
          <Typography>Hosts</Typography>
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
        <div>
          <Typography>Presenters</Typography>
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
        <div>
          <TextField
            variant="outlined"
            label="Email"
            sx={{ width: 1 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            select
            label="Role"
            sx={{ width: 1 }}
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
        </div>
      </div>
    </div>
  );
}

export default EditRoom;
