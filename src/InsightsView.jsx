import React, { useContext, useEffect, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { JobsContext } from './JobsContext';

const COLUMNS = [
  { field: 'skills', headerName: 'Skills', width: 400 },
  { field: 'count', headerName: 'Count', width: 130 },
];

const PAGINATION_MODEL = { page: 0, pageSize: 10 };

const getSkillsData = (jobs) => {
  const skillsCount = jobs
    .flatMap((job) => job.skills.map((skill) => skill.trim())) // Flatten skills array
    .reduce((acc, skill) => acc.set(skill, (acc.get(skill) || 0) + 1), new Map());

  return Array.from(skillsCount, ([skills, count], id) => ({ id, skills, count }));
};

export function InsightsView() {
  const { jobs } = useContext(JobsContext);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(getSkillsData(jobs));
  }, [jobs]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 20 }}>
        <DataGrid
          rows={rows}
          columns={COLUMNS}
          sortModel={[{ field: 'count', sort: 'desc' }]}
          sx={{ border: 0 }}
          initialState={{ pagination: { paginationModel: PAGINATION_MODEL } }}
          pageSizeOptions={[5, 10]}
        />
      </Box>
    </Container>
  );
}
