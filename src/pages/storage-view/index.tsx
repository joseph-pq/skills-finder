import { Container, Box } from "@mui/material";
import React from "react";

import { GroupsView } from "@/pages/storage-view/groups-view";
import { JobsView } from "@/pages/storage-view/jobs-view";
import { SkillsView } from "@/pages/storage-view/skills-view";
import { StorageViewType } from "@/types";


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
