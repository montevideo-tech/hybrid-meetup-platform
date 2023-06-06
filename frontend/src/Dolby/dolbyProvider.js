import EventEmitter from "events";
import VoxeetSDK from "@voxeet/voxeet-web-sdk";

export class Track extends EventEmitter {
  constructor(providerTrack) {
    super();
    this.provider = providerTrack;
    this.id = this.provider.id;
    this.muted = this.provider.muted;
    this.kind = this.provider.kind;
    this.mediaStreamTrack = this.provider.mediaStreamTrack;
  }

  mute() {
    this.mediaStreamTrack.enabled = false;
    this.muted = true;
    this.provider.emit("Muted", this.provider);
  }

  unmute() {
    this.mediaStreamTrack.enabled = true;
    this.muted = false;
    this.provider.emit("Unmuted", this.provider);
  }
}

class Participant extends EventEmitter {
  constructor(providerParticipant) {
    super();
    this.provider = providerParticipant;
    this.id = this.provider.id;
    this.displayName = this.provider.info.name;

    this.provider.on("streamAdded", () => this.emit("StartedSpeaking"));
    this.provider.on("streamRemoved", () => this.emit("StoppedSpeaking"));
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
      const tracks = [
        {
          kind: "video",
          mediaStreamTrack: mediaStreamTrack,
        },
      ];
      // If audio is also enabled, add a dummy audio track (replace with actual audio track if available)
      if (constraints.audio) {
        const audioTrack = VoxeetSDK.audio.local.start();
        tracks.push({
          kind: "audio",
          // Replace with actual MediaStreamTrack for audio
          mediaStreamTrack: audioTrack,
        });
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
  constructor(jwt) {
    super();
    VoxeetSDK.initializeToken(jwt, () => Promise.resolve(jwt));

    this.provider = VoxeetSDK.session;

    // Add a new property for remote participants
    this.remoteParticipants = new Map();

    this.provider.on("participantAdded", (p) => {
      // Create a new RemoteParticipant
      const participant = new RemoteParticipant(p);
      // Add the new participant to the map
      this.remoteParticipants.set(participant.id, participant);
      this.emit("ParticipantJoined", participant);
    });
  }

  async join() {
    try {
      await VoxeetSDK.session.open({ name: "John Doe" });
      const localParticipant = new LocalParticipant(
        VoxeetSDK.session.participant,
      );
      return localParticipant;
    } catch (error) {
      console.error(error);
    }
  }

  async leave() {
    try {
      return await VoxeetSDK.conference.leave();
    } catch (error) {
      console.error(error);
    }
  }
}
