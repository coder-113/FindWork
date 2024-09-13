import React, { useState } from 'react';
import './css/detail.css';

const DetailsCv = ({ cv, onClose }) => {
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    { title: 'User Details', content: <UserDetails userDetails={cv.userDetails} /> },
    { title: 'Education', content: <Education educations={cv.userEducations} /> },
    { title: 'Experience', content: <Experience experiences={cv.userExperiences} /> },
    { title: 'Skills', content: <Skills skills={cv.userSkills} /> },
    { title: 'Projects', content: <Projects projects={cv.userProjects} /> },
    { title: 'Languages', content: <Languages languages={cv.userLanguages} /> },
  ];

  const nextSection = () => {
    setCurrentSection((prev) => Math.min(prev + 1, sections.length - 1));
  };

  const prevSection = () => {
    setCurrentSection((prev) => Math.max(prev - 1, 0));
  };

  const skipToLast = () => {
    setCurrentSection(sections.length - 1);
  };

  const isFirstSection = currentSection === 0;
  const isLastSection = currentSection === sections.length - 1;

  return (
    <div className='detail-bg'>
        <button className="close-button" onClick={onClose}>Close</button>
    <div className="cv-details">
      <div className="cv-content">
        <h2 className='cv-update-title'>Title: {cv.cvTitle}</h2>
        <div className="cv-section-container">
          {sections[currentSection].content}
        </div>
        <div className="cv-navigation">
          <span>{sections[currentSection].title}</span>
          <div className="cv-navigation-buttons">
            {!isFirstSection && <button onClick={prevSection}>Back</button>}
            {isFirstSection && <button onClick={skipToLast}>Skip</button>}
            {!isLastSection && <button onClick={nextSection}>Next</button>}
          </div>
        </div>
      </div>
      <div className="cv-progress-line">
        <div 
          className="cv-progress-indicator" 
          style={{height: `${((currentSection + 1) / sections.length) * 100}%`}}
        ></div>
      </div>
    </div>
    </div>
  );
};

const UserDetails = ({ userDetails }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <div className="cv-section">
      {userDetails && userDetails.map((detail, index) => (
        <div key={index} className="cv-item">
          <img src={`data:image/jpeg;base64,${detail.profileImageBase64}`} alt="Profile" />
          <p><strong>Full Name:</strong> {detail.fullName}</p>
          <p><strong>Day Of Birth:</strong> {formatDate(detail.dob)}</p>
          <p><strong>Address:</strong> {detail.address}</p>
          <p><strong>Phone:</strong> {detail.phone}</p>
          <p><strong>Email:</strong> {detail.email}</p>
        </div>
      ))}
    </div>
  );
};

const Education = ({ educations }) => (
  <div className="cv-section">
    {educations && educations.map((education, index) => (
      <div key={index} className="cv-item">
        <p><strong>Degree:</strong> {education.degree}</p>
        <p><strong>Institution:</strong> {education.institution}</p>
        <p><strong>Start Date:</strong> {education.startDate}</p>
        <p><strong>End Date:</strong> {education.endDate}</p>
        <p><strong>Description:</strong> {education.description}</p>
      </div>
    ))}
  </div>
);

const Experience = ({ experiences }) => (
  <div className="cv-section">
    {experiences && experiences.map((experience, index) => (
      <div key={index} className="cv-item">
        <p><strong>Job Title:</strong> {experience.jobTitle}</p>
        <p><strong>Company:</strong> {experience.company}</p>
        <p><strong>Start Date:</strong> {experience.startDate}</p>
        <p><strong>End Date:</strong> {experience.endDate}</p>
        <p><strong>Description:</strong> {experience.description}</p>
      </div>
    ))}
  </div>
);

const Skills = ({ skills }) => (
  <div className="cv-section">
    {skills && skills.map((skill, index) => (
      <div key={index} className="cv-item">
        <p><strong>Skill Name:</strong> {skill.skillName}</p>
        <p><strong>Programming language:</strong> {skill.proficiency}</p>
      </div>
    ))}
  </div>
);

const Projects = ({ projects }) => (
  <div className="cv-section">
    {projects && projects.map((project, index) => (
      <div key={index} className="cv-item">
        <p><strong>Project Name:</strong> {project.projectName}</p>
        <p><strong>Description:</strong> {project.description}</p>
        <p><strong>Start Date:</strong> {project.startDate}</p>
        <p><strong>End Date:</strong> {project.endDate}</p>
      </div>
    ))}
  </div>
);

const Languages = ({ languages }) => (
  <div className="cv-section">
    {languages && languages.map((language, index) => (
      <div key={index} className="cv-item">
        <p><strong>Language Name:</strong> {language.languageName}</p>
        <p><strong>Proficiency:</strong> {language.proficiency}</p>
      </div>
    ))}
  </div>
);

export default DetailsCv;
