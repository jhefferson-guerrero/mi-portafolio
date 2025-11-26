import React, { useState, useEffect } from "react";
import "../styles/App.css";

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="loading-container">
      <div className="loading-content">
        <h1 className="welcome-text">Bienvenido</h1>

        {/* Contenedor de la barra y el porcentaje */}
        <div className="loader-wrapper">
          {/* Porcentaje numérico */}
          <span className="percent-text">{Math.round(progress)}%</span>

          {/* Barra */}
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>

        <p className="loading-status">CARGANDO...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
