import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { DataView } from './DataView';

function StorageView() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 5 }}>
        <DataView />
      </Box>
    </Container>
  )
}
export { StorageView };
