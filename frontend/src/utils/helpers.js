import { getRoomPermissions } from '../actions';
import { addUpdateParticipant } from '../reducers/roomSlice';

export const updateParticipantRoles = async (roomId, dispatch) => {
  const initialParticipantRoles = await getRoomPermissions(roomId);

  initialParticipantRoles.map((part) => dispatch(addUpdateParticipant({
    name: part.userEmail,
    role: part['rooms-permission'].name,
    id: part.id,
  })));
};

export const comparator = (participant1, participant2) => {
  if (participant1.speaking > participant2.speaking) {
    return -1;
  }

  if (participant1.lastSpokenTime > participant2.lastSpokenTime) {
    return -1;
  }

  return 1;
};
