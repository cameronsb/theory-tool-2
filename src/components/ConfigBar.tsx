import { useState } from 'react';
import { useMusic } from '../hooks/useMusic';
import { useSettings } from '../hooks/useSettings';
import { NOTES } from '../utils/musicTheory';
import { VolumeSlider } from './VolumeSlider';
import './ConfigBar.css';

type Mode = 'learn' | 'build';


interface ConfigBarProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}


export function ConfigBar({ mode, onModeChange }: ConfigBarProps) {
  const { state, actions } = useMusic();
  const { settings } = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`config-bar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Collapse Toggle Button */}
      <button
        className="collapse-toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? 'Expand config bar' : 'Collapse config bar'}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{
            transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <path
            d="M3 6l5 5 5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="mode-toggle">
        <button
          className={mode === 'learn' ? 'active' : ''}
          onClick={() => onModeChange('learn')}
        >
          Learn
        </button>
        <button
          className={mode === 'build' ? 'active' : ''}
          onClick={() => onModeChange('build')}
        >
          Build
        </button>
      </div>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle settings menu"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      <div className={`config-controls ${menuOpen ? 'open' : ''}`}>
        <div className="control-group control-group-volume">
          <label>Master Volume</label>
          <VolumeSlider
            value={settings.volume.master}
            onChange={actions.setMasterVolume}
            color="#667eea"
            label=""
            orientation="horizontal"
          />
        </div>

        <div className="control-group">
          <label>Key</label>
          <select
            value={state.song.key}
            onChange={(e) => actions.selectKey(e.target.value as typeof NOTES[number])}
          >
            {NOTES.map((note) => (
              <option key={note} value={note}>
                {note}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Scale</label>
          <select
            value={state.song.mode}
            onChange={(e) => actions.setMode(e.target.value as 'major' | 'minor')}
          >
            <option value="major">Major</option>
            <option value="minor">Minor</option>
          </select>
        </div>

        {mode === 'build' && (
          <div className="control-group">
            <label>Time</label>
            <select defaultValue="4/4">
              <option value="4/4">4/4</option>
              <option value="3/4">3/4</option>
              <option value="6/8">6/8</option>
            </select>
          </div>
        )}
      </div>

      {menuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </div>
  );
}
