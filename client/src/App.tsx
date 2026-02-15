import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import TypingArea from './TypingArea';
import { Callbacks, Client, Room } from '@colyseus/sdk';
import type server from '../../server/src/app.config.ts';
import type { TyperacerRoom } from '../../server/src/rooms/TyperacerRoom.ts';
import { GameState } from '../../server/src/rooms/schema/MyRoomState.ts';
import Player from './Player.ts';
import '@colyseus/sdk/debug';

const client = new Client<typeof server>('http://localhost:2567')

const App = () => {
  const [paragraph, setParagraph] = useState('');
  const [startTime, setStartTime] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [players, setPlayers] = useState<Player[]>([]);

  const roomRef = useRef<Room<TyperacerRoom, GameState>>(null);

  useEffect(() => {
    const req = client.joinOrCreate<TyperacerRoom>(
      'typeracer', { name: 'Kevin' }, GameState
    );

    req
      .then(room => {
        // How do I pass this room reference to child components?
        roomRef.current = room;

        room.onMessage('newParagraph', (pg: string) => {
          setParagraph(pg);
        })

        const callbacks = Callbacks.get(room);

        const initialPlayers: Player[] = [];
        room.state.players.forEach(player => {
          initialPlayers.push(Player.from(player));
        });
        setPlayers(initialPlayers);

        callbacks.onAdd('players', player => {
          setPlayers(p => [...p, Player.from(player)]);

          callbacks.onChange(player, () => {
            setPlayers(pl => {
              const filtered = pl.filter(p => p.id != player.id);
              return filtered.concat([Player.from(player)]);
            });
          });
        });

        callbacks.onRemove('players', player => {
          console.log(player.id, 'left');
          setPlayers(pl => pl.filter(p => p.id != player.id));
        });
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false));

    return () => {
      req.then(room => room.leave());
      roomRef.current = null;
    }
  }, []);

  const getElapsedSec = useCallback(() => (
    startTime ? (Date.now() - startTime) / 1000 : 0
  ), [startTime]);

  const handleTypedWord = useCallback(() => {
    const room = roomRef.current;
    if (room !== null) {
      room.send('clientTypedWord');
    }
  }, []);

  const wordCnt = paragraph.split(' ').length;

  return (
    <>
      <h1>Typeracer</h1>
      {loading ? (
        <div className='loading'>Loading...</div>
      ) : (
        error ? (
          <div className='error'>Error: {error}</div>
        ) : (
          <div>
            Players:
            <div>
              {players.map(p => (
                <div key={p.id}>
                  {p.id}&nbsp;
                  <progress max={wordCnt} value={p.wordIndex} />
                </div>
              ))}
            </div>
            <TypingArea
              paragraph={paragraph}
              getElapsedSec={getElapsedSec}
              onStart={setStartTime}
              onTypedWord={handleTypedWord}
            />
          </div>
        )
      )}
    </>
  )
};

export default App
