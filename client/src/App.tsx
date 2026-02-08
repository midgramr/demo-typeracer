import { useCallback, useState } from 'react'
import { LoremIpsum } from 'lorem-ipsum'
import './App.css'
import TypingArea from './TypingArea';

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    min: 4,
    max: 8,
  },
  wordsPerSentence: {
    min: 4,
    max: 16,
  },
});

const App = () => {
  const [paragraph, setParagraph] = useState(lorem.generateParagraphs(1));
  const [startTime, setStartTime] = useState<number | undefined>(undefined);

  const getElapsedMs = useCallback(() => (
    startTime ? (Date.now() - startTime) / 1000 : 0
  ), [startTime]);

  return (
    <>
      <TypingArea paragraph={paragraph} getElapsedSec={getElapsedMs} onStart={setStartTime} />
    </>
  )
};

export default App
