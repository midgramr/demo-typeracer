import { useState } from 'react'
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

function App() {
  const [paragraph, setParagraph] = useState(lorem.generateParagraphs(1));
  const [startTime, setStartTime] = useState<number | undefined>(undefined);

  function getElapsed() {
    return startTime ? Date.now() - startTime : 0;
  }

  return (
    <>
      <TypingArea paragraph={paragraph} elapsed={getElapsed} onStart={setStartTime} />
    </>
  )
}

export default App
