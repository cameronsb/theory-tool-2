import React, { useMemo, useRef, useState, useCallback } from 'react';
import { useMusic } from '../hooks/useMusic';
import { usePianoLayout } from '../hooks/usePianoLayout';
import { PianoKey } from './PianoKey';
import { generatePianoKeys, getWhiteKeyCount } from '../utils/pianoUtils';
import { getScaleNotes, NOTES } from '../utils/musicTheory';
import type { Note } from '../types/music';
import './Piano.css';

interface PianoProps {
  startOctave?: number;
  octaveCount?: number;
  showScaleDegrees?: boolean;
  flexible?: boolean; // Enable dynamic width (octave count) based on container
  adjustHeight?: boolean; // Enable dynamic height adjustment (disabled by default)
}

export function Piano({
  startOctave = 4,
  octaveCount = 2,
  showScaleDegrees = false,
  flexible = true,
  adjustHeight = false
}: PianoProps) {
  const { state, audio } = useMusic();
  const pianoContainerRef = useRef<HTMLDivElement>(null);
  const [glissandoTouchId, setGlissandoTouchId] = useState<number | null>(null);
  const [lastPlayedKey, setLastPlayedKey] = useState<string | null>(null);

  // Use flexible layout if enabled
  const layout = usePianoLayout(pianoContainerRef as React.RefObject<HTMLDivElement>, {
    startOctave,
    octaveCount,
    adjustHeight,
  });

  // Use layout values if flexible, otherwise use props
  const effectiveStartOctave = flexible ? layout.startOctave : startOctave;
  const effectiveOctaveCount = flexible ? layout.octaveCount : octaveCount;

  // Generate piano keys
  const keys = useMemo(() => {
    return generatePianoKeys(effectiveStartOctave, effectiveOctaveCount);
  }, [effectiveStartOctave, effectiveOctaveCount]);

  const whiteKeyCount = useMemo(() => getWhiteKeyCount(keys), [keys]);

  // Get scale notes for highlighting
  const scaleNotes = useMemo(() => {
    const notes = getScaleNotes(state.song.key, state.song.mode);
    return new Set(notes);
  }, [state.song.key, state.song.mode]);

  // Get chord notes for highlighting
  const chordNotes = useMemo(() => {
    const notes = new Set<Note>();
    state.selectedChords.forEach((chord) => {
      const rootIndex = NOTES.indexOf(chord.rootNote);
      chord.intervals.forEach((interval) => {
        const noteIndex = (rootIndex + interval) % 12;
        notes.add(NOTES[noteIndex]);
      });
    });
    return notes;
  }, [state.selectedChords]);

  const handleKeyPress = async (frequency: number) => {
    await audio.playNote(frequency);
  };

  // Glissando support - sliding finger across keys
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      setGlissandoTouchId(touch.identifier);
      setLastPlayedKey(null); // Reset on new touch
    }
  }, []);

  const handleTouchMove = useCallback(async (e: React.TouchEvent) => {
    if (glissandoTouchId === null) return;

    // Find the active touch
    const touch = Array.from(e.touches).find(t => t.identifier === glissandoTouchId);
    if (!touch) return;

    // Get the element at the touch point
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!element) return;

    // Check if it's a piano key
    const keyElement = element.closest('.piano-key');
    if (!keyElement) return;

    // Get key note from aria-label
    const keyNote = keyElement.getAttribute('aria-label');
    if (!keyNote || keyNote === lastPlayedKey) return;

    // Play the key if it's different from the last one
    const keyData = keys.find(k => k.note === keyNote);
    if (keyData) {
      setLastPlayedKey(keyNote);
      await audio.playNote(keyData.frequency);
    }
  }, [glissandoTouchId, lastPlayedKey, keys, audio]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const changedTouches = Array.from(e.changedTouches);
    if (glissandoTouchId !== null && changedTouches.some(t => t.identifier === glissandoTouchId)) {
      setGlissandoTouchId(null);
      setLastPlayedKey(null);
    }
  }, [glissandoTouchId]);

  return (
    <div className="piano" ref={pianoContainerRef}>
      <div
        className={`piano-keys ${glissandoTouchId !== null ? 'glissando-active' : ''}`}
        style={{
          '--white-key-count': whiteKeyCount,
          '--white-key-width': flexible ? `${layout.whiteKeyWidth}px` : undefined,
          '--white-key-height': flexible ? `${layout.whiteKeyHeight}px` : undefined,
          '--black-key-width': flexible ? `${layout.blackKeyWidth}px` : undefined,
          '--black-key-height': flexible ? `${layout.blackKeyHeight}px` : undefined,
        } as React.CSSProperties}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {keys.map((keyData) => (
          <PianoKey
            key={keyData.note}
            keyData={keyData}
            onPress={handleKeyPress}
            isInScale={state.showInScaleColors && scaleNotes.has(keyData.baseNote)}
            isInChord={chordNotes.has(keyData.baseNote)}
            showScaleDegree={showScaleDegrees}
            selectedKey={state.song.key}
            mode={state.song.mode}
            showScaleLabels={scaleNotes.has(keyData.baseNote)}
          />
        ))}
      </div>
    </div>
  );
}
