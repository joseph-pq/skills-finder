import { Box, Container } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";

import { JobsContext } from "@/jobs-context";
import { Job, JobSkill, Skill, Table } from "@/types";

interface ViewColumn {
  field: string;
  headerName: string;
  width: number;
}

const COLUMNS: ViewColumn[] = [
  { field: "skills", headerName: "Skills", width: 400 },
  { field: "count", headerName: "Count", width: 130 },
];

const PAGINATION_MODEL = { page: 0, pageSize: 10 };

const getSkillsData = (
  jobs: Table<Job>,
  jobSkills: Table<JobSkill>,
  skills: Table<Skill>,
) => {
  const skillsCount = jobSkills.data.reduce(
    (acc, jobSkill) => {
      const skill = skills.data.find((s) => s.id === jobSkill.skillId);
      if (skill) {
        acc.set(skill.name, (acc.get(skill.name) || 0) + 1);
      }
      return acc;
    },
    new Map<string, number>(),
  );

  return Array.from(skillsCount, ([skills, count], id) => ({
    id,
    skills,
    count,
  }));
};

export function InsightsView() {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error("JobsContext must be used within a JobsProvider");
  }
  const { jobs, jobSkills, skills } = context;
  const [rows, setRows] = useState<
    Array<{ id: number; skills: string; count: number }>
  >([]);

  useEffect(() => {
    // Ensure all data is loaded before processing
    if (!context.loadingJobs && !context.loadingJobSkills && !context.loadingSkills) {
      setRows(getSkillsData(jobs, jobSkills, skills));
    }
  }, [jobs, jobSkills, skills, context.loadingJobs, context.loadingJobSkills, context.loadingSkills]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 10 }}>
        <DataGrid
          rows={rows}
          columns={COLUMNS}
          sortModel={[{ field: "count", sort: "desc" }]}
          sx={{ border: 0 }}
          initialState={{ pagination: { paginationModel: PAGINATION_MODEL } }}
          pageSizeOptions={[5, 10]}
        />
      </Box>
    </Container>
  );
}
