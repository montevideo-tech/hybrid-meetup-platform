import { getDolbyKey } from "./supabaseSDK/environment";
import { roomJWTprovider } from "../actions";
import { Room as DolbyWebRoom } from "../lib/providers/dolby";
import { Room as MuxWebRoom } from "../lib/providers/mux";
import { getGuestMuted } from "./supabaseSDK/room";
import { initRoom, SnackbarAlert } from "../reducers/roomSlice";
import { ROLES } from "../utils/supabaseSDK/roles";

export async function joinRoom(
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
) {
  const dolbyApiKey = await getDolbyKey();
  const MuxJWT = await roomJWTprovider(
    roomId,
    currentUser.email,
    null,
    null,
    () => {
      setRoomNotFound(true);
    },
  );
  const guestMuted = await getGuestMuted();
  setIsBlockedRemotedGuest(guestMuted);
  if (currentUser.role !== ROLES.ADMIN) {
    setIsEnableToUnmute(!guestMuted);
  }
  if (providerName !== "") {
    try {
      const newRoom =
        providerName === "MUX"
          ? new MuxWebRoom(MuxJWT)
          : new DolbyWebRoom(dolbyApiKey, currentUser.email);
      const newParticipant = await newRoom.join();
      if (newParticipant.error) {
        throw newParticipant.error;
      } else {
        setLocalParticipant(newParticipant);
        dispatch(
          initRoom({
            id: roomId,
            participants: [{ name: currentUser.username, role: ROLES.GUEST }],
          }),
        );

        // add event handler for TrackStarted event
        newRoom.on("RemoveRemoteParticipant", (resp) =>
          handleRemoveParticipant(resp, newParticipant),
        );
        newRoom.on("ParticipantTrackSubscribed", handleTrackStarted);
        newRoom.on("ParticipantTrackUpdated", handleTrackUpdated);
        newRoom.on("ParticipantJoined", handleParticipantJoined);
        newRoom.on("ParticipantLeft", handleParticipantLeft);

        setRoom(newRoom);
        roomRef.current = newRoom;
        const propsTracks = {
          constraints: {
            video: true,
            audio: true,
          },
        };
        const tracks = await newParticipant.publishTracks(propsTracks);
        const stream = new MediaStream();
        const newLocalTracks = { ...localTracks };
        tracks.forEach((track) => {
          stream.addTrack(track.mediaStreamTrack);
          newLocalTracks[track.kind] = track;
        });
        setLocalTracks(newLocalTracks);
        subscribeToRemoteStreams(newRoom);
        subscribeToRoleChanges(roomId, handleRoleChange);

        newRoom.on("BlockMuteRemoteParticipant", (resp) =>
          handleBlockMuteRemote(resp, newParticipant, newLocalTracks),
        );
        newRoom.on("BlockMuteAllRemoteParticipants", (resp) =>
          handleBlockMuteAllGuests(resp, newLocalTracks),
        );
      }
    } catch (error) {
      console.error(error);
      if (error === "A duplicate session has been detected") {
        dispatch(SnackbarAlert({ error }));
      }
      navigate("/rooms");
      setErrorJoiningRoom(true);
    }
  }
}
