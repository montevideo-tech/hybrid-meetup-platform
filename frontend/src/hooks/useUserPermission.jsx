import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const useUserPermission = () => {
  const participants = useSelector((state) => state.room.participants);
  const currentUser = useSelector((state) => state.user);
  const [participantRole, setParticipantRole] = useState();
  const participant = participants.find((p) => p.name === currentUser.email);

  useEffect(() => {
    if (participant) {
      setParticipantRole(participant.role);
    }
  }, [participant]);

  return participantRole;
};

export default useUserPermission;
