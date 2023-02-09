import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  List, ListItem, ListItemButton, ListItemText,
} from '@mui/material';

function RoomsList(props) {
  const { list } = props; // TODO use store

  return (
    <List>
      {list.map((room) => {
        const { id, name, providerId } = room;
        if (!id || !name || !providerId) {
          return null;
        }

        return (
          <ListItem
            key={room.id}
            sx={{ pl: 0 }}
          >
            <ListItemButton component={RouterLink} to={`/rooms/${room.providerId}`}>
              <ListItemText primary={room.name} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
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
