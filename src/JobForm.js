import React, { useState } from 'react';
import axios from 'axios';
import './index.css';


const JobForm = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [skills, setSkills] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const skillsArray = skills.split('\n').filter(skill => skill.trim() !== '');
    const payload = { jobTitle, companyName, skills: skillsArray };

    try {
      const response = await axios.post('http://localhost:4000/add-job', payload);
      alert(response.data.message);
    } catch (error) {
      console.error('There was an error creating the job!', error);
    }
  };

  return (
    <div className="central">
    <form onSubmit={handleSubmit}>
      <div>
        <label>Job Title:</label>
        <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required />
      </div>
      <div>
        <label>Company Name:</label>
        <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
      </div>
      <div>
        <label>Skills (one per line):</label>
        <textarea value={skills} onChange={(e) => setSkills(e.target.value)} required />
      </div>
      <button type="submit">Add Job</button>
    </form>
    </div>
  );
};

export default JobForm;

