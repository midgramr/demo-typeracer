import { Room, Client, CloseCode } from 'colyseus';
import { GameState } from './schema/MyRoomState.js';

export class MyRoom extends Room {
  maxClients = 4;
  state = new GameState();

  messages = {
    // Should support:
    // - Client increment word index
    'typedWord': (client: Client) => {
      const player = this.state.players.get(client.sessionId);
      player.wordIndex++;

      if (player.wordIndex >= this.state.words.length) {
        // Set player's finish time to now
      }
    },
  }

  onCreate(options: any) {
    /**
     * Called when a new room is created.
     */
  }

  onJoin(client: Client, options: any) {
    /**
     * Called when a client joins the room.
     */
    console.log(client.sessionId, 'joined!');
  }

  onLeave(client: Client, code: CloseCode) {
    /**
     * Called when a client leaves the room.
     */
    console.log(client.sessionId, 'left!', code);
  }

  onDispose() {
    /**
     * Called when the room is disposed.
     */
    console.log('room', this.roomId, 'disposing...');
  }

}
