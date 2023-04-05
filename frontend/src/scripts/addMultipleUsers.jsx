import { Room as WebRoom } from '../lib/webrtc';
import { roomJWTprovider } from '../actions';

const addMultipleUsers = async () => {
  console.log('Hello');
  const JWT = await roomJWTprovider(
    '2rBPI21AXm76PqKpYq005q402nskDNRLl00Uokb5y00BaHA',
    'eifelipito@gmail.com',
    null,
    null,
    () => { console.log('Room not found'); },
  );
  const felipe = new WebRoom(JWT);

  const newParticipant = await felipe.join();
  console.log('New Participant', newParticipant);
};

export default addMultipleUsers;
