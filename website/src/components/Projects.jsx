import React from "react";

function Projects() {
  const projectList = [
    { title: "Portfolio Website", description: "Personal portfolio built with ReactJS." },
    { title: "Animal Generator", description: "Fun app fetching random animal images from API." },
    { title: "Todo App", description: "Simple task manager with React state management." }
  ];

  return (
    <section id="projects">
      <h2>Projects</h2>
      <ul>
        {projectList.map((project, index) => (
          <li key={index}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Projects;
