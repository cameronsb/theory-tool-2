/**
 * Branded Types for Type Safety
 *
 * Branded types (also called "opaque types" or "nominal types") prevent accidental
 * mixing of values that have the same runtime type but different semantic meanings.
 *
 * For example, this prevents accidentally using a Volume (0-1) value as a MIDI note (0-127).
 *
 * @example
 * ```typescript
 * const vol = createVolume(0.5); // Volume
 * const midi = createMIDINote(60); // MIDINote
 *
 * // TypeScript error: Type 'Volume' is not assignable to type 'MIDINote'
 * const wrong: MIDINote = vol;
 * ```
 */

/**
 * Volume level (0.0 to 1.0 range)
 * Used for all volume/gain controls in the audio system
 */
export type Volume = number & { readonly __brand: 'Volume' };

/**
 * Create a validated Volume value
 * @param value - Number between 0 and 1
 * @returns Branded Volume type
 * @throws Error if value is outside valid range
 */
export function createVolume(value: number): Volume {
  if (value < 0 || value > 1) {
    throw new Error(`Volume must be between 0 and 1, got ${value}`);
  }
  return value as Volume;
}

/**
 * Check if a number is a valid volume (without creating branded type)
 */
export function isValidVolume(value: number): boolean {
  return value >= 0 && value <= 1;
}

/**
 * Clamp a number to valid volume range
 */
export function clampVolume(value: number): Volume {
  return Math.max(0, Math.min(1, value)) as Volume;
}

/**
 * Tempo in beats per minute (BPM)
 * Used for song tempo and playback speed
 */
export type BPM = number & { readonly __brand: 'BPM' };

/**
 * Create a validated BPM value
 * @param value - Positive number (typically 40-300)
 * @returns Branded BPM type
 * @throws Error if value is not positive
 */
export function createBPM(value: number): BPM {
  if (value <= 0) {
    throw new Error(`BPM must be positive, got ${value}`);
  }
  if (value > 300) {
    console.warn(`BPM ${value} is unusually high. Typical range is 40-300.`);
  }
  return value as BPM;
}

/**
 * Check if a number is a valid BPM
 */
export function isValidBPM(value: number): boolean {
  return value > 0 && value <= 1000; // Allow very high values but cap at 1000
}

/**
 * Frequency in hertz (Hz)
 * Used for audio oscillator frequencies and pitch calculations
 */
export type Frequency = number & { readonly __brand: 'Frequency' };

/**
 * Create a validated Frequency value
 * @param value - Positive number in Hz
 * @returns Branded Frequency type
 * @throws Error if value is not positive
 */
export function createFrequency(value: number): Frequency {
  if (value <= 0) {
    throw new Error(`Frequency must be positive, got ${value}`);
  }
  return value as Frequency;
}

/**
 * Check if a number is a valid frequency
 */
export function isValidFrequency(value: number): boolean {
  return value > 0 && value < 20000; // Human hearing range: 20 Hz - 20 kHz
}

/**
 * MIDI note number (0-127)
 * Standard MIDI note range where 60 = Middle C, 69 = A4 (440 Hz)
 */
export type MIDINote = number & { readonly __brand: 'MIDINote' };

/**
 * Create a validated MIDI note value
 * @param value - Integer between 0 and 127
 * @returns Branded MIDINote type
 * @throws Error if value is outside valid MIDI range
 */
export function createMIDINote(value: number): MIDINote {
  // Round to nearest integer
  const rounded = Math.round(value);

  if (rounded < 0 || rounded > 127) {
    throw new Error(`MIDI note must be between 0 and 127, got ${value}`);
  }
  return rounded as MIDINote;
}

/**
 * Check if a number is a valid MIDI note
 */
export function isValidMIDINote(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 127;
}

/**
 * Clamp a number to valid MIDI range
 */
export function clampMIDINote(value: number): MIDINote {
  return Math.max(0, Math.min(127, Math.round(value))) as MIDINote;
}

/**
 * Semitones (chromatic steps)
 * Used for interval calculations
 */
export type Semitones = number & { readonly __brand: 'Semitones' };

/**
 * Create a Semitones value
 * @param value - Number of semitones (can be negative)
 * @returns Branded Semitones type
 */
export function createSemitones(value: number): Semitones {
  return Math.round(value) as Semitones;
}

/**
 * Seconds (time duration)
 * Used for audio timing and durations
 */
export type Seconds = number & { readonly __brand: 'Seconds' };

/**
 * Create a validated Seconds value
 * @param value - Non-negative number
 * @returns Branded Seconds type
 * @throws Error if value is negative
 */
export function createSeconds(value: number): Seconds {
  if (value < 0) {
    throw new Error(`Seconds must be non-negative, got ${value}`);
  }
  return value as Seconds;
}

/**
 * Milliseconds (time duration)
 * Used for timing intervals and delays
 */
export type Milliseconds = number & { readonly __brand: 'Milliseconds' };

/**
 * Create a validated Milliseconds value
 * @param value - Non-negative number
 * @returns Branded Milliseconds type
 * @throws Error if value is negative
 */
export function createMilliseconds(value: number): Milliseconds {
  if (value < 0) {
    throw new Error(`Milliseconds must be non-negative, got ${value}`);
  }
  return value as Milliseconds;
}

/**
 * Percentage (0-100 range)
 * Used for progress indicators and percentage-based controls
 */
export type Percentage = number & { readonly __brand: 'Percentage' };

/**
 * Create a validated Percentage value
 * @param value - Number between 0 and 100
 * @returns Branded Percentage type
 * @throws Error if value is outside valid range
 */
export function createPercentage(value: number): Percentage {
  if (value < 0 || value > 100) {
    throw new Error(`Percentage must be between 0 and 100, got ${value}`);
  }
  return value as Percentage;
}

/**
 * Clamp a number to valid percentage range
 */
export function clampPercentage(value: number): Percentage {
  return Math.max(0, Math.min(100, value)) as Percentage;
}

/**
 * Conversion utilities
 */

/**
 * Convert MIDI note to frequency
 * @param midi - MIDI note number (69 = A4 = 440 Hz)
 * @returns Frequency in Hz
 */
export function midiToFrequency(midi: MIDINote): Frequency {
  // Formula: f = 440 * 2^((n-69)/12)
  return (440 * Math.pow(2, (midi - 69) / 12)) as Frequency;
}

/**
 * Convert frequency to MIDI note
 * @param freq - Frequency in Hz
 * @returns Closest MIDI note number
 */
export function frequencyToMIDI(freq: Frequency): MIDINote {
  // Formula: n = 69 + 12 * log2(f/440)
  return createMIDINote(69 + 12 * Math.log2(freq / 440));
}

/**
 * Convert BPM to seconds per beat
 * @param bpm - Tempo in beats per minute
 * @returns Duration of one beat in seconds
 */
export function bpmToSecondsPerBeat(bpm: BPM): Seconds {
  return (60 / bpm) as Seconds;
}

/**
 * Convert seconds to milliseconds
 */
export function secondsToMilliseconds(seconds: Seconds): Milliseconds {
  return (seconds * 1000) as Milliseconds;
}

/**
 * Convert milliseconds to seconds
 */
export function millisecondsToSeconds(ms: Milliseconds): Seconds {
  return (ms / 1000) as Seconds;
}

/**
 * Convert volume (0-1) to percentage (0-100)
 */
export function volumeToPercentage(volume: Volume): Percentage {
  return (volume * 100) as Percentage;
}

/**
 * Convert percentage (0-100) to volume (0-1)
 */
export function percentageToVolume(percentage: Percentage): Volume {
  return (percentage / 100) as Volume;
}

