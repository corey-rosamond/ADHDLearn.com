import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingsPage.css';

/**
 * SettingsPage
 *
 * Settings page matching Dashboard styling
 * McCabe complexity: 2
 */
function SettingsPage() {
  const navigate = useNavigate();
  const [masterVolume, setMasterVolume] = useState(100);
  const [musicVolume, setMusicVolume] = useState(100);
  const [sfxVolume, setSfxVolume] = useState(100);

  useEffect(() => {
    // Check if logged in
    const token = localStorage.getItem('childToken');
    if (!token) {
      navigate('/');
      return;
    }

    // Load saved settings
    setMasterVolume(parseInt(localStorage.getItem('masterVolume') || '100'));
    setMusicVolume(parseInt(localStorage.getItem('musicVolume') || '100'));
    setSfxVolume(parseInt(localStorage.getItem('sfxVolume') || '100'));
  }, [navigate]);

  const handleMasterVolumeChange = (e) => {
    const value = parseInt(e.target.value);
    setMasterVolume(value);
    localStorage.setItem('masterVolume', value.toString());
  };

  const handleMusicVolumeChange = (e) => {
    const value = parseInt(e.target.value);
    setMusicVolume(value);
    localStorage.setItem('musicVolume', value.toString());
  };

  const handleSfxVolumeChange = (e) => {
    const value = parseInt(e.target.value);
    setSfxVolume(value);
    localStorage.setItem('sfxVolume', value.toString());
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1>Settings</h1>

        <div className="settings-group">
          <label>
            Master Volume
            <span className="volume-value">{masterVolume}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={masterVolume}
            onChange={handleMasterVolumeChange}
            className="volume-slider"
          />
        </div>

        <div className="settings-group">
          <label>
            Music Volume
            <span className="volume-value">{musicVolume}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={musicVolume}
            onChange={handleMusicVolumeChange}
            className="volume-slider"
          />
        </div>

        <div className="settings-group">
          <label>
            Sound Effects
            <span className="volume-value">{sfxVolume}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={sfxVolume}
            onChange={handleSfxVolumeChange}
            className="volume-slider"
          />
        </div>

        <button className="back-button" onClick={handleBack}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
