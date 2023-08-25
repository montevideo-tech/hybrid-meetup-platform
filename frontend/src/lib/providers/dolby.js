import EventEmitter from "events";
import VoxeetSDK from "@voxeet/voxeet-web-sdk";

export class Track extends EventEmitter {
  constructor(providerTrack) {
    super();
    this.provider = providerTrack;
    this.id = this.provider.id;
    this.muted = this.provider.muted;
    this.kind = this.provider.kind;
    this.mediaStreamTrack = this.provider;
  }

  mute() {
    try {
      VoxeetSDK.conference.mute(VoxeetSDK.session.participant, true);
      this.muted = true;
    } catch (error) {
      console.error("Error muting audio track:", error);
    }
    this.emit("Muted", this.provider);
  }

  unmute() {
    try {
      VoxeetSDK.conference.mute(VoxeetSDK.session.participant, false);
      this.muted = false;
    } catch (error) {
      console.error("Error unmuting audio track:", error);
    }
    this.emit("Unmuted", this.provider);
  }
}

class Participant extends EventEmitter {
  constructor(providerParticipant) {
    super();
    this.provider = providerParticipant;
    this.id = this.provider.id;
    this.displayName = this.provider.info.name;
  }

  getTracks() {
    const tracks = this.provider.getTracks();
    return tracks.map((t) => new Track(t));
  }
}

export class LocalParticipant extends Participant {
  async publishTracks(props) {
    const { constraints } = props;
    // Check if video constraints are specified
    const videoConstraints = {
      width: { ideal: 1280 },
      height: { ideal: 720 },
    };
    // If video constraints exist, start local video
    if (videoConstraints) {
      const mediaStreamTrack = await VoxeetSDK.video.local.start(
        videoConstraints,
      );
      // Prepare the tracks array to be similar to what your existing code expects
      const tracks = [mediaStreamTrack];
      // If audio is also enabled, add a dummy audio track (replace with actual audio track if available)
      if (constraints.audio) {
        //when you do the join, the audio track is created, so we get it from the LocalParticipant
        const streams = this.provider.streams[0];
        //  get the mediaStreamTracks to be compatible with mux
        const audioTrack = streams.getTracks()[0];
        tracks.push(audioTrack);
      }
      return tracks.map((t) => new Track(t));
    }

    // If no video constraints, return an empty array
    return [];
  }

  async unpublishVideoTrack() {
    try {
      await VoxeetSDK.video.local.stop();
    } catch (error) {
      console.error("Error unpublishing video track:", error);
    }
  }

  isSpeaking() {
    return VoxeetSDK.conference.isSpeaking(VoxeetSDK.session.participant);
  }
}

export class RemoteParticipant extends Participant {
  async subscribe() {
    try {
      await VoxeetSDK.conference.subscribe(this.provider);
    } catch (error) {
      console.error("Error subscribing to participant:", error);
    }
  }

  async unsubscribe() {
    try {
      await VoxeetSDK.conference.unsubscribe(this.provider);
    } catch (error) {
      console.error("Error unsubscribing from participant:", error);
    }
  }
}

export class Room extends EventEmitter {
  constructor(jwt, participant) {
    super();
    VoxeetSDK.initializeToken(jwt, () => Promise.resolve(jwt));

    this.provider = VoxeetSDK.session;
    this.localParticipantId = participant;
    VoxeetSDK.conference.on("streamUpdated", (participant, stream) => {
      //  get the mediaStreamTracks to be compatible with mux
      const tracks = stream.getTracks();
      tracks.map((t) => {
        const track = new Track(t);
        const remoteParticipant = new RemoteParticipant(participant);
        this.emit("ParticipantTrackUpdated", remoteParticipant, track);
      });
    });
    VoxeetSDK.conference.on("streamAdded", (participant, stream) => {
      //  get the mediaStreamTracks to be compatible with mux
      const tracks = stream.getTracks();
      tracks.map((t) => {
        const track = new Track(t);
        const remoteParticipant = new RemoteParticipant(participant);
        this.emit("ParticipantTrackSubscribed", remoteParticipant, track);
      });
    });

    VoxeetSDK.conference.on("streamRemoved", (p) => {
      VoxeetSDK.conference.participants.delete(p.id);
      this.emit("ParticipantLeft", new RemoteParticipant(p));
    });
  }

  async join() {
    try {
      // get the room id from the url
      const roomId = window.location.pathname.split("/")[2];
      await VoxeetSDK.session.open({ name: this.localParticipantId });
      const conference = await VoxeetSDK.conference.create({
        alias: roomId,
      });
      await VoxeetSDK.conference.join(conference, {
        constraints: { audio: true, video: true },
      });
      // get the remote participants that are already on the call
      this.remoteParticipants = conference.participants;
      const localParticipant = new LocalParticipant(
        VoxeetSDK.session.participant,
      );
      return { participant: localParticipant, error: null };
    } catch (error) {
      return { participant: null, error: error.message };
    }
  }

  async subscribeRemoteParticipants() {
    // Emit ParticipantTrackSubscribed,
    // for each track of each remote participant already in the call,
    // to be subscribed in the same way as it does with mux
    const localParticipantId = VoxeetSDK.session.participant.id;
    const remoteParticipants = await VoxeetSDK.conference.participants.values();
    for (const participantRemote of remoteParticipants) {
      if (localParticipantId !== participantRemote.id) {
        if (
          participantRemote.streams.length > 0 &&
          participantRemote.status !== "Left"
        ) {
          const participant = new RemoteParticipant(participantRemote);
          //  get the mediaStreamTracks to be compatible with mux
          participantRemote.streams[0].getTracks().map((e) => {
            const track = new Track(e);
            this.emit("ParticipantTrackSubscribed", participant, track);
          });
        }
      }
    }
  }

  getNumberOfParticipants() {
    let res = 0;
    const remoteParticipants = this.remoteParticipants;
    for (const participantRemote of remoteParticipants.values()) {
      if (
        participantRemote.streams.length > 0 &&
        participantRemote.status !== "Left"
      ) {
        res++;
      }
    }
    return res;
  }

  async leave() {
    try {
      await VoxeetSDK.conference.leave();
      await VoxeetSDK.session.close();
    } catch (error) {
      console.error(error);
    }
  }
}
