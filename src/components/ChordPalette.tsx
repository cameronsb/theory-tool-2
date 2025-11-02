import { useMusic } from '../hooks/useMusic';
import { useGrid } from '../hooks/useGrid';
import { getScaleChords } from '../utils/musicTheory';
import type { Note, ChordBlock } from '../types/music';
import './ChordPalette.css';

export function ChordPalette() {
  const { state, actions } = useMusic();
  const grid = useGrid();
  const scaleChords = getScaleChords(state.song.key, state.song.mode);

  const handleChordClick = (chord: {
    numeral: string;
    rootNote: Note;
    intervals: number[]
  }) => {
    const existingBlocks = state.song.tracks.chords.blocks;
    const lastBlock = existingBlocks[existingBlocks.length - 1];
    const newPosition = lastBlock ? lastBlock.position + lastBlock.duration : 0;

    const newBlock: ChordBlock = {
      id: `${Date.now()}-${Math.random()}`,
      rootNote: chord.rootNote,
      intervals: chord.intervals,
      numeral: chord.numeral,
      position: newPosition,
      duration: grid.beatsToEighths(4),
    };

    actions.addChordBlock(newBlock);
  };

  const isChordSelected = (numeral: string) => {
    return state.selectedChords.some(chord => chord.numeral === numeral);
  };

  return (
    <div className="chord-palette">
      <div className="chord-palette-header">
        <h3>Chords in {state.song.key} {state.song.mode}</h3>
      </div>
      <div className="chord-grid">
        {scaleChords.map((chord) => (
          <button
            key={chord.numeral}
            className={`chord-button ${isChordSelected(chord.numeral) ? 'selected' : ''}`}
            onClick={() => handleChordClick(chord)}
          >
            <span className="chord-numeral">{chord.numeral}</span>
            <span className="chord-notes">{chord.rootNote}</span>
          </button>
        ))}
      </div>
    </div>
  );
}