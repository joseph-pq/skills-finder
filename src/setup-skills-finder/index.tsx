import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Input,
  InputAdornment,
  Container,
  IconButton,
  Button,
  FormControl,
  Box,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import React from "react";

// import { FormCardContainer } from '../FormCardContainer';
import { Card } from "../Card";
import { JobsContext } from "../JobsContext";

function SetupSkillsFinder() {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error("ImagesContext must be used within an ImagesProvider");
  }
  const { apiToken, saveApiToken } = context;
  const [localApiToken, setLocalApiToken] = React.useState("");
  const [showApiToken, setShowApiToken] = React.useState(false);

  const handleClickShowApiToken = () => setShowApiToken((show) => !show);
  React.useEffect(() => {
    setLocalApiToken(apiToken);
  }, [apiToken]);

  const handleMouseDownApiToken = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    saveApiToken(localApiToken);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 30 }}>
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Api Token
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
            <FormControl>
              <Input
                id="standard-adornment-password"
                type={showApiToken ? "text" : "password"}
                value={localApiToken}
                onChange={(event) => setLocalApiToken(event.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showApiToken
                          ? "hide the password"
                          : "display the password"
                      }
                      onClick={handleClickShowApiToken}
                      onMouseDown={handleMouseDownApiToken}
                    >
                      {showApiToken ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ mt: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Card>
      </Box>
    </Container>
  );
}

export { SetupSkillsFinder };
