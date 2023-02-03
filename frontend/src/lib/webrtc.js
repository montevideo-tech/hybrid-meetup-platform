import { Space, SubscriptionMode, getUserMedia } from '@mux/spaces-web';

// TODO we should have a config somewhere which tells us what to use
// TODO wrap MUX SDK according to table in https://github.com/montevideo-tech/hybrid-meetup-platform/issues/14

export class Room {
  constructor(jwt) {
    this.provider = new Space(jwt, {
      subscriptionMode: SubscriptionMode.Manual,
    });
    this.jwt = jwt;
    this.id = this.provider.spaceId;
    this.remoteParticipants = this.provider.participants;
  }

  /**
   * Join a room.
   *
   * Returns the local participant.
   */
  async join() {
    const participant = await this.provider.join();
    const localParticipant = new LocalParticipant(participant);
    return localParticipant;
  }

  /**
   * Leave a room
   */
  leave() {
    return this.provider.leave();
  }

  // TODO events
}

class Participant {
  constructor(providerParticipant) {
    this.provider = providerParticipant;
    this.id = this.provider.connectionId;
    this.displayName = this.provider.id;
    this.role = this.provider.role;
    // this.tracks = []; //provider audioTracks + videoTracks
  }

  /**
   * Get a list of tracks
   */
  getTracks() {
    const tracks = this.provider.getTracks();
    return tracks.map((t) => new Track(t));
  }

  // TODO events
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
      tracksToPublish = tracks.map((t) => t.provider); // Mux Tracks required to be published
    } else if (params.constraints) {
      tracksToPublish = await getUserMedia(params.constraints);
    } else {
      throw new Error('Unexpected parameters passes to publishTracks');
    }

    const publishedTracks = await this.provider.publishTracks(tracksToPublish); // returns Mux Track
    return publishedTracks.map((t) => new Track(t)); // wrap into our Track
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

  // TODO events
}

export class RemoteParticipant extends Participant {
  /**
   * Subscribe to the remote participant's media.
   */
  subscribe() {
    return this.provider.subscribe();
  }

  /**
   * unubscribe from the remote participant's media.
   */
  unsubscribe() {
    return this.provider.unsubscribe();
  }

  // TODO events
}

export class Track {
  constructor(providerTrack) {
    this.provider = providerTrack;
    this.id = this.provider.id;
    this.muted = this.provider.muted;
    this.mediaStreamTrack = this.provider.track;
  }

  // TODO events
  on(e) { // TEST
    return this.provider.on(e);
  }
}
