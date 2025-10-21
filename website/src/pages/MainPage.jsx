import React from "react";
import "./MainPage.css";

function MainPage() {
  const teamMembers = [
    { name: "Chân Như", role: "Team Member" },
    { name: "Ngọc Hạnh", role: "Team Member" },
    { name: "Như Ý", role: "Team Member" },
    { name: "Trúc Khanh", role: "Team Member" },
    { name: "Tiên", role: "Team Member" }
  ];

  return (
    <div className="main-container">
      <h1>Welcome to Our Project</h1>
      <p>This is a website built by React.js</p>
      <p>We worked together to build and host this website.</p>
      
      <div className="team-section">
        <h2>👥 Nhóm 1 Team Members</h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="member-card">
              <div className="member-avatar">
                <span className="avatar-text">{member.name.charAt(0)}</span>
              </div>
              <h3 className="member-name">{member.name}</h3>
              <p className="member-role">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <a 
          href="https://reactjs.org" 
          target="_blank" 
          rel="noopener noreferrer"
          className="badge-link"
        >
          <span className="badge">⚛️ Built with React.js</span>
        </a>
      </div>
    </div>
  );
}

export default MainPage;
