import styled from '@mui/material/styles/styled';
import { JobsContext } from './JobsContext';
import Button from '@mui/material/Button';
import React from 'react';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

// const rows = [
//   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];

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
      <Button type="submit" variant="contained" onClick={handleRemove}>Remove</Button>
    </CustomPaper>
  );
}


export { DataView };
