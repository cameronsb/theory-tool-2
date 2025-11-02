import { Piano } from './Piano';
import { ChordDisplay } from './ChordDisplay';
import './LearnMode.css';

export function LearnMode() {
  return (
    <div className="learn-mode">
      <div className="piano-section">
        <Piano startOctave={4} octaveCount={2} showScaleDegrees={true} />
      </div>
      <ChordDisplay />
    </div>
  );
}
