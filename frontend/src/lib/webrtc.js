import EventEmitter from "events";
import {
  Space,
  SubscriptionMode,
  getUserMedia,
  getDisplayMedia,
  SpaceEvent,
  ParticipantEvent,
  TrackEvent,
} from "@mux/spaces-web";
import config from "./config";
// TODO we should have a config somewhere which tells us what to use
// wrap MUX SDK according to table in https://github.com/montevideo-tech/hybrid-meetup-platform/issues/14
class Provider {
  constructor(jwt) {
    this.jwt = jwt;
  }

  async join() {
    throw new Error("join() method must be implemented");
  }

  async leave() {
    throw new Error("leave() method must be implemented");
  }

  // Anothers generic events
}

// Implementing MUX provider
class MuxProvider extends Provider {
  constructor(jwt) {
    super(jwt);
  }

  async join() {
    // Implementing join for MUX
    console.log("Joining with MUX provider...");
  }

  async leave() {
    // Implementing leave for MUX
    console.log("Leaving with MUX provider...");
  }
}

class DolbyProvider extends Provider {
  constructor(jwt) {
    super(jwt);

  }

  async join() {
  // Implementing join for DOLBY
    console.log("Joining with Dolby.io provider...");
  }

  async leave() {
// Implementing leave for DOLBY
    console.log("Leaving with Dolby.io provider...");
  }

}

export class Track extends EventEmitter {
  constructor(providerTrack) {
    super();
    this.provider = providerTrack;
    this.id = this.provider.tid;
    this.muted = this.provider.muted;
    this.mediaStreamTrack = this.provider.track;
    this.kind = this.provider.track.kind;

    // listen to MUX events and emit owr own, passing our wrapped classes
    this.provider.on(TrackEvent.Muted, () => this.emit("Muted"));
    this.provider.on(TrackEvent.Unmuted, () => this.emit("Unmuted"));
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
    this.id = this.provider.connectionId;
    this.displayName = this.provider.id;
    this.role = this.provider.role;
    // this.tracks = []; //provider audioTracks + videoTracks

    // listen to MUX events and emit owr own, passing our wrapped classes
    this.provider.on(ParticipantEvent.StartedSpeaking, () =>
      this.emit("StartedSpeaking"),
    );
    this.provider.on(ParticipantEvent.StoppedSpeaking, () =>
      this.emit("StoppedSpeaking"),
    );
  }

  /**
   * Get a list of tracks
   */
  getTracks() {
    const tracks = this.provider.getTracks();
    return tracks.map((t) => new Track(t));
  }
}

export class LocalParticipant extends Participant {
  /**
   * Publish an array of Tracks to the room.
   *
   * Accepts either and array of wrapped Tracks, or a constraints object.
   *
   * Returns a promise that resolves to the array of local wrapped Tracks.
   */
  async publishTracks(params) {
    let tracksToPublish;
    if (params.tracks) {
      const { tracks } = params;
      tracksToPublish = tracks;
    } else if (params.constraints) {
      // TODO handle screen share
      tracksToPublish = await getUserMedia(params.constraints);
    } else {
      throw new Error("Unexpected parameters passes to publishTracks");
    }

    const publishedTracks = await this.provider.publishTracks(tracksToPublish); // returns Mux Track
    return publishedTracks.map((t) => new Track(t)); // wrap into our Track
  }

  async startScreenShare() {
    const displayMediaOptions = {
      video: {
        cursor: "always",
      },
      audio: false,
    };
    const screenStreams = await getDisplayMedia(displayMediaOptions);
    const publishedTracks = await this.provider.publishTracks(screenStreams); // returns Mux Track
    return publishedTracks.map((t) => new Track(t)); // wrap into our Track
  }

  async removeRemoteParticipant(participantName) {
    const eventType = "RemoveRemoteParticipant";
    const eventData = {
      participantId: participantName,
    };
    const payload = JSON.stringify({
      type: eventType,
      data: eventData,
    });
    try {
      await this.provider.publishCustomEvent(payload);
    } catch (error) {
      console.error(error);
    }
  }

  async blockMuteRemoteParticipant(participantId, isMuted) {
    const eventType = "BlockMuteRemoteParticipant";
    const eventData = {
      participantId,
      isMuted,
    };
    const payload = JSON.stringify({
      type: eventType,
      data: eventData,
    });
    try {
      await this.provider.publishCustomEvent(payload);
    } catch (error) {
      console.error(error);
    }
  }

  async blockMuteAllRemoteParticipants(blockMuted) {
    const eventType = "BlockMuteAllRemoteParticipants";
    const eventData = {
      blockMuted,
    };
    const payload = JSON.stringify({
      type: eventType,
      data: eventData,
    });
    try {
      await this.provider.publishCustomEvent(payload);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Unpublish a list of local wrapped Tracks from the room.
   * The function also stops the tracks.
   */
  unpublishTracks(tracks) {
    const tracksToUnpublish = tracks.map((t) => t.provider); // Mux Tracks required
    return this.provider.unpublishTracks(tracksToUnpublish, { stop: true });
  }

  /**
   * Unpublish all local tracks from the room.
   * The function also stops the tracks.
   */
  unpublishAllTracks() {
    return this.provider.unpublishAllTracks({ stop: true });
  }

  /**
   * Update an array of local wrapped Tracks by replacing the underlying media,
   * without the need to unpublish and re-publish a track.
   * Useful, for example, to change video feed.
   *
   * Note: if a track has not already been published, it will be ignored.
   *
   * Returns the array of local tracks that were successfully updated.
   */
  updateTracks(tracks) {
    const tracksToUpdate = tracks.map((t) => t.provider); // Mux Tracks required
    const updatedTracks = this.provider.updateTracks(tracksToUpdate);
    return updatedTracks.map((t) => new Track(t));
  }
}

export class RemoteParticipant extends Participant {
  /**
   * Subscribe to the remote participant's media.
   *
   * After this promise resolves you can expect to receive one
   * SpaceEvent.ParticipantTrackSubscribed event to fire for each RemoteTrack
   * that this participant has published to the space. Subsequent tracks that
   * this participant publishes will be automatically subscribed to until unsubscribe is called.
   */
  subscribe() {
    return this.provider.subscribe();
  }

  /**
   * Unubscribe from the remote participant's media.
   */
  unsubscribe() {
    return this.provider.unsubscribe();
  }
}

export class Room extends EventEmitter {
  constructor(jwt) {
    super();
    this.provider = new Space(jwt, {
      subscriptionMode: SubscriptionMode.Manual,
    });
    this.jwt = jwt;
    this.id = this.provider.spaceId;
    this.remoteParticipants = this.provider.participants;

    // listen to MUX events and emit owr own, passing our wrapped classes
    this.provider.on(SpaceEvent.ParticipantJoined, (p) =>
      this.emit("ParticipantJoined", new RemoteParticipant(p)),
    );
    this.provider.on(SpaceEvent.ParticipantLeft, (p) =>
      this.emit("ParticipantLeft", new RemoteParticipant(p)),
    );
    // When you have subscribed to a remote participant's track.
    // This means that you have begun receiving media from the associated participant track
    // TODO perhaps we might want to change the name of  ParticipantTrackSubscribed
    this.provider.on(SpaceEvent.ParticipantTrackSubscribed, (p, t) =>
      this.emit(
        "ParticipantTrackSubscribed",
        new RemoteParticipant(p),
        new Track(t),
      ),
    );
    this.provider.on(SpaceEvent.ParticipantCustomEventPublished, (p, event) => {
      const resp = JSON.parse(event.payload);
      if (resp.type === "RemoveRemoteParticipant") {
        this.emit("RemoveRemoteParticipant", resp.data);
      }
      if (resp.type === "BlockMuteRemoteParticipant") {
        this.emit("BlockMuteRemoteParticipant", resp.data);
      }
      if (resp.type === "BlockMuteAllRemoteParticipants") {
        this.emit("BlockMuteAllRemoteParticipants", resp.data);
      }
    });
  }

  /**
   * Join a room.
   *
   * Returns the local participant.
   */
  async join() {
    try {
      const participant = await this.provider.join();
      const localParticipant = new LocalParticipant(participant);
      return localParticipant;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Leave a room
   */
  leave() {
    return this.provider.leave();
  }
}
