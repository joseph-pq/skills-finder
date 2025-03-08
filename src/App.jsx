import React, { useState } from 'react';
import { Box, Tab } from '@mui/material';
import { JobsProvider } from './JobsContext';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import Space from './Space.js';
import JobForm from './JobForm';
import { SetupSkillsFinder } from './SetupSkillsFinder';
import { InsightsView } from './InsightsView';
import { StorageView } from './StorageView';


const TABS = [
  { label: 'Home', value: '1', component: <SetupSkillsFinder /> },
  { label: 'New Job', value: '2', component: <JobForm /> },
  { label: 'Current Jobs', value: '3', component: <StorageView /> },
  { label: 'Insights', value: '4', component: <InsightsView /> },
];

function App() {
  const [currentTab, setCurrentTab] = useState('1');

  const handleTabChange = (_, newValue) => setCurrentTab(newValue);

  return (
    <JobsProvider>
      <Space>
        <TabContext value={currentTab}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <TabList onChange={handleTabChange} aria-label="App navigation tabs">
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
      </Space>
    </JobsProvider>
  );
}

export default App;
