/**
 * Chord Configuration
 *
 * Centralized configuration for all chord-related constants including:
 * - Chord modifiers (7th, 9th, sus, dim, aug, etc.)
 * - Diatonic chord groupings by harmonic function
 * - Borrowed chord groupings by emotional quality
 *
 * This file enables easy customization of chord theory and harmonic groupings.
 */

import type { ChordModifier } from '../types/chords';

/**
 * Chord modifiers for harmonic variations
 *
 * Organized in 2 rows of 6 for complete harmonic palette:
 * - Row 1: Seventh chords, suspended, and altered triads
 * - Row 2: Extended harmony and added tones
 *
 * Intervals are in semitones from root (0=root, 12=octave)
 */
export const CHORD_MODIFIERS: ChordModifier[] = [
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

/**
 * Diatonic chord groups by harmonic function
 *
 * Groups chords by their role in progressions:
 * - Tonic: Stable, home, resolution
 * - Subdominant: Departure, movement away
 * - Dominant: Tension, wants to resolve
 * - Mediant: Transitional, ambiguous
 */
export const DIATONIC_GROUPS = {
  major: {
    tonic: {
      label: 'Tonic (Stable, Home)',
      numerals: ['I', 'vi']
    },
    subdominant: {
      label: 'Subdominant (Departure)',
      numerals: ['ii', 'IV']
    },
    dominant: {
      label: 'Dominant (Tension)',
      numerals: ['V', 'vii°']
    },
    mediant: {
      label: 'Mediant (Transitional)',
      numerals: ['iii']
    },
  },
  minor: {
    tonic: {
      label: 'Tonic (Stable, Home)',
      numerals: ['i', 'VI']
    },
    subdominant: {
      label: 'Subdominant (Departure)',
      numerals: ['ii°', 'iv']
    },
    dominant: {
      label: 'Dominant (Tension)',
      numerals: ['v', 'VII']
    },
    mediant: {
      label: 'Mediant (Transitional)',
      numerals: ['III']
    },
  },
} as const;

/**
 * Borrowed chord groups by emotional quality
 *
 * Borrowed chords (modal interchange) create specific moods:
 * - Darkening: Add melancholy or tension
 * - Brightening: Add brightness or lift
 * - Resolving: Provide alternative resolution
 */
export const BORROWED_GROUPS = {
  major: {
    darkening: {
      label: 'Darkening/Emotional',
      numerals: ['iv', 'bIII']
    },
    brightening: {
      label: 'Brightening/Modal',
      numerals: ['bVI', 'bVII']
    },
  },
  minor: {
    brightening: {
      label: 'Brightening/Uplifting',
      numerals: ['IV', 'VI', 'III']
    },
    resolving: {
      label: 'Resolving',
      numerals: ['VII']
    },
  },
} as const;

/**
 * Grid layout for chord modifiers
 * Defines the button grid structure
 */
export const MODIFIER_GRID = {
  columns: 6,      // 6 modifiers per row
  rows: 2,         // 2 rows total
  buttonWidth: 50, // pixels
  buttonHeight: 40, // pixels
  gap: 6,          // pixels between buttons
} as const;

