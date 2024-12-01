import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import axios from 'axios';
import './index.css';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const FormCardContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));


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
    <FormCardContainer direction="column" justifyContent="space-between">

      <Card variant="outlined">
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
      </Card>
    </FormCardContainer>
  );
};

export default JobForm;

