import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { AppBar, Toolbar, Typography, Box, Tab } from "@mui/material";
import React, { JSX, useState } from "react";

import SpaceBackground from "@/app/space";
import { JobsProvider } from "@/jobs-context";
// import { InsightsView } from "@/pages/insights-view";
import { ChatBotview } from "@/pages/chatbot-view";
import JobForm from "@/pages/job-form";
import { SetupSkillsFinder } from "@/pages/setup-skills-finder";
import { StorageView } from "@/pages/storage-view";

interface TabItem {
  label: string;
  value: string;
  component: JSX.Element;
}

const TABS: TabItem[] = [
  { label: "Home", value: "1", component: <SetupSkillsFinder /> },
  { label: "New Job", value: "2", component: <JobForm /> },
  { label: "Current Jobs", value: "3", component: <StorageView /> },
  { label: "Chatbot", value: "4", component: <ChatBotview /> },
  // { label: "Insights", value: "4", component: <InsightsView /> },
];

function App() {
  const [currentTab, setCurrentTab] = useState<string>("1");

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) =>
    setCurrentTab(newValue);

  return (
    <JobsProvider>
      <SpaceBackground>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
              SKILLS FINDER
            </Typography>
          </Toolbar>
        </AppBar>
        <TabContext value={currentTab}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <TabList
              onChange={handleTabChange}
              aria-label="App navigation tabs"
            >
              {TABS.map(({ label, value }) => (
                <Tab key={value} label={label} value={value} />
              ))}
            </TabList>
          </Box>
          {TABS.map(({ value, component }) => (
            <TabPanel key={value} value={value}>
              {component}
            </TabPanel>
          ))}
        </TabContext>
      </SpaceBackground>
    </JobsProvider>
  );
}

export default App;
