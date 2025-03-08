import React from 'react';
import { Container, Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { JobsContext } from './JobsContext';
import { DataGrid, useGridApiRef } from '@mui/x-data-grid';
import { CustomPaper } from './components/CustomPaper';

const paginationModel = { page: 0, pageSize: 5 };

const COLS = [
  { field: 'skill', headerName: 'Skill', width: 200 },
  { field: 'job', headerName: 'Job Title', width: 400 },
  { field: 'company', headerName: 'Company', width: 300 },
];

function SkillsView({ jobsToUpdate, setCurrentView }) {
  const { jobs, saveJobs } = React.useContext(JobsContext);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const apiRef = useGridApiRef();
  const [rows, setRows] = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState(false); // To manage dialog visibility
  const [selectedSkill, setSelectedSkill] = React.useState(''); // To store selected skill
  const [selectedSkillIdx, setSelectedSkillIdx] = React.useState(null); // To store selected skill index
  const [selectedJobIdx, setSelectedJobIdx] = React.useState(null); // To store job index

  const handleEdit = () => {
    if (rowSelectionModel.length === 1) {
      const selectedRow = rows[rowSelectionModel[0]]; // Get the selected row
      setSelectedSkill(selectedRow.skill); // Set the current skill to edit
      setSelectedSkillIdx(selectedRow.skill_idx); // Set skill index for updating
      setSelectedJobIdx(selectedRow.job_idx); // Set job index for updating
      setOpenDialog(true); // Open the dialog
    } else {
      alert("Please select exactly one skill to edit.");
    }
  };

  const handleRemove = () => {
    const newJobs = jobs.map((job, jobIdx) => {
      if (jobsToUpdate.includes(jobIdx)) {
        const skillsIdxToRemove = rowSelectionModel
          .filter((rowIndex) => rows[rowIndex].job_idx === jobIdx)
          .map((rowIndex) => rows[rowIndex].skill_idx);
        console.log(`from job ${jobIdx} removing skills`);
        console.log(skillsIdxToRemove);
        return {
          ...job,
          skills: job.skills.filter((_, idx) => !skillsIdxToRemove.includes(idx)),
        };
      }
      return job;
    });
    saveJobs(newJobs);
    setRowSelectionModel([]);
  };

  const handleBack = () => {
    setCurrentView("jobs");
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog without saving
  };

  const handleSaveSkill = () => {
    if (selectedSkillIdx !== null && selectedJobIdx !== null) {
      // Update the skill in the jobs list
      const newJobs = jobs.map((job, jobIdx) => {
        if (jobIdx === selectedJobIdx) {
          const newSkills = [...job.skills];
          newSkills[selectedSkillIdx] = selectedSkill; // Update the selected skill
          return { ...job, skills: newSkills };
        }
        return job;
      });
      saveJobs(newJobs);
      setOpenDialog(false); // Close the dialog after saving
    }
  };

  React.useEffect(() => {
    const newRows = [];
    let k = 0;
    for (let i = 0; i < jobsToUpdate.length; i++) {
      const job = jobs[jobsToUpdate[i]];
      for (let j = 0; j < job.skills.length; j++) {
        newRows.push({
          id: k,
          skill: job.skills[j],
          skill_idx: j,
          job: job.jobTitle,
          job_idx: jobsToUpdate[i],
          company: job.companyName,
        });
        k++;
      }
    }
    setRows(newRows);
  }, [jobs]);

  return (
    <CustomPaper>
      <Typography variant="h2" component="h2" align="center">Skills</Typography>
      <DataGrid
        rows={rows}
        columns={COLS}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
        onRowSelectionModelChange={(newSelection) => {
          setRowSelectionModel(newSelection);
        }}
        rowSelectionModel={rowSelectionModel}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Button type="submit" variant="outlined" onClick={handleBack}>Back </Button>
        <Button type="submit" variant="outlined" onClick={handleEdit}>Edit</Button>
        <Button type="submit" variant="outlined" onClick={handleRemove}>Remove</Button>
      </Box>

      {/* Dialog to edit the skill */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Skill</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="skill"
            label="Skill Name"
            type="text"
            fullWidth
            variant="outlined"
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveSkill} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </CustomPaper>
  );
}

export { SkillsView };
