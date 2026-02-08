interface CharProps {
  wordIndex: number,
  typedIndex: number,
  char: string,
}

function Char({ wordIndex, typedIndex, char }: CharProps) {
  const highlighted = typedIndex === wordIndex;
  return (
    <div id={wordIndex.toString()} className='char'>
      {highlighted && <div className='caret'>|</div>}{char}
    </div>
  );
}

export default Char;
