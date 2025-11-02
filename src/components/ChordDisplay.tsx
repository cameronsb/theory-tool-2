import { useMusic } from '../hooks/useMusic';
import { getScaleChords } from '../utils/musicTheory';
import { ChordCard } from './ChordCard';
import './ChordDisplay.css';

export function ChordDisplay() {
  const { state } = useMusic();
  const { key, mode } = state.song;

  const diatonicChords = getScaleChords(key, mode);

  return (
    <div className="chord-display">
      <div className="chord-section">
        <h3 className="section-title">Diatonic Chords in {key} {mode}</h3>
        <div className="chord-grid">
          {diatonicChords.map((chord) => (
            <ChordCard
              key={chord.numeral}
              numeral={chord.numeral}
              rootNote={chord.rootNote}
              intervals={chord.intervals}
              type={chord.type}
              isDiatonic={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

