import { Player as PlayerSchema } from '../../server/src/rooms/schema/MyRoomState.ts';

export default class Player {
  name: string;
  id: string;
  wordIndex: number;
  finished: boolean;
  typingTime: number;

  constructor(
    name: string, id: string, idx: number,
    fin: boolean, time: number) {
    this.name = name;
    this.id = id;
    this.wordIndex = idx;
    this.finished = fin;
    this.typingTime = time;
  }

  static from(player: PlayerSchema): Player {
    return new Player(
      player.name,
      player.id,
      player.wordIndex,
      player.finished,
      player.typingTime,
    );
  }
}
