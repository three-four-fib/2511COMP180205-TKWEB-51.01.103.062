import React from 'react';
import "./About.css";

function About()
{
    return(
        <section className="about">
            <h2>
                🚀 About Our Website
            </h2>
            <p>
                This is a website built by React.js by our team - <strong>Nhóm 1</strong>. 
                We created this platform to showcase our team members' portfolios and demonstrate 
                our skills in modern web development using React.js.
            </p>

            <br></br>
            <br></br>

            <h2>
                👥 Our Team - Nhóm 1
            </h2>
            <p>
                We are a passionate group of developers working together to create amazing web experiences. 
                Our team consists of talented individuals who bring different skills and perspectives to 
                the table, making our projects diverse and innovative.
            </p>

            <br></br>
            <br></br>

            <h2>
                ⚛️ About React.js
            </h2>
            <p>
                React.js is a powerful JavaScript library for building user interfaces, especially for 
                single-page applications. Here are some interesting facts about React.js:
            </p>
            
            <div className="react-facts">
                <ul>
                    <li>🎯 <strong>Created by Facebook:</strong> React was created by Jordan Walke, a software engineer at Facebook, in 2013.</li>
                    <li>📱 <strong>Used by Major Companies:</strong> Companies like Netflix, Airbnb, Instagram, and WhatsApp use React in their applications.</li>
                    <li>🔄 <strong>Virtual DOM:</strong> React uses a Virtual DOM which makes it faster than traditional DOM manipulation.</li>
                    <li>🧩 <strong>Component-Based:</strong> React is built around reusable components, making code more maintainable and organized.</li>
                    <li>📊 <strong>JSX:</strong> React uses JSX (JavaScript XML) which allows us to write HTML-like syntax in JavaScript.</li>
                    <li>🌐 <strong>React Native:</strong> React can also be used to build mobile applications with React Native.</li>
                    <li>⚡ <strong>Fast Performance:</strong> React's one-way data binding and virtual DOM make it extremely fast and efficient.</li>
                    <li>🛠️ <strong>Rich Ecosystem:</strong> React has a huge ecosystem with thousands of libraries and tools available.</li>
                </ul>
            </div>

            <br></br>
            <br></br>

            <h2>
                🎯 Our Mission
            </h2>
            <p>
                Through this website, we aim to showcase our technical skills, creativity, and teamwork. 
                We believe in continuous learning and staying updated with the latest technologies in web development.
            </p>

            <br></br>
            <br></br>

            <h2 >
                🛠️ Technologies Used
            </h2>
            <p>
                This website is built using modern web technologies including React.js, HTML5, CSS, 
                and various other tools and libraries to create a responsive and interactive user experience.
            </p>
        </section>
    );
}

export default About;