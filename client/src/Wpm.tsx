import { memo } from 'react';

interface WpmProps {
  lettersTyped: number,
  elapsedSec: number,
}

const Wpm = memo(({ lettersTyped, elapsedSec }: WpmProps) => {
  const computeWpm = () => {
    // Don't compute WPM unless 0.2sec have passed
    // so it doesn't look overly inflated
    if (elapsedSec < 0.2) {
      return 0;
    }
    const words = lettersTyped / 5;
    return words * 60 / elapsedSec;
  };

  const wpm = computeWpm();

  return <div>wpm: {Math.round(wpm)}</div>;
});

export default Wpm;
