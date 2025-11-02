import React, { useRef, useEffect } from 'react';
import { useMusic } from '../hooks/useMusic';
import { useAudioEngine } from '../hooks/useAudioEngine';
import { getChordFrequencies } from '../utils/musicTheory';
import type { ChordInProgression } from '../types/music';
import './ChordTimeline.css';

export function ChordTimeline() {
  const { state, actions } = useMusic();
  const { playChord } = useAudioEngine();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentIndexRef = useRef(0);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // Handle playback start/stop
  const handlePlayPause = () => {
    if (state.playbackState.isPlaying) {
      // Stop playback
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      actions.setPlaybackPlaying(false);
      actions.setPlaybackBeat(0);
      currentIndexRef.current = 0;
    } else {
      // Start playback
      if (state.chordProgression.length === 0) return;

      actions.setPlaybackPlaying(true);
      currentIndexRef.current = 0;
      actions.setPlaybackBeat(0);

      const msPerBeat = 60000 / state.playbackState.tempo;

      // Play first chord immediately
      const firstChord = state.chordProgression[0];
      if (firstChord) {
        const frequencies = getChordFrequencies(firstChord.rootNote, firstChord.intervals, 4);
        playChord(frequencies, firstChord.duration * (msPerBeat / 1000));
      }

      // Set up interval for subsequent chords
      let chordIndex = 0;
      let beatCount = 0;

      intervalRef.current = setInterval(() => {
        beatCount++;

        // Check if we need to move to next chord
        const currentChord = state.chordProgression[chordIndex];
        if (currentChord && beatCount >= currentChord.duration) {
          beatCount = 0;
          chordIndex++;

          if (chordIndex >= state.chordProgression.length) {
            if (state.playbackState.loop) {
              chordIndex = 0;
            } else {
              // Stop playback
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              actions.setPlaybackPlaying(false);
              actions.setPlaybackBeat(0);
              return;
            }
          }

          // Play next chord
          const nextChord = state.chordProgression[chordIndex];
          if (nextChord) {
            const frequencies = getChordFrequencies(nextChord.rootNote, nextChord.intervals, 4);
            playChord(frequencies, nextChord.duration * (msPerBeat / 1000));
            actions.setPlaybackBeat(chordIndex);
          }
        }
      }, msPerBeat);
    }
  };

  const handleRemoveChord = (id: string) => {
    // Stop playback if playing
    if (state.playbackState.isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      actions.setPlaybackPlaying(false);
      actions.setPlaybackBeat(0);
    }
    actions.removeFromProgression(id);
  };

  const handlePlayChord = (chord: ChordInProgression) => {
    // Calculate frequencies for the chord notes
    const frequencies = getChordFrequencies(chord.rootNote, chord.intervals, 4);
    playChord(frequencies);
  };

  const handleClearProgression = () => {
    // Stop playback if playing
    if (state.playbackState.isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      actions.setPlaybackPlaying(false);
      actions.setPlaybackBeat(0);
    }
    actions.clearProgression();
  };

  const totalDuration = state.chordProgression.reduce(
    (sum, chord) => sum + chord.duration,
    0
  );

  return (
    <div className="chord-timeline">
      <div className="timeline-header">
        <h3>Chord Progression</h3>
        <div className="timeline-controls">
          <span className="duration-info">
            {state.chordProgression.length} chords • {totalDuration} beats
          </span>
          {state.chordProgression.length > 0 && (
            <button
              className="clear-button"
              onClick={handleClearProgression}
              title="Clear progression"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="timeline-track">
        {state.chordProgression.length === 0 ? (
          <div className="empty-state">
            Click chords from the palette to build your progression
          </div>
        ) : (
          <div className="chord-sequence">
            {state.chordProgression.map((chord, index) => (
              <div
                key={chord.id}
                className={`chord-block ${state.playbackState.isPlaying && state.playbackState.currentBeat === index ? 'playing' : ''}`}
                style={{
                  '--duration': chord.duration,
                } as React.CSSProperties}
              >
                <div className="chord-block-content">
                  <span className="chord-numeral">{chord.numeral}</span>
                  <span className="chord-root">{chord.rootNote}</span>
                  <span className="chord-duration">{chord.duration} beats</span>
                </div>
                <div className="chord-block-actions">
                  <button
                    className="play-chord-btn"
                    onClick={() => handlePlayChord(chord)}
                    title="Play chord"
                  >
                    ▶
                  </button>
                  <button
                    className="remove-chord-btn"
                    onClick={() => handleRemoveChord(chord.id)}
                    title="Remove chord"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="timeline-footer">
        <div className="playback-controls">
          <button
            className="play-button"
            onClick={handlePlayPause}
          >
            {state.playbackState.isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button
            className={`loop-button ${state.playbackState.loop ? 'active' : ''}`}
            onClick={() => actions.toggleLoop()}
          >
            🔁 Loop
          </button>
          <div className="tempo-control">
            <label>Tempo:</label>
            <input
              type="number"
              min="60"
              max="180"
              value={state.playbackState.tempo}
              onChange={(e) => actions.setTempo(parseInt(e.target.value) || 120)}
            />
            <span>BPM</span>
          </div>
        </div>
      </div>
    </div>
  );
}