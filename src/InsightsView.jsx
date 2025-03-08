import React from 'react';
import { JobsContext } from './JobsContext';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import { CustomPaper } from './components/CustomPaper';
import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';
import { DataView } from './DataView';
import { Card } from './Card';
const paginationModel = { page: 0, pageSize: 5 };

const InsightsViewContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));
const columns = [
  // { field: 'id', headerName: 'ID', width: 70 },
  { field: 'skills', headerName: 'Skills', width: 130 },
  { field: 'count', headerName: 'Count', width: 130 },
];
const rows = [
  { id: 1, skills: 'JavaScript', count: 100 },
  { id: 2, skills: 'Python', count: 200 },
]


function InsightsView() {
  const { jobs } = React.useContext(JobsContext);
  const [rows, setRows] = React.useState([]);
  React.useEffect(() => {
    const skills = new Map();
    for (let i = 0; i < jobs.length; i++) {
      for (let j = 0; j < jobs[i].skills.length; j++) {
        const skill = jobs[i].skills[j].trim();
        if (skills.has(skill)) {
          skills.set(skill, skills.get(skill) + 1);
        } else {
          skills.set(skill, 1);
        }
      }
    }
    const newRows = [];
    let id = 0;
    skills.forEach((value, key) => {
      newRows.push({ id: id++, skills: key, count: value });
    });
    setRows(newRows);

  }, [jobs]);
  return (
    <InsightsViewContainer
      direction="column"
      justifyContent="space-between"
    >
      <CustomPaper>
        <DataGrid
          rows={rows}
          columns={columns}
          sortModel={[
            {
              field: 'count',
              sort: 'desc', // or 'asc' for ascending
            },
          ]}
          sx={{ border: 0 }}
          initialState={{ pagination: { paginationModel } }}

          pageSizeOptions={[5, 10]}
        >
        </DataGrid>
      </CustomPaper>
    </InsightsViewContainer>
  )
}
export { InsightsView };
