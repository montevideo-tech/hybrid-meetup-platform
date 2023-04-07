import { LocalTrack, TrackSource, TrackKind } from '@mux/spaces-web';
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

  const localTrack = new LocalTrack({
    source: TrackSource.Other,
  });

  localTrack.kind = TrackKind.Video;
  localTrack.track = video;
  localTrack.name = 'jona_in_the_lab';
  localTrack.tid = video.id;

  const params = {};

  params.tracks = [localTrack];

  newParticipant.publishTracks(params);
};

const kickOutEveryoneOut = async () => {

};

export default addMultipleUsers;
