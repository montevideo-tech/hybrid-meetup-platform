// addFakeParticipant1
import { LocalTrack, TrackSource, TrackKind } from "@mux/spaces-web";
import { Room as WebRoom } from "../lib/webrtc";
import { roomJWTprovider } from "../actions";
import videoURL0 from "./videos/video0.mp4";

const videos = [videoURL0];

const getVideoTrackFromMP4 = async (videoNumber) => {
  // Create a video element and set its source to the imported video URL
  const videoElement = document.createElement("video");
  videoElement.src = videos[videoNumber];
  videoElement.muted = true;
  videoElement.playsInline = true;
  videoElement.play();

  // Wait for the video element's "loadedmetadata" event
  await new Promise((resolve) => {
    videoElement.addEventListener("loadedmetadata", resolve);
  });

  // Capture the media stream from the video element
  const mediaStream = await videoElement.captureStream();

  // Extract the video track from the media stream
  const videoTrack = mediaStream.getVideoTracks()[0];

  return videoTrack;
};

const addFakeParticipant = async (roomId, participantEmail, numberOfVideo) => {
  const JWT = await roomJWTprovider(
    roomId,
    participantEmail,
    null,
    null,
    () => {
      console.log("Room not found");
    },
  );
  const room = new WebRoom(JWT);
  const newParticipant = await room.join();

  const video = await getVideoTrackFromMP4(numberOfVideo);

  const localTrack = new LocalTrack({
    source: TrackSource.Other,
  });

  localTrack.kind = TrackKind.Video;
  localTrack.track = video;
  localTrack.name = "fakevideo";
  localTrack.tid = video.id;

  const params = {};

  params.tracks = [localTrack];

  newParticipant.publishTracks(params);
};

export default addFakeParticipant;
