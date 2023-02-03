/* eslint-disable max-classes-per-file */
import {
  Space, SubscriptionMode, getUserMedia, SpaceEvent, ParticipantEvent, TrackEvent,
} from '@mux/spaces-web';

// TODO we should have a config somewhere which tells us what to use
// wrap MUX SDK according to table in https://github.com/montevideo-tech/hybrid-meetup-platform/issues/14

// TODO properly wrap arguments of event callbacks

export class Track {
  constructor(providerTrack) {
    this.provider = providerTrack;
    this.id = this.provider.id;
    this.muted = this.provider.muted;
    this.mediaStreamTrack = this.provider.track;
  }

  /**
   * Events
   */
  on(event, cb) {
    switch (event) {
      case 'Muted':
        this.provider.on(TrackEvent.Muted, cb);
        break;
      case 'Unmuted':
        this.provider.on(TrackEvent.Unmuted, cb);
        break;
      default:
    }
  }
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

  /**
   * Events
   */
  on(event, cb) {
    switch (event) {
      case 'StartedSpeaking':
        this.provider.on(ParticipantEvent.StartedSpeaking, cb);
        break;
      case 'StoppedSpeaking':
        this.provider.on(ParticipantEvent.StoppedSpeaking, cb);
        break;
      default:
    }
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
      tracksToPublish = tracks.map((t) => t.provider); // Mux Tracks required to be published
    } else if (params.constraints) {
      // TODO handle screen share
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

  /**
   * Events
   */
  on(event, cb) {
    switch (event) {
      case 'ParticipantTrackSubscribed': // TODO perhaps we might want to change the name
        this.provider.on(SpaceEvent.ParticipantTrackSubscribed, cb);
        break;
      case 'ParticipantJoined':
        this.provider.on(SpaceEvent.ParticipantJoined, cb);
        break;
      case 'ParticipantLeft':
        this.provider.on(SpaceEvent.ParticipantLeft, cb);
        break;
      default:
    }
  }
}
