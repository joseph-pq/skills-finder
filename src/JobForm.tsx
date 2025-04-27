import React, { useState, useContext } from 'react';
import { Button, FormLabel, TextField, Typography, FormControl, Box, Container } from '@mui/material';
import { JobsContext } from './JobsContext';
import { Card } from './Card';

const JobForm = () => {
  const { addJob } = useContext(JobsContext);
  const [formValues, setFormValues] = useState({
    jobTitle: '',
    companyName: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { jobTitle, companyName, description } = formValues;
    addJob({ jobTitle, companyName, description, skills: [] });

    // Clear form values after submission
    setFormValues({
      jobTitle: '',
      companyName: '',
      description: '',
    });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 10 }}>
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Add a Job Posting
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
            <JobField
              label="Job Title"
              name="jobTitle"
              value={formValues.jobTitle}
              onChange={handleChange}
              required
            />
            <JobField
              label="Company Name"
              name="companyName"
              value={formValues.companyName}
              onChange={handleChange}
              required
            />
            <JobField
              label="Job Description"
              name="description"
              value={formValues.description}
              onChange={handleChange}
              multiline
              minRows={4}
              maxRows={6}
              required
            />
            <Button type="submit" variant="contained">
              Add Job
            </Button>
          </Box>
        </Card>
      </Box>
    </Container>
  );
};

// Extracted reusable field component
const JobField = ({ label, ...props }) => (
  <FormControl>
    <FormLabel htmlFor={props.name}>{label}</FormLabel>
    <TextField id={props.name} {...props} />
  </FormControl>
);

export default JobForm;
