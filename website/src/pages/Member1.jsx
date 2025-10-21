import React from "react";
import "./Member1.css";

function PortfolioMember1() {
  // This runs when someone presses "Send"
  const handleSubmit = (e) => {
    e.preventDefault(); // stop page refresh
    alert("✅ Thank you for reaching out! I'll get back to you soon.");
  };

  return (
    <div className="portfolio-container">
      {/* Hero Section */}
      <section className="hero-section" align="center">
        <img
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
          className="profile-image"
        />
        <h1>Chan Nhu</h1>
        <h3>Student & Aspiring Developer</h3>
        <p>
          Age: <b>18</b> years old
        </p>
      </section>

      {/* About Section */}
      <section className="about-section">
        <h2> About Me</h2>
        <div className="about-content">
          <p>
            Hello! I'm <b>Chan Nhu</b>, a passionate student who loves
            technology and learning new things. I'm currently studying{" "}
            <u>XYZ</u> and have a deep interest in{" "}
            <i>Artificial Intelligence</i> and software development.
          </p>
          <p>
            When I'm not studying or coding, you can find me running in the
            park, playing badminton with friends, or planning my next travel
            adventure. I also love spending time with animals (dogs & cats 🐕🐈) and
            enjoying matcha drinks with tofu 🍵.
          </p>
        </div>
        <br />
      </section>

      {/* Hobbies Section */}
      <section className="hobbies-section">
        <h2>My Hobbies & Interests</h2>
        <ul className="hobbies-list">
          <li>💻 Coding</li>
          <li>🏃 Running</li>
          <li>🏸 Badminton</li>
          <li>✈️ Travelling</li>
          <li>🎬 Watching movies & series</li>
          <li>🐶🐱 Playing with dogs & cats</li>
          <li>🍵 Matcha & tofu</li>
        </ul>
        <br />
        <br />
      </section>

      {/* Study Schedule Table */}
      <section>
        <h2>My Study Schedule</h2>
        <table className="schedule-table" border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Day</th>
              <th>Morning (8:00–12:00)</th>
              <th>Afternoon (1:00–5:00)</th>
              <th>Evening (6:00–10:00)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Monday</td>
              <td>Computer Science Classes</td>
              <td>Programming Practice</td>
              <td>Study & Review</td>
            </tr>
            <tr>
              <td>Tuesday</td>
              <td>Mathematics</td>
              <td>AI Course Online</td>
              <td>Running & Exercise</td>
            </tr>
            <tr>
              <td>Wednesday</td>
              <td>Project Work</td>
              <td>Group Study</td>
              <td>Badminton Practice</td>
            </tr>
            <tr>
              <td>Thursday</td>
              <td>Data Structures</td>
              <td>Algorithm Practice</td>
              <td>Reading & Relaxation</td>
            </tr>
            <tr>
              <td>Friday</td>
              <td>Web Development</td>
              <td>Personal Projects</td>
              <td>Movie Night</td>
            </tr>
            <tr>
              <td>Weekend</td>
              <td>Rest</td>
              <td>Travel/Outdoor</td>
              <td>Friends & Family</td>
            </tr>
          </tbody>
        </table>
        <br />
        <br />
      </section>

      {/* Goals Section */}
      <section>
        <h2>My Goals and Approach</h2>
        <ol className="goals-list">
          <li>
            <b>Find Jobs</b> — secure a tech role in{" "}
            <i>software development or AI</i>.
          </li>
          <li>
            <b>Learn about AI</b> — study <b>ML</b>, <b>DL</b>, and{" "}
            <b>Data Science</b>.
          </li>
          <li>
            <b>Make AI Powered Products</b> — create{" "}
            <u>real-world applications</u>.
          </li>
          <li>
            <b>Good Grades at School</b> — maintain excellent academic
            performance.
          </li>
          <li>
            <b>Stay Fit</b> — exercise regularly (
            H<sub>2</sub>O 💧 + O<sup>2</sup> 🫁 = Energy ⚡).
          </li>
        </ol>
        <br />
        <br />
      </section>

      {/* Contact Form */}
      <section>
        <h2>Get In Touch</h2>
        <p>Feel free to reach out if you'd like to connect or collaborate!</p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Name</label>
            <input placeholder="Enter your name" />
          </div>

          <div className="form-group">
            <label>Your Email</label>
            <input placeholder="example@email.com" />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea placeholder="Type your message here..."></textarea>
          </div>

          <button type="submit" className="submit-btn">
            ✉️ Send Message
          </button>
        </form>
      </section>
    </div>
  );
}

export default PortfolioMember1;
