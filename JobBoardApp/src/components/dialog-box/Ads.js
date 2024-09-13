// Ads.js
import React, { useEffect, useState } from 'react';
import './ad.css';

const Ads = ({ onClose }) => {
  const [visible, setVisible] = useState(true);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          setVisible(false);
          onClose(); // Notify parent to allow PDF printing
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className="ad-box-overlay">
      <div className="ad-dialog">
        <div className="ad-dialog-content">
          <h2>ADS</h2>
            <div className="gif-container">
              <iframe
                src="https://giphy.com/embed/dw3VGWltARsZ6GiLBL"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
              ></iframe>
          </div>
          <p>You can close this ad in: <span className="countdown">{countdown}</span> seconds</p>
        </div>
      </div>
    </div>
  );
};

export default Ads;