import { useState } from "react";
import Wpm from "./Wpm";
import Char from "./Char";
import './TypingArea.css'

interface TypingProps {
  paragraph: string,
  // Get milliseconds since user started typing
  elapsed: () => number,
  // Start stopwatch; called when user starts typing
  onStart: (t: number) => void,
}

function TypingArea({ paragraph, elapsed, onStart }: TypingProps) {
  const [typedIndex, setTypedIndex] = useState(0);
  const [typos, setTypos] = useState(0);

  const paragraphChars = paragraph.split('');

  // Handle input events that would produce characters in the input box
  // @ts-expect-error: implicit any
  function handleBeforeInput(e) {
    const data: string = e.data;

    if (!elapsed() && typedIndex === 0) {
      onStart(Date.now());
    }

    if (data === paragraphChars[typedIndex] && typos === 0) {
      if (data === ' ') {
        e.target.value = '';
      }
      setTypedIndex(i => i + 1);
    } else {
      // Force extra characters after typo to be deleted
      // before player can continue
      setTypos(t => t + 1);
    }
  }

  // Handle all input events; used for special/modifier keys
  // @ts-expect-error: implicit any
  function handleKeyDown(e) {
    const key: string = e.key;

    if (key === 'Backspace') {
      if (typos === 0) {
        setTypedIndex(i => Math.max(0, i - 1));
      } else {
        setTypos(t => t - 1);
      }
    }
  }

  return (
    <>
      <h1>Typeracer</h1>
      <Wpm charsTyped={typedIndex + 1} elapsed={elapsed} />
      <div className='paragraph'>
        {paragraphChars.map((c, i) => (
          <Char key={i} wordIndex={i} typedIndex={typedIndex} char={c} />
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
}

export default TypingArea;
