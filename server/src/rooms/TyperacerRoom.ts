import { Room, Client, CloseCode } from 'colyseus';
import { GameState } from './schema/MyRoomState.js';

interface JoinMessage {
  name: string,
}

export class TyperacerRoom extends Room {
  maxClients = 4;
  state = new GameState();
  timeoutIds: NodeJS.Timeout[] = [];

  messages = {
    'clientTypedWord': (client: Client) => {
      const state = this.state;

      // if (state.status != 'playing') {
      //   client.send('error', 'No game in progress.');
      //   return;
      // }

      const player = state.players.get(client.sessionId);
      if (player.finished) {
        client.send('error', 'Player is already finished.');
        return;
      }
      player.wordIndex++;

      if (player.wordIndex >= state.paragraph.length) {
        player.typingTime = this.clock.elapsedTime / 1000;
        player.finished = true;
      }
    },
  }

  onCreate(_options: any) {
    this.state.generateParagraph();
  }

  onJoin(client: Client, options: JoinMessage) {
    this.state.addPlayer(client.sessionId, options.name);

    // Start new game countdown when at least 2 players join
    if (this.state.players.size == 2) {
      this.timeoutIds.push(setTimeout(() => {
        this.lock();
        this.state.status = 'playing';
      }, 5000));
    }

    client.send('newParagraph', this.state.paragraph);

    if (this.state.players.size == this.maxClients) {
      this.state.status = 'playing';
      this.clock.stop();
      this.clock.start();
    }

    console.log(client.sessionId, 'joined!');
    this.logPlayers();
  }

  onLeave(client: Client, code: CloseCode) {
    this.state.removePlayer(client.sessionId);

    if (this.state.players.size == 1) {
      this.timeoutIds.forEach(id => clearTimeout(id));
    }

    console.log(client.sessionId, 'left!', code);
    this.logPlayers();
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }

  private logPlayers() {
    const playerNames: string[] = [];
    this.state.players.forEach(p => playerNames.push(p.id));
    console.log('Players:', playerNames);
  }
}
