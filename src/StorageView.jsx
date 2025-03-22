import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { JobsView } from './JobsView';
import { SkillsView } from './SkillsView';

function StorageView() {
  const [currentView, setCurrentView] = React.useState("jobs");
  const [jobToUpdate, setJobToUpdate] = React.useState(null);
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 5 }}>
        {currentView === "jobs" && <JobsView setCurrentView={setCurrentView} setJobsToUpdate={setJobToUpdate}/>}
        {currentView === "skills" && <SkillsView setCurrentView={setCurrentView} jobToUpdate={jobToUpdate}/>}
      </Box>
    </Container>
  )
}
export { StorageView };
