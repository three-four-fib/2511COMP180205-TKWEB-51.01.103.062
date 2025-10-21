// src/pages/Member2.jsx
import React from "react";
import "./Member5.css"; // Your CSS for styling

function Member4() {
  return (
    <div className="mini-window-container">
      <div className="mini-window">
        <div className="mini-window-header">
          <span className="window-title">Portfolio - Tien</span>
          <button className="close-btn" onClick={() => window.history.back()}>
            ✖
          </button>
        </div>

        <iframe
          src={`${import.meta.env.BASE_URL}Member5.html`}
          title="Member 4 Portfolio"
          className="mini-window-frame"
        ></iframe>
      </div>
    </div>
  );
}

export default Member4;
