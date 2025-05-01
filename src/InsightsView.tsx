import { Box, Container } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useContext, useEffect, useState } from "react";

import { JobsContext } from "./JobsContext";
import { Job } from "./types";

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

const getSkillsData = (jobs: Job[]) => {
  const skillsCount = jobs
    .flatMap((job) => job.skills.map((skill: string) => skill.trim())) // Flatten skills array
    .reduce(
      (acc, skill) => acc.set(skill, (acc.get(skill) || 0) + 1),
      new Map(),
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
    throw new Error("ImagesContext must be used within an ImagesProvider");
  }
  const { jobs } = context;
  const [rows, setRows] = useState<
    Array<{ id: number; skills: string; count: number }>
  >([]);

  useEffect(() => {
    setRows(getSkillsData(jobs));
  }, [jobs]);

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
