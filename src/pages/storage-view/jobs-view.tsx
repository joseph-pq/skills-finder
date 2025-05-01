import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Button, Box } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useContext, useState } from "react";

import { CustomPaper } from "@/components/custom-paper";
import { extractSkillsFromDescription } from "@/features/llm/api/extract-skills";
import { JobsContext } from "@/jobs-context";
import { StorageViewType, Table, Job, Skill, JobSkill } from "@/types";
import { sleep } from "@/utils";

// Define the props for the JobsView component
interface JobsViewProps {
  setCurrentView: (view: StorageViewType) => void;
  setJobsToUpdate: (jobIdx: number) => void;
}

// Initial pagination model for the data grid
const paginationModel = { page: 0, pageSize: 5 };

/**
 * JobsView component displays a list of jobs and provides functionalities
 * to manage job entries and extract skills from job descriptions.
 */
function JobsView({ setCurrentView, setJobsToUpdate }: JobsViewProps) {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error("JobsContext must be used within an JobsProvider");
  }
  const {
    jobs,
    saveJobs,
    saveJobSkills,
    saveSkills,
    skills,
    apiToken,
    getSkills,
    addSkillsToJob,
    removeAllSkillsFromJob,
    jobSkills,
  } = context;
  const [showProgressBar, setShowProgressBar] = useState<boolean>(false);

  /**
   * Extracts skills from job descriptions using Google Generative AI.
   * Updates the job entries with the extracted skills.
   */
  const extractSkills = async () => {
    const jobsCopy = [...jobs.data];
    setShowProgressBar(true);
    const currentSkills = skills.data.map((skill) => skill.name);

    for (let i = 0; i < jobs.data.length; i++) {
      const skills = getSkills(jobs.data[i].id);
      if (!skills || skills.length === 0) {
        console.log("Skills not found");
        const skillsData = await extractSkillsFromDescription(
          jobs.data[i].title,
          jobs.data[i].description,
          apiToken,
          currentSkills,
        );
        addSkillsToJob(jobsCopy[i].id, skillsData);
        await sleep(1000);
      } else {
        console.log("Skills found");
        console.log(skills);
      }
    }
    setShowProgressBar(false);
  };

  /**
   * Removes selected job entries from the list.
   */
  const removeJob = (id: number): void => {
    const newJobsData = jobs.data.filter((_, index) => index !== id);
    saveJobs({
      ...jobs,
      data: newJobsData,
    });
  };

  /**
   * Imports job entries from a JSON file.
   */
  const importJobs = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const importedData: {
              jobs: Table<Job>;
              skills: Table<Skill>;
              jobSkills: Table<JobSkill>;
            } = JSON.parse(reader.result as string);
            saveJobs(importedData.jobs);
            saveSkills(importedData.skills);
            saveJobSkills(importedData.jobSkills);
          } catch (error) {
            console.error("Error parsing JSON file:", error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  /**
   * Exports current job entries to a JSON file.
   */
  const exportJobs = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify({ jobs, skills, jobSkills })], {
      type: "application/json",
    });
    element.href = URL.createObjectURL(file);
    element.download = "jobs.json";
    document.body.appendChild(element);
    element.click();
  };

  /**
   * Sets the current view to edit skills for selected job entries.
   */
  const openSkill = (jobIdx: number): void => {
    setJobsToUpdate(jobIdx);
    setCurrentView(StorageViewType.Skills);
  };

  // Prepare rows for the data grid
  const rows = jobs.data.map((job, index) => ({
    id: index,
    title: job.title,
    company: job.company,
    skills: getSkills(job.id)
      .map((skill) => skill.name)
      .join(", "),
  }));

  // Define columns for the data grid
  const columns: GridColDef[] = [
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
          <Button onClick={() => openSkill(params.id as number)}>
            <OpenInNewIcon />
          </Button>
          <Button onClick={() => removeJob(params.id as number)}>
            <DeleteOutlineIcon />
          </Button>
          {/* <Button onClick={() => clearJob(params.id as number)}> */}
          <Button
            onClick={() =>
              removeAllSkillsFromJob(jobs.data[params.id as number].id)
            }
          >
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
        <Button
          type="submit"
          variant="outlined"
          onClick={() => setCurrentView(StorageViewType.Groups)}
        >
          Groups
        </Button>
      </Box>
    </CustomPaper>
  );
}

export { JobsView };
