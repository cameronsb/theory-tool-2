export type Note =
    | "C"
    | "C#"
    | "D"
    | "D#"
    | "E"
    | "F"
    | "F#"
    | "G"
    | "G#"
    | "A"
    | "A#"
    | "B";

export type NoteWithOctave = `${Note}${number}`;

export type Mode = "major" | "minor";

export type ChordType =
    | "maj"
    | "min"
    | "dim"
    | "maj7"
    | "min7"
    | "dom7"
    | "half-dim7";

export interface ChordDefinition {
    numeral: string;
    type: ChordType;
    intervals: number[];
}

export interface ChordData {
    triads: ChordDefinition[];
    sevenths: ChordDefinition[];
}

export interface FrequencyMap {
    [key: string]: number;
}

export interface PianoKeyData {
    note: NoteWithOctave;
    baseNote: Note;
    displayName?: string; // Enharmonic spelling based on current key context
    angle: number;
    x: number;
    y: number;
    isBlack: boolean;
    octave: number;
    midiNumber: number; // MIDI note number (A0=21, C8=108)
    frequency: number; // Exact frequency in Hz
}

export interface SelectedChord {
    rootNote: Note;
    intervals: number[];
    numeral: string;
}

export type ViewMode = "circular" | "linear";

export type InteractionMode = "keySelection" | "play";

export type ChordDisplayMode = "select" | "build";

export interface ChordInProgression extends SelectedChord {
    id: string;
    duration: number; // in beats
}

export interface ChordBlock {
    id: string;
    rootNote: Note;
    intervals: number[];
    numeral: string;
    position: number; // Start time in 8th notes from song start
    duration: number; // Duration in 8th notes
}

export interface MelodyNote {
    id: string;
    pitch: NoteWithOctave;
    position: number; // Start time in 8th notes from song start
    duration: number; // Duration in 8th notes
    velocity: number; // 0-127 (MIDI velocity)
}

export interface DrumPattern {
    id: string;
    measure: number; // Which measure this pattern belongs to
    kick: boolean[]; // 16 steps
    snare: boolean[]; // 16 steps
    hihat: boolean[]; // 16 steps
}

export interface ChordTrack {
    blocks: ChordBlock[];
}

export interface MelodyTrack {
    notes: MelodyNote[];
}

export interface DrumTrack {
    patterns: DrumPattern[];
}

export interface Song {
    id: string;
    name: string;
    tempo: number; // BPM
    timeSignature: {
        numerator: number;
        denominator: number;
    };
    key: Note;
    mode: Mode;
    tracks: {
        chords: ChordTrack;
        melody: MelodyTrack;
        drums: DrumTrack;
    };
    metadata: {
        createdAt: number;
        updatedAt: number;
    };
}
