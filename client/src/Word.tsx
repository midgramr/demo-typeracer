import { memo } from 'react';
import Letter from './Letter.tsx'

interface WordProps {
  word: string,
  wordIdx: number,
  typedWordIdx: number,
  typedLetterIdx: number,
}

const Word = memo(({ word, wordIdx, typedWordIdx, typedLetterIdx }: WordProps) => {
  return (
    <div className='word'>
      {word.split('').map((letter, i) => (
        <Letter
          key={i}
          hasCaret={typedWordIdx == wordIdx && typedLetterIdx == i}
          letter={letter}
        />
      ))}
    </div>
  );
});

export default Word;
