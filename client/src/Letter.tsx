import { memo } from 'react';

interface LetterProps {
  hasCaret: boolean,
  letter: string,
}

const Letter = memo(({ hasCaret, letter }: LetterProps) => {
  return (
    <div className='letter'>
      {hasCaret && <div className='caret'></div>}{letter}
    </div>
  );
});

export default Letter;
