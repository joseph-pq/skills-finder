import LinearProgress from '@mui/material/LinearProgress';
import { JobsContext } from './JobsContext';
import { Button, Box } from '@mui/material';
import React from 'react';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CustomPaper } from './components/CustomPaper';

const paginationModel = { page: 0, pageSize: 5 };


function DataView() {
  const { jobs, saveJobs, apiToken } = React.useContext(JobsContext);
  const apiRef = useGridApiRef();
  const rows = []
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [showProgressBar, setShowProgressBar] = React.useState(false);

  // Parse jobs. if job has skills but no description, move skills content to description
  // const newJobs = jobs.map((job) => {
  //   if (job.skills && !job.description) {
  //     return {
  //       ...job,
  //       description: job.skills,
  //       skills: [],
  //     };
  //   }
  //   return job;
  // });
  // saveJobs(newJobs);
  const sleep = ms => new Promise(r => setTimeout(r, ms));

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
        From the given job description. Extract required LinkedIn skills as list with no plurals, only lower case, the simplest form to write the skill, avoid compound terms, do not use acronyms. Do not write generic skills. Extract skills based on context. These skills are job skills.

        """${jobs[i].description}"""

        Return only the extracted skills in a single line separated by semicolons.
        `;
        const result = await model.generateContent(prompt);
        await sleep(1000)
        const skills_str = result.response.text();
        const skills = skills_str.split(";");
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
  }


  const handleRemove = () => {
    const selectedIDs = new Set(rowSelectionModel);
    const newJobs = jobs.filter((job, index) => !selectedIDs.has(index));
    saveJobs(newJobs);
    setRowSelectionModel([]);
  };
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
  }
  const importJobs = () => {
  }
  const exportJobs = () => {
    // export jobs in a json file
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(jobs)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = "jobs.json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }



  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    rows.push({
      id: i,
      Title: job.jobTitle,
      Company: job.companyName,
      Skills: job.skills,
    });
  }
  const columns = [
    // { field: 'id', headerName: 'ID', width: 70 },
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
  ]
  return (
    <CustomPaper>
      {showProgressBar &&
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      }
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
      </Box>
    </CustomPaper>
  );
}


export { DataView };
