import React, { useState, useEffect } from "react";
import "../styles/App.css";

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 600);
          return 100;
        }
        // Animación de carga más realista (frena un poco al final)
        const increment = prev > 80 ? Math.random() * 2 : Math.random() * 15;
        return prev + increment;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="loading-container">
      <div className="loading-content">
        <h1 className="welcome-text">Iniciando</h1>

        <div className="loader-wrapper">
          <span className="percent-text">{Math.round(progress)}%</span>
          
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          
          <p className="loading-status">Cargando sistema...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
