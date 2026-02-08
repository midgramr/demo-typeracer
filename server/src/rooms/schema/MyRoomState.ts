import { ArraySchema, MapSchema, Schema, type } from '@colyseus/schema';
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
  @type('number') rank: number;
  // Index of current word that player is typing
  @type('number') wordIndex = 0;
  @type('boolean') done = false;
  @type('number') finishTime: number;
}

export class GameState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();

  // Game status, either: 'waiting', 'playing', or 'finished'
  @type('string') status = 'waiting';

  @type('string') words = new ArraySchema<string>();

  public addPlayer(sessionId: string, name: string) {
    const player = new Player();
    player.name = name;
    this.players.set(sessionId, player);
  }

  public generateWords() {
    const paragraph = lorem.generateParagraphs(1);
    this.words.clear();
    paragraph.split(' ').forEach(word => this.words.push(word));
  }

  public getTypedChars(playerId: string): number {
    const player = this.players.get(playerId);
    return this.words.reduce((total, word, idx) => {
      return total + idx <= player.wordIndex ? word.length : 0;
    }, 0);
  }
}
