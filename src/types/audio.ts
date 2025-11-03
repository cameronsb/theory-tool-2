/**
 * Audio Type Definitions
 *
 * Comprehensive type definitions for audio-related functionality including:
 * - Audio engine state
 * - Playback control
 * - Drum synthesis
 * - Volume management
 */

/**
 * Audio engine state
 * Tracks the initialization and loading status of the audio system
 */
export interface AudioEngine {
  /** Web Audio API context */
  context: AudioContext | null;

  /** Soundfont player instrument */
  instrument: any | null; // Using 'any' for soundfont-player type

  /** Whether the audio engine has been initialized */
  initialized: boolean;

  /** Whether the audio engine is currently loading */
  loading: boolean;
}

/**
 * Audio context information
 * Provides detailed state about the Web Audio context
 */
export interface AudioContextInfo {
  /** Whether the context is initialized */
  initialized: boolean;

  /** Whether soundfont is loading */
  loading: boolean;

  /** Whether context is suspended (needs user interaction) */
  suspended: boolean;

  /** Whether audio is available for playback */
  available: boolean;

  /** Current context state ('running' | 'suspended' | 'closed') */
  state?: AudioContextState;
}

/**
 * Playback state
 * Tracks the current state of song playback
 */
export interface PlaybackState {
  /** Whether playback is currently active */
  isPlaying: boolean;

  /** Current time position in eighth notes */
  currentTimeInEighths: number;

  /** Whether playback should loop */
  loop: boolean;

  /** Whether there are chords/notes to play */
  canPlay: boolean;

  /** Whether audio engine is ready */
  hasAudio: boolean;

  /** Current beat position (for visual feedback) */
  currentBeat?: number;
}

/**
 * Drum synthesis configuration
 * Parameters for synthesizing drum sounds
 */
export interface DrumSynthConfig {
  // Frequency parameters
  initialFreq?: number;      // Starting frequency (Hz)
  minFreq?: number;          // Ending frequency (Hz)
  tonalFreq?: number;        // Tonal component frequency (Hz)
  highpassFreq?: number;     // Highpass filter cutoff (Hz)

  // Timing parameters
  duration: number;          // Total duration (seconds)
  noiseDuration?: number;    // Noise component duration (seconds)
  tonalDuration?: number;    // Tonal component duration (seconds)
  stopPadding?: number;      // Extra time before stopping oscillator (seconds)

  // Gain parameters
  gain?: number;             // Overall gain (0-1)
  gainStart?: number;        // Starting gain (0-1)
  gainEnd?: number;          // Ending gain (0-1)
  noiseGain?: number;        // Noise component gain (0-1)
  tonalGain?: number;        // Tonal component gain (0-1)

  // Buffer parameters
  bufferMultiplier?: number; // Multiplier for buffer size calculation
}

/**
 * Drum type
 * Available synthesized drum sounds
 */
export type DrumType = 'kick' | 'snare' | 'hihat';

/**
 * Volume settings
 * Hierarchical volume control
 */
export interface VolumeSettings {
  /** Master volume (0-1) */
  master: number;

  /** Track-specific volumes */
  tracks: {
    chords: number;
    melody: number;
    drums: number;
  };

  /** Individual drum sound volumes */
  drumSounds: {
    kick: number;
    snare: number;
    hihat: number;
  };
}

/**
 * Audio playback options
 * Parameters for playing notes and chords
 */
export interface PlaybackOptions {
  /** Duration in seconds */
  duration?: number;

  /** Volume/gain (0-1) */
  gain?: number;

  /** When to start (AudioContext time) */
  when?: number;

  /** Velocity (MIDI 0-127) */
  velocity?: number;
}

/**
 * Scheduled audio event
 * Tracks events that have been scheduled for playback
 */
export interface ScheduledEvent {
  /** Unique identifier for the event */
  blockId: string;

  /** When the event was scheduled (in eighth notes) */
  scheduledTime: number;

  /** Type of event */
  type?: 'chord' | 'note' | 'drum';

  /** Reference to the audio source (for stopping/canceling) */
  source?: AudioScheduledSourceNode;
}

/**
 * Playback scheduler options
 * Configuration for the audio scheduling system
 */
export interface PlaybackSchedulerOptions {
  /** Tempo in BPM */
  tempo: number;

  /** How far ahead to schedule events (seconds) */
  lookaheadTime: number;

  /** How often to check for events to schedule (milliseconds) */
  scheduleInterval: number;

  /** Whether to loop playback */
  loop: boolean;

  /** Callback when playback time updates */
  onTimeUpdate?: (timeInEighths: number) => void;

  /** Callback when playback ends */
  onPlaybackEnd?: () => void;
}

/**
 * Audio effect parameters
 * Configuration for audio effects (future use)
 */
export interface AudioEffectParams {
  /** Effect type */
  type: 'reverb' | 'delay' | 'compressor' | 'eq' | 'distortion';

  /** Whether effect is enabled */
  enabled: boolean;

  /** Wet/dry mix (0-1) */
  mix?: number;

  /** Effect-specific parameters */
  params?: Record<string, number>;
}

/**
 * Soundfont configuration
 * Settings for loading instrument soundfonts
 */
export interface SoundfontConfig {
  /** Instrument name (e.g., 'acoustic_grand_piano') */
  instrument: string;

  /** Soundfont library ('MusyngKite' | 'FluidR3_GM') */
  library: 'MusyngKite' | 'FluidR3_GM';

  /** Optional audio context */
  context?: AudioContext;

  /** Optional gain node */
  gain?: GainNode;
}

/**
 * MIDI note play options
 * Options for playing MIDI notes through soundfont
 */
export interface MIDINotePlayOptions {
  /** MIDI note number (0-127) */
  note: number;

  /** When to start (AudioContext time) */
  time?: number;

  /** Duration in seconds */
  duration?: number;

  /** Gain/volume (0-1) */
  gain?: number;
}

/**
 * Audio initialization error
 * Error information when audio initialization fails
 */
export interface AudioInitError {
  /** Error message */
  message: string;

  /** Error code */
  code?: string;

  /** Whether user interaction is required */
  requiresUserInteraction?: boolean;

  /** Original error object */
  originalError?: Error;
}

