import React from 'react';
import { Button, Box } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { JobsContext } from './JobsContext';
import { CustomPaper } from './components/CustomPaper';

// Initial pagination model for the data grid
const paginationModel = { page: 0, pageSize: 5 };

/**
 * JobsView component displays a list of jobs and provides functionalities
 * to manage job entries and extract skills from job descriptions.
 */
function JobsView({ setCurrentView, setJobsToUpdate }) {
  const { jobs, saveJobs, apiToken } = React.useContext(JobsContext);
  const apiRef = useGridApiRef();
  const rows = [];
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [showProgressBar, setShowProgressBar] = React.useState(false);

  // Utility function to pause execution for a given time
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  /**
   * Extracts skills from job descriptions using Google Generative AI.
   * Updates the job entries with the extracted skills.
   */
  const extractSkills = async () => {
    const genAI = new GoogleGenerativeAI(apiToken);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const jobsCopy = [...jobs];
    let updated = false;
    setShowProgressBar(true);

    for (let i = 0; i < jobs.length; i++) {
      if (!jobs[i].skills || jobs[i].skills.length === 0) {
        console.log("Skills not found");
        const prompt = `
        You are an expert linkedin bot that can extract skills from job descriptions like a pro
        to later identify trending skills in the job market.
        From the given job description. Extract required LinkedIn skills as list with no plurals, only lower case, the simplest form to write the skill, avoid compound terms, do not use acronyms. Do not write generic skills. Extract skills based on context.

        """${jobs[i].description}"""

        Return only the extracted skills in a single line separated by semicolons.
        `;
        const result = await model.generateContent(prompt);
        await sleep(1000);
        const skillsStr = result.response.text();
        const skills = skillsStr.split(";");
        jobsCopy[i].skills = skills;
        updated = true;
      } else {
        console.log("Skills found");
        console.log(jobs[i].skills);
      }
    }
    setShowProgressBar(false);
    if (updated) {
      saveJobs(jobsCopy);
    }
  };

  /**
   * Removes selected job entries from the list.
   */
  const handleRemove = () => {
    const selectedIDs = new Set(rowSelectionModel);
    const newJobs = jobs.filter((job, index) => !selectedIDs.has(index));
    saveJobs(newJobs);
    setRowSelectionModel([]);
  };

  /**
   * Removes skills from selected job entries.
   */
  const handleRemoveSkills = () => {
    const selectedIDs = new Set(rowSelectionModel);
    const newJobs = jobs.map((job, index) => {
      if (selectedIDs.has(index)) {
        return {
          ...job,
          skills: [],
        };
      }
      return job;
    });
    saveJobs(newJobs);
  };

  /**
   * Imports job entries from a JSON file.
   */
  const importJobs = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const importedJobs = JSON.parse(reader.result);
          saveJobs(importedJobs);
        } catch (error) {
          console.error('Error parsing JSON file:', error);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  /**
   * Exports current job entries to a JSON file.
   */
  const exportJobs = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(jobs)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = "jobs.json";
    document.body.appendChild(element);
    element.click();
  };

  /**
   * Sets the current view to edit skills for selected job entries.
   */
  const editSkills = () => {
    setJobsToUpdate(rowSelectionModel);
    setCurrentView("skills");
  };

  // Prepare rows for the data grid
  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    rows.push({
      id: i,
      Title: job.jobTitle,
      Company: job.companyName,
      Skills: job.skills,
    });
  }

  // Define columns for the data grid
  const columns = [
    {
      field: "Title",
      headerName: "Title",
      width: 450,
    },
    {
      field: "Company",
      headerName: "Company",
      width: 100,
    },
    {
      field: "Skills",
      headerName: "Skills",
      width: 400,
    },
  ];

  return (
    <CustomPaper>
      {showProgressBar && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      )}
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        onRowSelectionModelChange={(newSelection) => {
          setRowSelectionModel(newSelection);
        }}
        rowSelectionModel={rowSelectionModel}
        sx={{ border: 0 }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Button type="submit" variant="outlined" onClick={handleRemove}>Remove</Button>
        <Button type="submit" variant="outlined" onClick={handleRemoveSkills}>Remove skills</Button>
        <Button type="submit" variant="outlined" onClick={exportJobs}>Export Jobs</Button>
        <Button type="submit" variant="outlined" onClick={importJobs}>Import Jobs</Button>
        <Button type="submit" variant="outlined" onClick={extractSkills}>Extract Skills</Button>
        <Button type="submit" variant="outlined" onClick={editSkills}>Edit Skills</Button>
      </Box>
    </CustomPaper>
  );
}

export { JobsView };
