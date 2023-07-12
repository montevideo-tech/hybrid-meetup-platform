import { supabase } from "../lib/api";
import { comparator } from "./helpers";

export async function getGuestMuted() {
  const urlParams = window.location.pathname;
  const parts = urlParams.split("/");
  const roomId = parts[2];
  try {
    const { data, error } = await supabase
      .from("rooms")
      .select("guestMuted")
      .eq("providerId", roomId);
    if (error) throw error;
    return data[0].guestMuted;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function setGuestMuted(guestMutedStatus) {
  const urlParams = window.location.pathname;
  const parts = urlParams.split("/");
  const roomId = parts[2];
  supabase
    .from("rooms")
    .update({ guestMuted: guestMutedStatus })
    .eq("providerId", roomId)
    .then((result) => {})
    .catch((error) => {
      console.error(error);
    });
}

// export const subscribeToRemoteStreams = async (r) => {
//   // mejorable
//   const { remoteParticipants } = r;
//   if (remoteParticipants) {
//     const rps = Array.from(remoteParticipants.values());
//     // Listen to all the participants that are already on the call
//     rps.map(async (rp) => {
//       rp.on("StartedSpeaking", () => {
//         updateIsSpeakingStatus(rp.connectionId, true);
//       });
//       rp.on("StoppedSpeaking", () => {
//         updateIsSpeakingStatus(rp.connectionId, false);
//       });
//       if (providerName === "MUX") {
//         await rp.subscribe();
//       } else {
//         await r.subscribeRemoteParticipants();
//       }
//     });
//     updateParticipantRoles(roomId, dispatch);
//   }
// };

// To add a new criteria to the comparator you need to
// Decide if it's higher or lower pririoty compared to the already established
// if it's higher you must add the 'if' before otherwise add it after.
export const setRemoteStreamsRef = (
  remoteStreamsRef,
  setRemoteStreams,
  data,
) => {
  remoteStreamsRef.current = data;
  const remoteStreamsSorted = Array.from(data.values()).sort(comparator);
  setRemoteStreams(remoteStreamsSorted);
};

export const updateIsSpeakingStatus = (remoteStreamsRef, id, newStatus) => {
  const streamData = remoteStreamsRef.current.get(id);
  streamData.speaking = newStatus;
  if (newStatus) {
    streamData.lastSpokenTime = Date.now();
  }
  setRemoteStreamsRef(remoteStreamsRef.current);
};
