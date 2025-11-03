/**
 * Chord Type Definitions
 *
 * Comprehensive type definitions for chord-related functionality including:
 * - Chord modifiers and transformations
 * - Chord groupings and categories
 * - Chord progression types
 */

/**
 * Chord modifier transformation rules
 * Defines how chord modifiers transform the base chord intervals
 */
export interface ChordModifier {
  /** Display label (e.g., '7', 'maj7', 'sus4') */
  label: string;

  /** Add a single interval (in semitones from root) */
  intervalToAdd?: number;

  /** Add multiple intervals (for extended chords like 9th, 11th, 13th) */
  intervalsToAdd?: number[];

  /** Remove a specific interval from the chord */
  intervalToRemove?: number;

  /** Replace the entire chord structure (for sus, dim, aug) */
  replaceWith?: number[];
}

/**
 * Chord group definition
 * Groups chords by harmonic function or emotional quality
 */
export interface ChordGroup {
  /** Display label for the group (e.g., 'Tonic (Stable, Home)') */
  label: string;

  /** Roman numerals of chords in this group (e.g., ['I', 'vi']) */
  numerals: string[];
}

/**
 * Chord grouping by harmonic function
 * Used for diatonic chords in major and minor keys
 */
export interface ChordGrouping {
  tonic: ChordGroup;
  subdominant: ChordGroup;
  dominant: ChordGroup;
  mediant: ChordGroup;
}

/**
 * Borrowed chord grouping by emotional quality
 * Used for modal interchange chords
 */
export interface BorrowedChordGrouping {
  darkening?: ChordGroup;
  brightening?: ChordGroup;
  resolving?: ChordGroup;
}

/**
 * Chord display mode
 * Controls how chords are rendered in the UI
 */
export type ChordDisplayMode = 'select' | 'build';

/**
 * Chord variation mode
 * Controls how chord modifiers are presented
 */
export type ChordVariationMode = 'buttons' | 'select';

/**
 * Sort mode for chord display
 * Controls the order of chords in the UI
 */
export type ChordSortMode = 'default' | 'grouped';

/**
 * Chord quality types
 * Basic chord types before modifiers are applied
 */
export type ChordQuality =
  | 'major'
  | 'minor'
  | 'diminished'
  | 'augmented'
  | 'sus2'
  | 'sus4';

/**
 * Extended chord qualities
 * Full chord types including extensions
 */
export type ExtendedChordQuality =
  | ChordQuality
  | 'maj7'
  | 'min7'
  | 'dom7'
  | 'maj9'
  | 'min9'
  | 'dom9'
  | 'maj11'
  | 'dom11'
  | 'maj13'
  | 'dom13'
  | 'add9'
  | 'add11'
  | '6'
  | 'min6'
  | 'dim7'
  | 'half-dim7';

/**
 * Chord modifier state
 * Tracks which modifiers are currently active on a chord
 */
export interface ChordModifierState {
  /** Base chord intervals before modifiers */
  baseIntervals: number[];

  /** Current intervals after modifiers applied */
  currentIntervals: number[];

  /** Set of active modifier labels */
  activeModifiers: Set<string>;
}

/**
 * Chord card layout props
 * Configuration for how a chord card is displayed
 */
export interface ChordCardLayout {
  /** Whether to show the mini piano preview */
  showMiniPreview: boolean;

  /** Variation mode for modifiers */
  variationMode: ChordVariationMode;

  /** Whether the card is compact */
  compact: boolean;

  /** Whether this is a diatonic or borrowed chord */
  isDiatonic: boolean;
}

/**
 * Chord progression step
 * Represents one chord in a progression with timing
 */
export interface ChordProgressionStep {
  /** Unique identifier */
  id: string;

  /** Roman numeral (e.g., 'I', 'IV', 'V') */
  numeral: string;

  /** Root note */
  rootNote: string;

  /** Chord intervals (in semitones from root) */
  intervals: number[];

  /** Duration in beats or eighths */
  duration: number;

  /** Optional chord quality label */
  quality?: ExtendedChordQuality;
}

/**
 * Chord analysis result
 * Information about a chord's harmonic function
 */
export interface ChordAnalysis {
  /** Roman numeral in current key */
  numeral: string;

  /** Harmonic function (tonic, subdominant, dominant, mediant) */
  function: 'tonic' | 'subdominant' | 'dominant' | 'mediant' | 'borrowed';

  /** Whether this is a diatonic chord in the current key */
  isDiatonic: boolean;

  /** Chord quality */
  quality: ExtendedChordQuality;

  /** Scale degree (1-7) */
  scaleDegree: number;
}

