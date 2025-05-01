import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  FormControl,
} from "@mui/material";
import React, { useContext } from "react";

import { CustomPaper } from "./components/CustomPaper";
import { JobsContext } from "./JobsContext";

interface Group {
  skill1: string;
  skill2: string;
  jobIdxs1: number[];
  jobIdxs2: number[];
  ignore: boolean;
}

function GroupsView() {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error("ImagesContext must be used within an ImagesProvider");
  }
  const { jobs, saveJobs } = context;
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [newName, setNewName] = React.useState("");
  const joinGroup = (groupIdx: number, newName: string) => {
    // update jobs skills
    const newJobs = [...jobs];
    const group = groups[groupIdx];
    group.jobIdxs1.forEach((jobIdx: number) => {
      newJobs[jobIdx].skills = newJobs[jobIdx].skills.map((skill) =>
        skill.replace(group.skill1, newName),
      );
    });
    group.jobIdxs2.forEach((jobIdx) => {
      newJobs[jobIdx].skills = newJobs[jobIdx].skills.map((skill) =>
        skill.replace(group.skill2, newName),
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
  }, [jobs]);
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
              const newGroupIdx =
                (groupIdx + groups.length - i) % groups.length;
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
