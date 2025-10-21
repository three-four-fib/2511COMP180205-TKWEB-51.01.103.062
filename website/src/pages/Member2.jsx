// src/pages/Member2.jsx
import React from "react";
import "./Member2.css"; // Your CSS for styling

function Member2() {
  return (
    <div className="mini-window-container">
      <div className="mini-window">
        <div className="mini-window-header">
          <span className="window-title">Portfolio - Ngọc Hạnh</span>
          <button className="close-btn" onClick={() => window.history.back()}>
            ✖
          </button>
        </div>

        <iframe
          src={`${import.meta.env.BASE_URL}Member2.html`}
          title="Member 2 Portfolio"
          className="mini-window-frame"
        ></iframe>
      </div>
    </div>
  );
}

export default Member2;
