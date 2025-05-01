import { Container, Box } from "@mui/material";
import React from "react";

import { GroupsView } from "./GroupsView";
import { JobsView } from "./JobsView";
import { SkillsView } from "./SkillsView";

function StorageView() {
  const [currentView, setCurrentView] = React.useState<string>("jobs");
  const [jobToUpdate, setJobToUpdate] = React.useState(null);
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 5 }}>
        {currentView === "jobs" && (
          <JobsView
            setCurrentView={setCurrentView}
            setJobsToUpdate={setJobToUpdate}
          />
        )}
        {currentView === "skills" && (
          <SkillsView
            setCurrentView={setCurrentView}
            jobToUpdate={jobToUpdate}
          />
        )}
        {currentView === "groups" && (
          <GroupsView setCurrentView={setCurrentView} />
        )}
      </Box>
    </Container>
  );
}
export { StorageView };
