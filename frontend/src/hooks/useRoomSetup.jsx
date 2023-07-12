import { useEffect } from "react";
import { getProvider } from "../utils/environment";
import { cleanRoom } from "../reducers/roomSlice";

const useRoomSetup = (
  providerName,
  localParticipant,
  localTracks,
  setLocalVideoStream,
  setLocalAudioStream,
  setLocalName,
  setProviderName,
  leaveRoom,
  dispatch,
) => {
  useEffect(() => {
    if (providerName === "MUX") {
      if (localParticipant?.provider?.videoTracks?.entries().next()?.value) {
        const localVideoStream = new MediaStream();
        localVideoStream.addTrack(
          localParticipant?.provider?.videoTracks?.entries().next()?.value[1]
            .track,
        );
        setLocalVideoStream(localVideoStream);
      }
      if (localParticipant?.provider?.audioTracks?.entries().next()?.value) {
        setLocalAudioStream(
          localParticipant?.provider?.audioTracks?.entries().next()?.value[1],
        );
      }
      setLocalName(localParticipant?.displayName);
    } else {
      if (localTracks.video) {
        const newlocalVideoStream = new MediaStream();
        newlocalVideoStream.addTrack(localTracks.video.mediaStreamTrack);
        setLocalVideoStream(newlocalVideoStream);
      }
    }
  }, [
    localParticipant?.provider?.audioTracks?.entries().next().done,
    localParticipant?.provider?.videoTracks?.entries().next().done,
    localTracks,
  ]);

  // initialize room
  useEffect(() => {
    const setProvider = async () => {
      const provider = await getProvider();
      setProviderName(provider);
    };

    setProvider();
    return () => {
      dispatch(cleanRoom());
      leaveRoom();
    };
  }, []);
};

export default useRoomSetup;
