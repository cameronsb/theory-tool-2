import React, { useState } from 'react';
import { useMusic } from '../hooks/useMusic';
import { ChordPalette } from './ChordPalette';
import { ChordTimeline } from './ChordTimeline';
import { DrumTrack } from './DrumTrack';
import { Piano } from './Piano';
import './BuildMode.css';

type BottomView = 'piano' | 'drums';

export function BuildMode() {
  const { actions } = useMusic();
  const [bottomView, setBottomView] = useState<BottomView>('piano');

  // Set to build mode when component mounts
  React.useEffect(() => {
    actions.setChordDisplayMode('build');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="build-mode">
      <div className="build-mode-top">
        <div className="chord-palette-container">
          <ChordPalette />
        </div>
        <div className="timeline-container">
          <ChordTimeline />
        </div>
      </div>
      <div className="build-mode-bottom">
        <div className="bottom-view-tabs">
          <button
            className={`view-tab ${bottomView === 'piano' ? 'active' : ''}`}
            onClick={() => setBottomView('piano')}
          >
            Piano
          </button>
          <button
            className={`view-tab ${bottomView === 'drums' ? 'active' : ''}`}
            onClick={() => setBottomView('drums')}
          >
            Drums
          </button>
        </div>
        <div className="bottom-view-content">
          {bottomView === 'piano' && <Piano showScaleDegrees={false} />}
          {bottomView === 'drums' && <DrumTrack />}
        </div>
      </div>
    </div>
  );
}
