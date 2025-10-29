import { useEffect, useState } from 'react';
import './LoadingScreen.css';

/**
 * LoadingScreen Component
 *
 * Full-screen loading indicator matching Dashboard styling
 * McCabe complexity: 1
 */
function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <h1>ADHD LEARN</h1>
        <p>Loading...</p>

        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="progress-text">{progress}%</div>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
