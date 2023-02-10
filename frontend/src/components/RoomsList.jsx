import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  List, ListItem, ListItemButton, ListItemText, Typography,
} from '@mui/material';

function RoomsList(props) {
  const { list } = props; // TODO use store

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
