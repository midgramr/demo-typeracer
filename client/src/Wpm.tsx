import { useState } from "react";

interface WpmProps {
  charsTyped: number,
  elapsed: () => number,
}

function Wpm({ charsTyped, elapsed }: WpmProps) {
  const [wpm, setWpm] = useState(0);

  if (elapsed()) {
    setInterval(() => {
      const words = charsTyped / 5;
      const elapsedSec = elapsed() / 1000;
      setWpm(words * 60 / elapsedSec);
    }, 2000);
  }

  return <div>wpm: {Math.round(wpm)}</div>;
}

export default Wpm;
