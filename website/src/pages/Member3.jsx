// src/pages/Member2.jsx
import React from "react";
import "./Member3.css"; // Your CSS for styling

function Member3() {
  return (
    <div className="mini-window-container">
      <div className="mini-window">
        <div className="mini-window-header">
          <span className="window-title">Portfolio - Truc Khanh</span>
          <button className="close-btn" onClick={() => window.history.back()}>
            ✖
          </button>
        </div>

        <iframe
          src={`${import.meta.env.BASE_URL}Member3.html`}
          title="Member 3 Portfolio"
          className="mini-window-frame"
        ></iframe>
      </div>
    </div>
  );
}

export default Member3;
