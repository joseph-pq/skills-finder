import React, { useContext, useEffect, useState } from "react";
import { JobsContext } from "./JobsContext";
import {
  Container,
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
  FormControl,
} from "@mui/material";
import { CustomPaper } from "./components/CustomPaper";

function GroupsView({ setCurrentView }) {
  const { jobs, saveJobs } = useContext(JobsContext);
  const [groups, setGroups] = React.useState([]);
  const [newName, setNewName] = React.useState("");
  const joinGroup = (groupIdx, newName) => {
    // update jobs skills
    const newJobs = [...jobs];
    const group = groups[groupIdx];
    group.jobIdxs1.forEach((jobIdx) => {
      newJobs[jobIdx].skills = newJobs[jobIdx].skills.map((skill) =>
        skill.replace(group.skill1, newName)
      );
    });
    group.jobIdxs2.forEach((jobIdx) => {
      newJobs[jobIdx].skills = newJobs[jobIdx].skills.map((skill) =>
        skill.replace(group.skill2, newName)
      );
    });
    saveJobs(newJobs);
  };
  React.useEffect(() => {
    const skillsMap = new Map();
    jobs.forEach((job, jobIdx) => {
      job.skills.forEach((skill) => {
        const s = skill.toLowerCase().trim();
        if (skillsMap.has(s)) {
          skillsMap.get(s).push(jobIdx);
        } else {
          skillsMap.set(s, [jobIdx]);
        }
      });
    });
    const groups = [];
    // iterate over the map
    for (const [skill1, jobIdxs1] of skillsMap) {
      if (skill1.length == 1) {
        continue;
      }
      for (const [skill2, jobIdxs2] of skillsMap) {
        if (jobIdxs1 != jobIdxs2) {
          if (skill2.includes(skill1)) {
            groups.push({
              skill1: skill1,
              skill2: skill2,
              jobIdxs1: jobIdxs1,
              jobIdxs2: jobIdxs2,
              ignore: false,
            });
          }
        }
      }
    }
    setGroups(groups);
  }, []);
  const [groupIdx, setGroupIdx] = React.useState(0);
  return (
    <CustomPaper>
      <Typography variant="h2" component="h2" align="center">
        Grouping
      </Typography>
      <Box sx={{ display: "flex", width: "100%" }}>
        <Card variant="outlined">
          <FormControl>
            <TextField
              label="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </FormControl>
          <CardContent>
            <Typography variant="h5" component="h2">
              {groups[groupIdx]?.skill1}
            </Typography>
            <Typography variant="h5" component="h2">
              {groups[groupIdx]?.skill2}
            </Typography>
          </CardContent>
        </Card>
        <Button
          onClick={() => {
            const newGroups = [...groups];
            newGroups[groupIdx].ignore = true;
            setGroups(newGroups);
            // previous not ignored
            for (let i = 1; i < groups.length; i++) {
              const newGroupIdx = (groupIdx + groups.length - i) % groups.length;
              if (!groups[newGroupIdx].ignore) {
                setGroupIdx(newGroupIdx);
                return;
              }
            }
          }}
        >
          Previous
        </Button>
        <Button onClick={() => joinGroup(groupIdx, newName)}>Join</Button>
        <Button
          onClick={() => {
            const newGroups = [...groups];
            newGroups[groupIdx].ignore = true;
            setGroups(newGroups);
            // next not ignored
            for (let i = 1; i < groups.length; i++) {
              const newGroupIdx = (groupIdx + i) % groups.length;
              if (!groups[newGroupIdx].ignore) {
                setGroupIdx(newGroupIdx);
                return;
              }
            }
          }}
        >
          Next
        </Button>
      </Box>
    </CustomPaper>
  );
}

export { GroupsView };
