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

const CHORD_MODIFIERS: ChordModifier[] = [
  { label: '7', intervalToAdd: 10 },
  { label: 'maj7', intervalToAdd: 11 },
  { label: '9', intervalToAdd: 14 },
  { label: '11', intervalToAdd: 17 },
  { label: '13', intervalToAdd: 21 },
  { label: 'sus2', replaceWith: [0, 2, 7] },
  { label: 'sus4', replaceWith: [0, 5, 7] },
  { label: 'add9', intervalToAdd: 14 },
];

interface ChordCardProps {
  numeral: string;
  rootNote: Note;
  intervals: number[];
  type: ChordType;
  isDiatonic?: boolean;
}

export function ChordCard({ numeral, rootNote, intervals, type, isDiatonic = true }: ChordCardProps) {
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

    if (baseType === 'min') {
      name += 'm';
    } else if (baseType === 'dim') {
      name += '°';
    }

    const modArray = Array.from(activeModifiers);
    if (modArray.includes('sus2') || modArray.includes('sus4')) {
      const sus = modArray.find(m => m.startsWith('sus'));
      name = rootNote + sus;
    }

    modArray.forEach(mod => {
      if (!mod.startsWith('sus')) {
        name += mod;
      }
    });

    return name;
  };

  const availableModifiers = intervals.length === 3
    ? CHORD_MODIFIERS
    : CHORD_MODIFIERS.filter(m => m.label !== '7' && m.label !== 'maj7');

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

