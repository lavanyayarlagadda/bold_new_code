import React from "react";
import { Box, TextField, Typography, Button } from "@mui/material";

interface ServiceFormProps {
  templateType: string;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ templateType }) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {templateType} Configuration
      </Typography>

      <TextField
        fullWidth
        label="Service Name"
        placeholder={`Enter ${templateType.toLowerCase()} name`}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Description"
        placeholder={`Describe your ${templateType.toLowerCase()}`}
        multiline
        rows={3}
        sx={{ mb: 2 }}
      />

      {/* Add your existing frequency and task logic here */}
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Tasks
      </Typography>
      {/* Your task list component or logic goes here */}

      <Button variant="contained" sx={{ mt: 3 }}>
        Save {templateType}
      </Button>
    </Box>
  );
};

export default ServiceForm;
