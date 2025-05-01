import {
  Button,
  FormLabel,
  TextField,
  Typography,
  FormControl,
  Box,
  Container,
} from "@mui/material";
import { useState, useContext } from "react";

import { Card } from "@/components/card";
import { JobsContext } from "@/jobs-context";

const JobForm = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error("ImagesContext must be used within an ImagesProvider");
  }
  const { addJob } = context
  const [formValues, setFormValues] = useState({
    jobTitle: "",
    companyName: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { jobTitle, companyName, description } = formValues;
    addJob({ jobTitle, companyName, description, skills: [] });

    // Clear form values after submission
    setFormValues({
      jobTitle: "",
      companyName: "",
      description: "",
    });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 10 }}>
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Add a Job Posting
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <JobField
              label="Job Title"
              name="jobTitle"
              value={formValues.jobTitle}
              onChange={handleChange}
              required
            />
            <JobField
              label="Company Name"
              name="companyName"
              value={formValues.companyName}
              onChange={handleChange}
              required
            />
            <JobField
              label="Job Description"
              name="description"
              value={formValues.description}
              onChange={handleChange}
              multiline
              minRows={4}
              maxRows={6}
              required
            />
            <Button type="submit" variant="contained">
              Add Job
            </Button>
          </Box>
        </Card>
      </Box>
    </Container>
  );
};

// Extracted reusable field component
const JobField = ({ label, ...props }: { label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean; multiline?: boolean; minRows?: number; maxRows?: number; }) => (
  <FormControl>
    <FormLabel htmlFor={props.name}>{label}</FormLabel>
    <TextField id={props.name} {...props} />
  </FormControl>
);

export default JobForm;
