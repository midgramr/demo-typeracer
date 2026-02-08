import { useEffect, useState } from 'react';
import Wpm from './Wpm';
import Letter from './Letter';
import './TypingArea.css'
import Word from './Word';

interface TypingProps {
  paragraph: string,
  // Get seconds elapsed since user started typing
  // TODO: move this to context
  getElapsedSec: () => number,
  // Start stopwatch; called when user starts typing
  onStart: (t: number) => void,
}

interface TypedIndex {
  wordIdx: number,
  letterIdx: number,
}

const TypingArea = ({ paragraph, getElapsedSec, onStart }: TypingProps) => {
  const [typedIdx, setTypedIdx] = useState<TypedIndex>({
    wordIdx: 0,
    letterIdx: 0,
  });
  const [lettersTyped, setLettersTyped] = useState(0);
  const [typos, setTypos] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(getElapsedSec() / 1000);

  useEffect(() => {
    // Re-render WPM at fixed intervals
    const id = setInterval(() => {
      setElapsedSec(getElapsedSec());
    }, 100);
    return () => clearInterval(id);
  }, [getElapsedSec])

  const paragraphWords = paragraph.split(' ').map(word => word + ' ');

  // Handle input events that would produce characters in the input box
  // @ts-expect-error: implicit any
  const handleBeforeInput = (e) => {
    const data: string = e.data;

    if (!getElapsedSec() &&
        typedIdx.wordIdx == 0 && typedIdx.letterIdx == 0) {
      onStart(Date.now());
    }

    const curWord = paragraphWords[typedIdx.wordIdx];
    const curLetter = curWord[typedIdx.letterIdx];

    if (data === curLetter && typos === 0) {
      if (typedIdx.letterIdx === curWord.length - 1) {
        setTypedIdx(i => ({ wordIdx: i.wordIdx + 1, letterIdx: 0 }));
        e.target.value = '';
      } else {
        setTypedIdx(i => ({ ...i, letterIdx: i.letterIdx + 1 }));
      }
      setLettersTyped(l => l + 1);
    } else {
      // Force extra characters after typo to be deleted
      // before player can continue
      setTypos(t => t + 1);
    }
  };

  // Handle all input events; used for special/modifier keys
  // @ts-expect-error: implicit any
  const handleKeyDown = (e) => {
    const key: string = e.key;

    if (key === 'Backspace') {
      if (typos > 0) {
        setTypos(t => t - 1);
      } else if (typedIdx.letterIdx > 0) {
        setTypedIdx(i => ({ ...i, letterIdx: i.letterIdx - 1 }));
      }
    }
  };

  return (
    <>
      <h1>Typeracer</h1>
      <Wpm lettersTyped={lettersTyped} elapsedSec={elapsedSec} />
      <div className='paragraph'>
        {paragraphWords.map((word, i) => (
          <Word
            key={i}
            word={word}
            wordIdx={i}
            typedWordIdx={typedIdx.wordIdx}
            typedLetterIdx={typedIdx.letterIdx}
          />
        ))}
      </div>
      <input
        className='inputBox'
        placeholder='Start typing...'
        onBeforeInput={handleBeforeInput}
        onKeyDown={handleKeyDown}
      />
    </>
  );
};

export default TypingArea;
