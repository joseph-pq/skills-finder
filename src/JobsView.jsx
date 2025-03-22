import React from "react";
import { Button, Box } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { JobsContext } from "./JobsContext";
import { CustomPaper } from "./components/CustomPaper";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";

// Initial pagination model for the data grid
const paginationModel = { page: 0, pageSize: 5 };

/**
 * JobsView component displays a list of jobs and provides functionalities
 * to manage job entries and extract skills from job descriptions.
 */
function JobsView({ setCurrentView, setJobsToUpdate }) {
  const { jobs, saveJobs, apiToken } = React.useContext(JobsContext);
  const apiRef = useGridApiRef();
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [showProgressBar, setShowProgressBar] = React.useState(false);

  // Utility function to pause execution for a given time
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const goToGroups = () => {
    setCurrentView("groups");
  }

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
  const removeJob = (id) => {
    const newJobs = jobs.filter((_, index) => index !== id);
    saveJobs(newJobs);
  };

  /**
   * Removes skills from a specific job entry.
   */
  const clearJob = (id) => {
    const newJobs = jobs.map((job, index) => {
      if (index === id) {
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
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const importedJobs = JSON.parse(reader.result);
          saveJobs(importedJobs);
        } catch (error) {
          console.error("Error parsing JSON file:", error);
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
    const file = new Blob([JSON.stringify(jobs)], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = "jobs.json";
    document.body.appendChild(element);
    element.click();
  };

  /**
   * Sets the current view to edit skills for selected job entries.
   */
  const openSkill = (jobIdx) => {
    setJobsToUpdate(jobIdx);
    setCurrentView("skills");
  };

  // Prepare rows for the data grid
  const rows = jobs.map((job, index) => ({
    id: index,
    title: job.jobTitle,
    company: job.companyName,
    skills: job.skills,
  }));
  console.log(rows);

  // Define columns for the data grid
  const columns = [
    {
      field: "title",
      headerName: "Title",
      width: 450,
    },
    {
      field: "company",
      headerName: "Company",
      width: 100,
    },
    {
      field: "skills",
      headerName: "Skills",
      width: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button onClick={() => openSkill(params.id)}>
            <OpenInNewIcon />
          </Button>
          <Button onClick={() => removeJob(params.id)}>
            <DeleteOutlineIcon />
          </Button>
          <Button onClick={() => clearJob(params.id)}>
            <CleaningServicesIcon />
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <CustomPaper>
      {showProgressBar && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{ border: 0 }}
      />
      <Box
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        <Button type="submit" variant="outlined" onClick={exportJobs}>
          Export Jobs
        </Button>
        <Button type="submit" variant="outlined" onClick={importJobs}>
          Import Jobs
        </Button>
        <Button type="submit" variant="outlined" onClick={extractSkills}>
          Extract Skills
        </Button>
        <Button type="submit" variant="outlined" onClick={goToGroups}>
          Groups
        </Button>
      </Box>
    </CustomPaper>
  );
}

export { JobsView };
