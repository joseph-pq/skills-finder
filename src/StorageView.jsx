import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { JobsView } from './JobsView';
import { SkillsView } from './SkillsView';

function StorageView() {
  const [currentView, setCurrentView] = React.useState("jobs");
  const [jobsToUpdate, setJobsToUpdate] = React.useState([]);
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 5 }}>
        {currentView === "jobs" && <JobsView setCurrentView={setCurrentView} setJobsToUpdate={setJobsToUpdate}/>}
        {currentView === "skills" && <SkillsView setCurrentView={setCurrentView} jobsToUpdate={jobsToUpdate}/>}
      </Box>
    </Container>
  )
}
export { StorageView };
