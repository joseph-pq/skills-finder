import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Card,
  CardContent,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useContext } from "react";

import { CustomPaper } from "@/components/custom-paper";
import { JobsContext } from "@/jobs-context";
import { StorageViewType } from "@/types";

const paginationModel = { page: 0, pageSize: 8 };

const COLS = [{ field: "skill", headerName: "Skill", width: 200 }];

interface SkillsViewProps {
  jobToUpdate: number;
  setCurrentView: React.Dispatch<React.SetStateAction<StorageViewType>>;
}

interface Row {
  id: number;
  skill: string;
  skill_idx: number;
  job: string;
  job_idx: number;
  company: string;
}

function SkillsView({ jobToUpdate, setCurrentView }: SkillsViewProps) {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error("ImagesContext must be used within an ImagesProvider");
  }
  const { jobs, saveJobs } = context;
  const [hoveredSkill, setHoveredSkill] = React.useState<string | null>(null);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [rows, setRows] = React.useState<Row[]>([]);
  const [openDialog, setOpenDialog] = React.useState(false); // To manage dialog visibility
  const [selectedSkill, setSelectedSkill] = React.useState(""); // To store selected skill
  const [selectedSkillIdx, setSelectedSkillIdx] = React.useState<number | null>(
    null,
  ); // To store selected skill index
  const [selectedJobIdx, setSelectedJobIdx] = React.useState<number | null>(
    null,
  ); // To store job index

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
      if (jobIdx === jobToUpdate) {
        const skillsIdxToRemove = rowSelectionModel
          .filter((rowIndex) => rows[rowIndex].job_idx === jobIdx)
          .map((rowIndex) => rows[rowIndex].skill_idx);
        console.log(`from job ${jobIdx} removing skills`);
        console.log(skillsIdxToRemove);
        return {
          ...job,
          skills: job.skills.filter(
            (_, idx) => !skillsIdxToRemove.includes(idx),
          ),
        };
      }
      return job;
    });
    saveJobs(newJobs);
    setRowSelectionModel([]);
  };

  const handleBack = () => {
    setCurrentView(StorageViewType.Jobs);
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
    const job = jobs[jobToUpdate];
    for (let j = 0; j < job.skills.length; j++) {
      newRows.push({
        id: j,
        skill: job.skills[j],
        skill_idx: j,
        job: job.jobTitle,
        job_idx: jobToUpdate,
        company: job.companyName,
      });
    }
    setRows(newRows);
  }, [jobs, jobToUpdate]);

  const jobDescription = jobs[jobToUpdate]?.description || "";

  const getHighlightedDescription = () => {
    if (!hoveredSkill) return jobDescription;

    const regex = new RegExp(`\\b${hoveredSkill}\\b`, "gi");
    const parts = jobDescription.split(regex);

    return parts.map((part, index) => (
      <React.Fragment key={index}>
        {part}
        {index < parts.length - 1 && (
          <span style={{ backgroundColor: "red" }}>{hoveredSkill}</span>
        )}
      </React.Fragment>
    ));
  };

  return (
    <CustomPaper>
      <Typography variant="h2" component="h2" align="center">
        Skills
      </Typography>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
      >
        <Card sx={{ flex: 1, marginLeft: 2 }}>
          <CardContent>
            <Typography variant="h5" component="h2">
              Job Description
            </Typography>
            <Typography variant="body2" component="p">
              {getHighlightedDescription()}
            </Typography>
          </CardContent>
        </Card>
        <Box sx={{ flex: 1 }}>
          <DataGrid
            rows={rows}
            columns={COLS}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[10, 20]}
            sx={{ border: 0 }}
            rowSelectionModel={rowSelectionModel}
            onRowClick={(params: { row: { skill: string } }) => {
              if (hoveredSkill === params.row.skill) setHoveredSkill(null);
              else setHoveredSkill(params.row.skill);
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button type="submit" variant="outlined" onClick={handleBack}>
              Back{" "}
            </Button>
            <Button type="submit" variant="outlined" onClick={handleEdit}>
              Edit
            </Button>
            <Button type="submit" variant="outlined" onClick={handleRemove}>
              Remove
            </Button>
          </Box>
        </Box>
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
