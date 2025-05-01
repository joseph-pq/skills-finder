import { Container, Box } from "@mui/material";
import React from "react";

import { GroupsView } from "./GroupsView";
import { JobsView } from "./JobsView";
import { SkillsView } from "./SkillsView";
import { StorageViewType } from "./types";


function StorageView() {
  const [currentView, setCurrentView] = React.useState<StorageViewType>(
    StorageViewType.Jobs,
  );
  const [jobToUpdate, setJobToUpdate] = React.useState<number | null>(null);
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 5 }}>
        {currentView === StorageViewType.Jobs && (
          <JobsView
            setCurrentView={setCurrentView}
            setJobsToUpdate={setJobToUpdate}
          />
        )}
        {currentView === StorageViewType.Skills && jobToUpdate !== null && (
          <SkillsView
            setCurrentView={setCurrentView}
            jobToUpdate={jobToUpdate}
          />
        )}
        {currentView === StorageViewType.Groups && (
          <GroupsView/>
        )}
      </Box>
    </Container>
  );
}
export { StorageView };
