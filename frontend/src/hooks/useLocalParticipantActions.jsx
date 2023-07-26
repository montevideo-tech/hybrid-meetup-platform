import { useEffect } from "react";
import { useSelector } from "react-redux";
import { joinRoom } from "../utils/localParticipant";
import { useLoaderData } from "react-router-dom";

const useLocalParticipantActions = (
  roomRef,
  dispatch,
  navigate,
  localTracks,
  setRoomNotFound,
  setIsBlockedRemotedGuest,
  setIsEnableToUnmute,
  setLocalParticipant,
  setRoom,
  setLocalTracks,
  setErrorJoiningRoom,
  handleRemoveParticipant,
  handleTrackStarted,
  handleTrackUpdated,
  handleParticipantJoined,
  handleParticipantLeft,
  handleRoleChange,
  handleBlockMuteRemote,
  handleBlockMuteAllGuests,
  subscribeToRemoteStreams,
  subscribeToRoleChanges,
) => {
  const currentUser = useSelector((state) => state.user);
  const providerName = useSelector((state) => state?.room?.provider);
  const roomId = useLoaderData();
  useEffect(() => {
    joinRoom(
      roomRef,
      dispatch,
      navigate,
      localTracks,
      currentUser,
      providerName,
      roomId,
      setRoomNotFound,
      setIsBlockedRemotedGuest,
      setIsEnableToUnmute,
      setLocalParticipant,
      setRoom,
      setLocalTracks,
      setErrorJoiningRoom,
      handleRemoveParticipant,
      handleTrackStarted,
      handleTrackUpdated,
      handleParticipantJoined,
      handleParticipantLeft,
      handleRoleChange,
      handleBlockMuteRemote,
      handleBlockMuteAllGuests,
      subscribeToRemoteStreams,
      subscribeToRoleChanges,
    );
  }, [providerName]);
};

export default useLocalParticipantActions;
