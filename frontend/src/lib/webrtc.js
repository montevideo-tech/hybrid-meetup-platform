import { Space, SubscriptionMode } from '@mux/spaces-web';

// TODO we should have a config somewhere which tells us what to use
// TODO wrap MUX SDK according to table in https://github.com/montevideo-tech/hybrid-meetup-platform/issues/14

export class Room {
  constructor(jwt) {
    this.muxSpace = new Space(jwt, {
      subscriptionMode: SubscriptionMode.Manual,
    });
    this.jwt = jwt;
    this.id = this.muxSpace.spaceId;
    // this.remoteParticipants = []; // TODO
  }

  /**
   * Join a room. Returns the participant.
   */
  join() {
    return this.muxSpace.join();
  }

  /**
   * Leave a room
   */
  leave() {
    return this.muxSpace.leave();
  }
}
