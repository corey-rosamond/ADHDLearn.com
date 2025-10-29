import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChildSelector from './pages/ChildSelector';
import PinEntry from './pages/PinEntry';
import ChildDashboard from './pages/ChildDashboard';
import LetterPopGame from './pages/LetterPopGame';
import SettingsPage from './pages/SettingsPage';
import './App.css';

/**
 * App Component
 *
 * Main app with React Router for Phase 7 child login flow
 * Routes:
 *   / - Child selector (login screen)
 *   /pin-entry - PIN entry screen
 *   /dashboard - Child dashboard
 *   /letter-pop - Letter Pop game
 *   /settings - Game settings
 *
 * McCabe complexity: 1
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChildSelector />} />
        <Route path="/pin-entry" element={<PinEntry />} />
        <Route path="/dashboard" element={<ChildDashboard />} />
        <Route path="/letter-pop" element={<LetterPopGame />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
