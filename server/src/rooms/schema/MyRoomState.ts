import { MapSchema, Schema, type } from '@colyseus/schema';
import { LoremIpsum } from 'lorem-ipsum';

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    min: 4,
    max: 8,
  },
  wordsPerSentence: {
    min: 4,
    max: 16,
  }
});

export class Player extends Schema {
  @type('string') name: string;
  @type('string') id: string;
  // Index of current word that player is typing
  @type('number') wordIndex = 0;
  @type('boolean') finished = false;
  // Time in seconds the player spent typing
  @type('number') typingTime: number;
}

export class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();

  // Game status, either: 'waiting', 'playing', or 'finished'
  @type('string') status = 'waiting';

  @type('string') paragraph: string;

  paragraphWords: string[];

  addPlayer(sessionId: string, name: string) {
    const player = new Player();
    player.name = name;
    player.id = sessionId;
    this.players.set(sessionId, player);
  }

  removePlayer(sessionId: string) {
    this.players.delete(sessionId);
  }

  generateParagraph() {
    this.paragraph = lorem.generateParagraphs(1);
    this.paragraphWords = this.paragraph.split(' ');
  }
}
