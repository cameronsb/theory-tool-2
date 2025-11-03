/**
 * Configuration Index
 *
 * Central export point for all application configuration.
 * Import from here instead of individual config files for convenience.
 *
 * @example
 * ```typescript
 * import { COLORS, CHORD_MODIFIERS, DRUM_SOUNDS, NOTES } from '../config';
 * ```
 */

// Re-export all UI configuration
export * from './ui';

// Re-export all chord configuration
export * from './chords';

// Re-export all audio configuration
export * from './audio';

// Re-export all music configuration
export * from './music';

// Re-export types for convenience
export type { ChordModifier, ChordGroup } from '../types/chords';
export type { AudioEngine, PlaybackState, DrumSynthConfig, VolumeSettings } from '../types/audio';

