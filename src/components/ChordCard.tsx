import React, { useState } from 'react';
import type { Note, ChordType } from '../types/music';
import { getFullChordName, getChordFrequencies } from '../utils/musicTheory';
import { useMusic } from '../hooks/useMusic';
import './ChordCard.css';

interface ChordModifier {
  label: string;
  intervalToAdd?: number;
  intervalToRemove?: number;
  replaceWith?: number[];
}

// Organized in 2 rows for pedagogical grouping
// Row 1: Seventh chords and sus alterations
// Row 2: Extended harmony (9, 11, 13)
const CHORD_MODIFIERS: ChordModifier[] = [
  // Row 1: Core alterations
  { label: '7', intervalToAdd: 10 },
  { label: 'maj7', intervalToAdd: 11 },
  { label: 'sus2', replaceWith: [0, 2, 7] },
  { label: 'sus4', replaceWith: [0, 5, 7] },
  // Row 2: Extensions
  { label: '9', intervalToAdd: 14 },
  { label: 'add9', intervalToAdd: 14 },
  { label: '11', intervalToAdd: 17 },
  { label: '13', intervalToAdd: 21 },
];

interface ChordCardProps {
  numeral: string;
  rootNote: Note;
  intervals: number[];
  type: ChordType;
  isDiatonic?: boolean;
  compact?: boolean;
}

export function ChordCard({ numeral, rootNote, intervals, type, isDiatonic = true, compact = false }: ChordCardProps) {
  const [activeModifiers, setActiveModifiers] = useState<Set<string>>(new Set());
  const [currentIntervals, setCurrentIntervals] = useState<number[]>(intervals);
  const { audio } = useMusic();

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
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLabel = e.target.value;

    if (!selectedLabel) {
      // Reset to base chord
      setActiveModifiers(new Set());
      setCurrentIntervals(intervals);
      return;
    }

    const modifier = CHORD_MODIFIERS.find(m => m.label === selectedLabel);
    if (!modifier) return;

    const newModifiers = new Set([selectedLabel]);
    let newIntervals = [...intervals];

    if (modifier.replaceWith) {
      newIntervals = modifier.replaceWith;
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
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Ignore clicks on modifier buttons
    if ((e.target as HTMLElement).classList.contains('modifier-btn')) {
      return;
    }

    try {
      const frequencies = getChordFrequencies(rootNote, currentIntervals);
      if (frequencies && frequencies.length > 0) {
        audio.playChord(frequencies, 0.8);
      }
    } catch (error) {
      console.error('Error playing chord:', error);
    }
  };

  const getChordDisplayName = () => {
    if (activeModifiers.size === 0) {
      return getFullChordName(rootNote, intervals);
    }

    let name = rootNote;
    const baseType = type;
    const modArray = Array.from(activeModifiers);

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

    // Add base quality (minor/diminished)
    if (baseType === 'min') {
      name += 'm';
    } else if (baseType === 'dim') {
      name += '°';
    }

    // Determine the highest/dominant extension
    // Priority: 13 > 11 > 9 > maj7/7
    const hasThirteenth = modArray.includes('13');
    const hasEleventh = modArray.includes('11');
    const hasNinth = modArray.includes('9');
    const hasMaj7 = modArray.includes('maj7');
    const hasSeventh = modArray.includes('7');
    const hasAdd9 = modArray.includes('add9');

    // If we have 13, it implies 9 and 11, so just show 13
    if (hasThirteenth) {
      name += hasMaj7 ? 'maj13' : '13';
    }
    // If we have 11, it implies 9, so just show 11
    else if (hasEleventh) {
      name += hasMaj7 ? 'maj11' : '11';
    }
    // If we have 9, show it (7 or maj7 is implied by extended chords)
    else if (hasNinth) {
      name += hasMaj7 ? 'maj9' : '9';
    }
    // Just 7th chords
    else if (hasMaj7) {
      name += 'maj7';
    } else if (hasSeventh) {
      name += '7';
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

  if (compact) {
    return (
      <div
        className={`chord-card chord-card-compact ${isDiatonic ? 'diatonic' : 'borrowed'}`}
        onClick={handleCardClick}
      >
        <div className="chord-card-main">
          <div className="chord-info">
            <div className="chord-numeral">{numeral}</div>
            <div className="chord-name">{getChordDisplayName()}</div>
          </div>
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

  return (
    <div
      className={`chord-card ${isDiatonic ? 'diatonic' : 'borrowed'}`}
      onClick={handleCardClick}
    >
      <div className="chord-card-main">
        <div className="chord-info">
          <div className="chord-numeral">{numeral}</div>
          <div className="chord-name">{getChordDisplayName()}</div>
        </div>
        <div className="modifier-buttons" onClick={(e) => e.stopPropagation()}>
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

