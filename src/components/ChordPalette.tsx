import { useMusic } from '../hooks/useMusic';
import { getScaleChords } from '../utils/musicTheory';
import type { Note } from '../types/music';
import './ChordPalette.css';

export function ChordPalette() {
  const { state, actions } = useMusic();
  const scaleChords = getScaleChords(state.selectedKey, state.mode);

  const handleChordClick = (chord: {
    numeral: string;
    rootNote: Note;
    intervals: number[]
  }) => {
    actions.selectChord(chord.rootNote, chord.intervals, chord.numeral);
  };

  const isChordSelected = (numeral: string) => {
    return state.selectedChords.some(chord => chord.numeral === numeral);
  };

  return (
    <div className="chord-palette">
      <div className="chord-palette-header">
        <h3>Chords in {state.selectedKey} {state.mode}</h3>
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