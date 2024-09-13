import React from 'react';
import './style.css';

const WaveLoader = () => {
  return (
    <div className="wave-loader-container">
      <div className="wave-loader">
      <div className="wave-loader__text">
          <span>L</span>
          <span>o</span>
          <span>a</span>
          <span>d</span>
          <span>i</span>
          <span>n</span>
          <span>g</span>
        </div>
        <div className="wave-loader__wave"></div>
        <div className="wave-loader__wave"></div>
        <div className="wave-loader__wave"></div>
        <div className="wave-loader__wave"></div>
        <div className="wave-loader__wave"></div>
      </div>
    </div>
  );
};

export default WaveLoader;
