import styled from '@mui/material/styles/styled';
import { JobsContext } from './JobsContext';
import {Button, Box} from '@mui/material';
import React from 'react';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const paginationModel = { page: 0, pageSize: 5 };

const CustomPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '1000px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));



function DataView() {
  const { jobs, saveJobs } = React.useContext(JobsContext);
  const apiRef = useGridApiRef();
  const rows = []
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);

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


  const extractSkills = () => {
  }


  const handleRemove = () => {
    const selectedIDs = new Set(rowSelectionModel);
    const newJobs = jobs.filter((job, index) => !selectedIDs.has(index));
    saveJobs(newJobs);
    setRowSelectionModel([]);
  }
  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    rows.push({
      id: i,
      Title: job.jobTitle,
      Company: job.companyName,
      Description: job.description,
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
      field: "Description",
      headerName: "Description",
      width: 400,
    },
  ]
  return (
    <CustomPaper>
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
      <Button type="submit" variant="contained" onClick={handleRemove}>Remove</Button>
      <Button type="submit" variant="contained" onClick={extractSkills}>Extract Skills</Button>
      </Box>
    </CustomPaper>
  );
}


export { DataView };
