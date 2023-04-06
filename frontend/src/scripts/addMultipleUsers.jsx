import { Room as WebRoom } from '../lib/webrtc';
import { roomJWTprovider } from '../actions';
import videoURL from './jonaInTheLab.mp4';

const getVideoTrackFromMP4 = async () => {
  // Create a video element and set its source to the imported video URL
  const videoElement = document.createElement('video');
  videoElement.src = videoURL;
  videoElement.muted = true;
  videoElement.playsInline = true;
  videoElement.play();

  // Wait for the video element's "loadedmetadata" event
  await new Promise((resolve) => {
    videoElement.addEventListener('loadedmetadata', resolve);
  });

  // Capture the media stream from the video element
  const mediaStream = await videoElement.captureStream();

  // Extract the video track from the media stream
  const videoTrack = mediaStream.getVideoTracks()[0];
  console.log('Video track:', videoTrack);

  return videoTrack;
};

const addMultipleUsers = async () => {
  const JWT = await roomJWTprovider(
    '2rBPI21AXm76PqKpYq005q402nskDNRLl00Uokb5y00BaHA',
    'eifelipito@gmail.com',
    null,
    null,
    () => { console.log('Room not found'); },
  );
  const room = new WebRoom(JWT);
  const newParticipant = await room.join();

  const video = await getVideoTrackFromMP4();

  const provider = {
    isPublished: false,
    track: video,
    kind: 2,
    height: 720,
    width: 1280,
    muted: true,
    name: 'JonaInTheLab',
    source: 'other',
  };

  const elem = {};

  elem.provider = provider;
  const params = {};

  params.tracks = [elem];

  const tracks = newParticipant.publishTracks(params);
  console.log('Tracks', tracks);
};

export default addMultipleUsers;
