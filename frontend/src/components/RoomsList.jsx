import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  List, ListItem, ListItemButton, ListItemText, Typography, IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { deleteRoom } from '../actions';

function RoomsList(props) {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.loggedUser);
  const { list } = props; // TODO use store
  console.log(currentUser.email);
  return (
    list.length ? (
      <List>
        {list.map((room) => {
          const {
            id, name, providerId, createdBy,
          } = room;

          if (!id || !name || !providerId) {
            return null;
          }

          let createdByStr = 'Created by ';
          if (createdBy?.username) {
            createdByStr += createdBy.username;
            if (createdBy?.email) {
              createdByStr += ` (${createdBy.email})`;
            }
          } else if (createdBy?.email) {
            createdByStr += createdBy.email;
          } else {
            createdByStr += 'event organizer';
          }

          return (
            <ListItem
              key={room.id}
              sx={{ pl: 0 }}
            >
              <ListItemButton component={RouterLink} to={`/rooms/${room.providerId}`}>
                <ListItemText primary={room.name} secondary={createdByStr} />
              </ListItemButton>
              <IconButton aria-label="delete" size="large" onClick={() => dispatch(deleteRoom(room.providerId))}>
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </ListItem>
          );
        })}
      </List>
    ) : (
      <Typography variant="body1">There are no rooms yet!</Typography>
    )
  );
}

RoomsList.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  list: PropTypes.array,
};

RoomsList.defaultProps = {
  list: [],
};

export default RoomsList;
