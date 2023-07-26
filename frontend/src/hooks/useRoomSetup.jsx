import { useEffect } from "react";
import { getProvider } from "../utils/supabaseSDK/environment";
import { cleanRoom, initProvider } from "../reducers/roomSlice";
import { useSelector } from "react-redux";

const useRoomSetup = (
  localParticipant,
  localTracks,
  setLocalVideoStream,
  setLocalAudioStream,
  setLocalName,
  leaveRoom,
  dispatch,
) => {
  const providerName = useSelector((state) => state?.room?.provider);

  // initialize room
  useEffect(() => {
    const setProvider = async () => {
      const provider = await getProvider();
      dispatch(initProvider(provider));
    };

    setProvider();
    return () => {
      dispatch(cleanRoom());
      leaveRoom();
    };
  }, []);

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
};
export default useRoomSetup;
