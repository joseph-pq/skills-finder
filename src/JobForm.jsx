import React, { useState } from 'react';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import axios from 'axios';
import './index.css';
import { JobsContext } from './JobsContext';
import { FormCardContainer } from './FormCardContainer';
import { Card } from './Card';


const JobForm = () => {
  const {addJob } = React.useContext(JobsContext);
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [skills, setSkills] = useState('');


  const handleSubmit = async (event) => {
    event.preventDefault();
    addJob({ jobTitle, companyName, skills });
  };

  return (
    <FormCardContainer direction="column" justifyContent="space-between">

      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
        >
          Add a Job Posting
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel
              htmlFor="jobTitle"
            >Job Title</FormLabel>
            <TextField
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel
              htmlFor="companyName"
            >Company Name</FormLabel>
            <TextField
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel
              htmlFor="JobDescription"
            >Job Description</FormLabel>
            <TextField
              id="JobDescription"
              multiline
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              required
            />
          </FormControl>
          <Button type="submit" variant="contained">Add Job</Button>
        </Box>
      </Card>
    </FormCardContainer>
  );
};

export default JobForm;

