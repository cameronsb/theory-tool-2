import React, { useState } from 'react';
import type { Note, ChordType } from '../types/music';
import { getFullChordName, getChordFrequencies, NOTES } from '../utils/musicTheory';
import { useMusic } from '../hooks/useMusic';
import './ChordCard.css';

interface ChordModifier {
  label: string;
  intervalToAdd?: number;
  intervalsToAdd?: number[]; // For extended chords that add multiple intervals
  intervalToRemove?: number;
  replaceWith?: number[];
}

// Organized in 2 rows of 6 for complete harmonic palette
// Row 1: Seventh chords, suspended, and altered triads
// Row 2: Extended harmony and added tones
const CHORD_MODIFIERS: ChordModifier[] = [
  // Row 1: Seventh chords, suspended, diminished
  { label: '7', intervalToAdd: 10 },           // Dominant 7th: adds b7
  { label: 'maj7', intervalToAdd: 11 },        // Major 7th: adds maj7
  { label: '6', intervalToAdd: 9 },            // Major 6th: adds 6th
  { label: 'sus2', replaceWith: [0, 2, 7] },   // Suspended 2nd: replaces 3rd with 2nd
  { label: 'sus4', replaceWith: [0, 5, 7] },   // Suspended 4th: replaces 3rd with 4th
  { label: 'dim', replaceWith: [0, 3, 6] },    // Diminished triad: b3 + b5

  // Row 2: Extended chords and augmented
  { label: '9', intervalsToAdd: [10, 14] },      // Dominant 9th: b7 + 9th
  { label: 'maj9', intervalsToAdd: [11, 14] },   // Major 9th: maj7 + 9th
  { label: '11', intervalsToAdd: [10, 14, 17] }, // Dominant 11th: b7 + 9th + 11th
  { label: '13', intervalsToAdd: [10, 14, 21] }, // Dominant 13th: b7 + 9th + 13th
  { label: 'add9', intervalToAdd: 14 },          // Add 9: just 9th (no 7th)
  { label: 'aug', replaceWith: [0, 4, 8] },      // Augmented triad: major 3rd + #5
];

interface ChordCardProps {
  numeral: string;
  rootNote: Note;
  intervals: number[];
  type: ChordType;
  isDiatonic?: boolean;
  compact?: boolean; // deprecated, use variationMode instead
  variationMode?: 'buttons' | 'select';
}

export function ChordCard({
  numeral,
  rootNote,
  intervals,
  type,
  isDiatonic = true,
  compact = false,
  variationMode = 'buttons'
}: ChordCardProps) {
  const [activeModifiers, setActiveModifiers] = useState<Set<string>>(new Set());
  const [currentIntervals, setCurrentIntervals] = useState<number[]>(intervals);
  const { audio, actions, state } = useMusic();

  // Backwards compatibility: if compact prop is used, override variationMode
  const effectiveMode = compact ? 'select' : variationMode;

  // Check if this chord is currently selected on the keyboard
  const isChordSelected = state.selectedChords.length > 0 &&
    state.selectedChords[0].rootNote === rootNote &&
    state.selectedChords[0].numeral === numeral &&
    JSON.stringify(state.selectedChords[0].intervals) === JSON.stringify(currentIntervals);

  const applyModifier = (modifier: ChordModifier) => {
    const newModifiers = new Set(activeModifiers);

    if (activeModifiers.has(modifier.label)) {
      newModifiers.delete(modifier.label);
    } else {
      newModifiers.add(modifier.label);
    }

    let newIntervals = [...intervals];

    newModifiers.forEach(modLabel => {
      const mod = CHORD_MODIFIERS.find(m => m.label === modLabel);
      if (!mod) return;

      if (mod.replaceWith) {
        newIntervals = mod.replaceWith;
      } else if (mod.intervalsToAdd) {
        // Add multiple intervals (for extended chords like 9, 11, 13)
        mod.intervalsToAdd.forEach(interval => {
          if (!newIntervals.includes(interval)) {
            newIntervals.push(interval);
          }
        });
      } else if (mod.intervalToAdd !== undefined) {
        if (!newIntervals.includes(mod.intervalToAdd)) {
          newIntervals.push(mod.intervalToAdd);
        }
      } else if (mod.intervalToRemove !== undefined) {
        newIntervals = newIntervals.filter(i => i !== mod.intervalToRemove);
      }
    });

    newIntervals.sort((a, b) => a - b);

    setActiveModifiers(newModifiers);
    setCurrentIntervals(newIntervals);

    // Play the modified chord
    try {
      const frequencies = getChordFrequencies(rootNote, newIntervals);
      if (frequencies && frequencies.length > 0) {
        audio.playChord(frequencies, 0.8);
      }
    } catch (error) {
      console.error('Error playing chord:', error);
    }

    // If keyboard preview is enabled, update the keyboard selection
    if (state.keyboardPreviewEnabled) {
      actions.selectChord(rootNote, newIntervals, numeral);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLabel = e.target.value;

    if (!selectedLabel) {
      // Reset to base chord
      setActiveModifiers(new Set());
      setCurrentIntervals(intervals);

      // Play the base chord
      try {
        const frequencies = getChordFrequencies(rootNote, intervals);
        if (frequencies && frequencies.length > 0) {
          audio.playChord(frequencies, 0.8);
        }
      } catch (error) {
        console.error('Error playing chord:', error);
      }

      // If keyboard preview is enabled, update the keyboard selection
      if (state.keyboardPreviewEnabled) {
        actions.selectChord(rootNote, intervals, numeral);
      }
      return;
    }

    const modifier = CHORD_MODIFIERS.find(m => m.label === selectedLabel);
    if (!modifier) return;

    const newModifiers = new Set([selectedLabel]);
    let newIntervals = [...intervals];

    if (modifier.replaceWith) {
      newIntervals = modifier.replaceWith;
    } else if (modifier.intervalsToAdd) {
      // Add multiple intervals (for extended chords like 9, 11, 13)
      modifier.intervalsToAdd.forEach(interval => {
        if (!newIntervals.includes(interval)) {
          newIntervals.push(interval);
        }
      });
    } else if (modifier.intervalToAdd !== undefined) {
      if (!newIntervals.includes(modifier.intervalToAdd)) {
        newIntervals.push(modifier.intervalToAdd);
      }
    } else if (modifier.intervalToRemove !== undefined) {
      newIntervals = newIntervals.filter(i => i !== modifier.intervalToRemove);
    }

    newIntervals.sort((a, b) => a - b);

    setActiveModifiers(newModifiers);
    setCurrentIntervals(newIntervals);

    // Play the modified chord
    try {
      const frequencies = getChordFrequencies(rootNote, newIntervals);
      if (frequencies && frequencies.length > 0) {
        audio.playChord(frequencies, 0.8);
      }
    } catch (error) {
      console.error('Error playing chord:', error);
    }

    // If keyboard preview is enabled, update the keyboard selection
    if (state.keyboardPreviewEnabled) {
      actions.selectChord(rootNote, newIntervals, numeral);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Ignore clicks on modifier buttons and select dropdowns
    const target = e.target as HTMLElement;
    if (target.classList.contains('modifier-btn') ||
        target.tagName === 'SELECT' ||
        target.closest('.modifier-buttons-grid') ||
        target.closest('.variations-select')) {
      return;
    }

    // Play the chord sound
    try {
      const frequencies = getChordFrequencies(rootNote, currentIntervals);
      if (frequencies && frequencies.length > 0) {
        audio.playChord(frequencies, 0.8);
      }
    } catch (error) {
      console.error('Error playing chord:', error);
    }

    // If keyboard preview is enabled, also select the chord to show on keyboard
    if (state.keyboardPreviewEnabled) {
      const isSelected = state.selectedChords.length > 0 &&
        state.selectedChords[0].rootNote === rootNote &&
        state.selectedChords[0].numeral === numeral &&
        JSON.stringify(state.selectedChords[0].intervals) === JSON.stringify(currentIntervals);

      if (isSelected) {
        // Deselect if already selected
        actions.deselectChords();
      } else {
        // Select this chord
        actions.selectChord(rootNote, currentIntervals, numeral);
      }
    }
  };

  const getChordDisplayName = () => {
    if (activeModifiers.size === 0) {
      return getFullChordName(rootNote, intervals);
    }

    let name = rootNote;
    const baseType = type;
    const modArray = Array.from(activeModifiers);

    // Handle diminished - replaces entire triad
    if (modArray.includes('dim')) {
      return rootNote + '°';
    }

    // Handle augmented - replaces entire triad
    if (modArray.includes('aug')) {
      return rootNote + '+';
    }

    // Handle sus chords - they replace the quality and take priority
    if (modArray.includes('sus2') || modArray.includes('sus4')) {
      const sus = modArray.find(m => m.startsWith('sus'));
      name = rootNote + sus;

      // Can still add extensions to sus chords
      const extensions = modArray.filter(m => !m.startsWith('sus') && !m.includes('7'));
      if (extensions.length > 0) {
        name += extensions.join('');
      }

      return name;
    }

    // Add base quality (minor/diminished from base type)
    if (baseType === 'min') {
      name += 'm';
    } else if (baseType === 'dim') {
      name += '°';
    }

    // Determine the highest/dominant extension
    // Priority: 13 > 11 > maj9/9 > maj7/7/6
    const hasThirteenth = modArray.includes('13');
    const hasEleventh = modArray.includes('11');
    const hasNinth = modArray.includes('9');
    const hasMaj9 = modArray.includes('maj9');
    const hasMaj7 = modArray.includes('maj7');
    const hasSeventh = modArray.includes('7');
    const hasSix = modArray.includes('6');
    const hasAdd9 = modArray.includes('add9');

    // If we have 13, it implies 9 and 11, so just show 13
    if (hasThirteenth) {
      name += '13';
    }
    // If we have 11, it implies 9, so just show 11
    else if (hasEleventh) {
      name += '11';
    }
    // Major 9th (maj7 + 9th)
    else if (hasMaj9) {
      name += 'maj9';
    }
    // Dominant 9th (b7 + 9th)
    else if (hasNinth) {
      name += '9';
    }
    // Just 7th chords
    else if (hasMaj7) {
      name += 'maj7';
    } else if (hasSeventh) {
      name += '7';
    } else if (hasSix) {
      name += '6';
    }
    // add9 is different - it doesn't imply a 7th
    else if (hasAdd9) {
      name += 'add9';
    }

    return name;
  };

  const availableModifiers = intervals.length === 3
    ? CHORD_MODIFIERS
    : CHORD_MODIFIERS.filter(m => m.label !== '7' && m.label !== 'maj7');

  // Helper: Get interval label for display (1, 3, 5, ♭7, 9, etc.)
  const getIntervalLabel = (interval: number): string => {
    const labels: Record<number, string> = {
      0: '1',
      1: '♭2',
      2: '2',
      3: '♭3',
      4: '3',
      5: '4',
      6: '♭5',
      7: '5',
      8: '♯5',
      9: '6',
      10: '♭7',
      11: '7',
      14: '9',
      17: '11',
      21: '13',
    };
    return labels[interval] || String(interval);
  };

  // Piano key visualization component
  const PianoVisualization = () => {
    const whiteKeyPositions = [0, 2, 4, 5, 7, 9, 11]; // C, D, E, F, G, A, B
    const blackKeyPositions = [
      { key: 1, x: 8 },    // C#
      { key: 3, x: 18 },   // D#
      { key: 6, x: 38 },   // F#
      { key: 8, x: 48 },   // G#
      { key: 10, x: 58 }   // A#
    ];

    // Get the chromatic position of the root note (0-11 where C=0)
    const rootIndex = NOTES.indexOf(rootNote);

    // Calculate which chromatic keys should be highlighted
    // Map chord intervals to actual chromatic positions based on root note
    const activeKeys = new Map<number, number>(); // chromatic position -> interval
    currentIntervals.forEach(interval => {
      const chromaticPosition = (rootIndex + interval) % 12;
      activeKeys.set(chromaticPosition, interval);
    });

    // TODO: Handle overlapping labels for adjacent chromatic notes
    // When chords have adjacent semitones (e.g., ♭3 and 9 in a minor add9),
    // the interval labels can overlap and become hard to read.
    // Potential solutions:
    // 1. Detect adjacent active notes and offset labels horizontally (dx attribute)
    // 2. Add text-stroke or text-shadow for better contrast
    // 3. Use abbreviated labels for crowded situations (e.g., "♭3" → "3")
    // 4. Adjust font size dynamically based on number of active notes
    // Example case: Dm(add9) has ♭3 at D# and 9 at E (adjacent keys)

    const isNoteActive = (chromaticKey: number) => activeKeys.has(chromaticKey);
    const getNoteLabel = (chromaticKey: number) => {
      const interval = activeKeys.get(chromaticKey);
      if (interval === undefined) return null;
      return getIntervalLabel(interval);
    };

    // Check if this chord is currently selected
    const isSelected = state.selectedChords.length > 0 &&
      state.selectedChords[0].rootNote === rootNote &&
      state.selectedChords[0].numeral === numeral &&
      JSON.stringify(state.selectedChords[0].intervals) === JSON.stringify(currentIntervals);

    const handlePianoClick = (e: React.MouseEvent) => {
      // Stop propagation to prevent card click handler from firing
      e.stopPropagation();

      // Play the chord sound
      try {
        const frequencies = getChordFrequencies(rootNote, currentIntervals);
        if (frequencies && frequencies.length > 0) {
          audio.playChord(frequencies, 0.8);
        }
      } catch (error) {
        console.error('Error playing chord:', error);
      }

      // Only toggle selection if keyboard preview is enabled
      if (!state.keyboardPreviewEnabled) {
        return;
      }

      // Toggle selection on keyboard
      if (isSelected) {
        // Toggle off - deselect the chord
        actions.deselectChords();
      } else {
        // Select this chord to light up the piano keys
        actions.selectChord(rootNote, currentIntervals, numeral);
      }
    };

    return (
      <svg
        viewBox="-1 -1 72 38"
        className={`piano-visualization ${isSelected ? 'selected' : ''}`}
        onClick={handlePianoClick}
      >
        {/* White Keys */}
        {whiteKeyPositions.map((keyNum, idx) => {
          const active = isNoteActive(keyNum);
          const label = getNoteLabel(keyNum);
          const x = idx * 10;

          return (
            <g key={keyNum}>
              <rect
                x={x}
                y="0"
                width="10"
                height="24"
                className={`white-key ${active ? "active" : ""}`}
              />
              {label && (
                <text
                  x={x + 5}
                  y="34"
                  fill="white"
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {label}
                </text>
              )}
            </g>
          );
        })}

        {/* Black Keys */}
        {blackKeyPositions.map(({ key, x }) => {
          const active = isNoteActive(key);
          const label = getNoteLabel(key);

          return (
            <g key={key}>
              <rect
                x={x}
                y="0"
                width="4"
                height="14"
                className={`black-key ${active ? "active" : ""}`}
              />
              {label && (
                <text
                  x={x + 2}
                  y="34"
                  fill="white"
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  // Select dropdown mode
  if (effectiveMode === 'select') {
    return (
      <div
        className={`chord-card chord-card-select ${isDiatonic ? 'diatonic' : 'borrowed'} ${isChordSelected ? 'chord-selected' : ''}`}
        onClick={handleCardClick}
      >
        <div className="chord-card-main">
          <div className="chord-info">
            <div className="chord-numeral">{numeral}</div>
            <div className="chord-name">{getChordDisplayName()}</div>
          </div>
          <PianoVisualization />
          <select
            className="variations-select"
            value={Array.from(activeModifiers)[0] || ''}
            onChange={handleSelectChange}
            onClick={(e) => e.stopPropagation()}
          >
            <option value="">-</option>
            {availableModifiers.map(modifier => (
              <option key={modifier.label} value={modifier.label}>
                {modifier.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  // Button mode (default)
  return (
    <div
      className={`chord-card chord-card-buttons ${isDiatonic ? 'diatonic' : 'borrowed'} ${isChordSelected ? 'chord-selected' : ''}`}
      onClick={handleCardClick}
    >
      <div className="chord-card-main">
        <div className="chord-info">
          <div className="chord-numeral">{numeral}</div>
          <div className="chord-name">{getChordDisplayName()}</div>
        </div>
        <PianoVisualization />
        <div className="modifier-buttons-grid" onClick={(e) => e.stopPropagation()}>
          {availableModifiers.map(modifier => (
            <button
              key={modifier.label}
              className={`modifier-btn ${activeModifiers.has(modifier.label) ? 'active' : ''}`}
              onClick={() => applyModifier(modifier)}
              title={`Add ${modifier.label}`}
            >
              {modifier.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

