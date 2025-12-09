import { useMusic } from '../hooks/useMusic';
import './LoadingOverlay.css';

export function LoadingOverlay() {
  const { audio } = useMusic();

  if (!audio.loading) {
    return null;
  }

  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="loading-piano">
          <div className="loading-key white"></div>
          <div className="loading-key black"></div>
          <div className="loading-key white"></div>
          <div className="loading-key black"></div>
          <div className="loading-key white"></div>
          <div className="loading-key white"></div>
          <div className="loading-key black"></div>
          <div className="loading-key white"></div>
        </div>
        <p className="loading-text">Loading piano samples...</p>
      </div>
    </div>
  );
}

