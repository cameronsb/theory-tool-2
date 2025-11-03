/**
 * User Settings & Preferences
 *
 * This file defines all user-configurable settings that persist across sessions.
 * Settings are stored in localStorage with a well-organized key structure.
 */

// Volume settings - extensible for future per-note/per-track volumes
export interface VolumeSettings {
  // Master volume (0-1)
  master: number;

  // Track volumes (0-1)
  tracks: {
    chords: number;
    melody: number;
    drums: number;
  };

  // Individual drum sounds (0-1) - for future per-drum volume control
  drumSounds: {
    kick: number;
    snare: number;
    hihat: number;
  };
}

// UI/Layout settings
export interface UISettings {
  // Builder panel configuration
  builderPanel: {
    height: number;              // Current height of bottom panel (150-600px)
    activeTab: 'piano' | 'drums'; // Which tab is currently selected
    rememberedHeights: {         // Remember height per tab
      piano: number;
      drums: number;
    };
  };

  // Learn mode sidebar configuration
  learnSidebar: {
    width: number;      // Width of sidebar (280-600px)
    isOpen: boolean;    // Whether sidebar is open or closed
  };

  // Learn mode tablet piano configuration
  learnTabletPiano: {
    height: number;     // Height of tablet piano panel (200-500px)
  };

  // Chord display sort preferences
  chordSort: {
    diatonic: 'default' | 'grouped';  // Sort mode for diatonic chords
    borrowed: 'default' | 'grouped';  // Sort mode for borrowed chords
  };

  // Piano/keyboard display settings
  piano: {
    showInScaleColors: boolean;     // Highlight scale notes on piano
    keyboardPreviewEnabled: boolean; // Show chord notes on keyboard when chord is selected
    showMiniPreview: boolean;        // Show mini piano preview on chord cards
  };
}

// All user settings
export interface UserSettings {
  volume: VolumeSettings;
  ui: UISettings;
  // Future settings can be added here:
  // workflow: WorkflowSettings;
  // midi: MIDISettings;
  // audio: AudioSettings;
  // etc.
}

// Default settings
export const DEFAULT_SETTINGS: UserSettings = {
  volume: {
    master: 0.7,
    tracks: {
      chords: 0.75,
      melody: 0.8,
      drums: 0.6,
    },
    drumSounds: {
      kick: 0.8,
      snare: 0.7,
      hihat: 0.6,
    },
  },
  ui: {
    builderPanel: {
      height: 250,
      activeTab: 'piano',
      rememberedHeights: {
        piano: 250,
        drums: 300,
      },
    },
    learnSidebar: {
      width: 420,       // Default: 420px width
      isOpen: true,     // Default: open
    },
    learnTabletPiano: {
      height: 280,      // Default: 280px height
    },
    chordSort: {
      diatonic: 'default',  // Default: default order
      borrowed: 'default',  // Default: default order
    },
    piano: {
      showInScaleColors: true,        // Default: highlight scale notes
      keyboardPreviewEnabled: true,    // Default: show chords on keyboard
      showMiniPreview: true,           // Default: show mini preview on cards
    },
  },
};

// localStorage key structure
export const STORAGE_KEYS = {
  SETTINGS: 'enso-piano:settings',
  SONGS: 'enso-piano:songs',
  ACTIVE_SONG_ID: 'enso-piano:active-song-id',
  // Future keys can be added here
} as const;
