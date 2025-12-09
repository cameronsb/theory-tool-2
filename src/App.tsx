import { MusicProvider } from './contexts/MusicContext';
import { ConfigBar } from './components/ConfigBar';
import { LoadingOverlay } from './components/LoadingOverlay';
import { LearnMode } from './components/LearnMode';
import './App.css';

function App() {
  return (
    <MusicProvider>
      <div className="app">
        <LoadingOverlay />
        <ConfigBar />
        <main className="main-content">
          <LearnMode />
        </main>
      </div>
    </MusicProvider>
  );
}

export default App;
