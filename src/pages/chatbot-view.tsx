import {
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  Paper,
} from "@mui/material";
import React, { useState, useContext } from "react";

import { getChatResponse } from "@/features/llm/api/chat";
import { JobsContext } from "@/jobs-context";

function ChatBotview() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "bot" }[]
  >([]);
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error("JobsContext must be used within an JobsProvider");
  }
  const { apiToken, jobs, skills, jobSkills } = context;

  const handleSendMessage = async () => {
    if (message.trim() !== "") {
      const userMessage = message;
      setMessages([...messages, { text: userMessage, sender: "user" }]);
      setMessage("");

      // Get bot response from AI
      const botResponse = await getChatResponse(
        userMessage,
        apiToken,
        jobs.data,
        skills.data,
        jobSkills.data,
      );
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botResponse, sender: "bot" },
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "70vh",
        width: "80%",
        margin: 'auto',
        border: "1px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
        <List>
          {messages.map((msg, index) => (
            <ListItem
              key={index}
              sx={{
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 1,
                  border: "1px solid",
                }}
              >
                <Typography variant="body1">{msg.text}</Typography>
              </Paper>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{ display: "flex", p: 2, borderTop: "1px solid #ccc" }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          sx={{ ml: 1 }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}

export { ChatBotview };
