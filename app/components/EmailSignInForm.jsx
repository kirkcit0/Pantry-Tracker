import { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';

const EmailSignInForm = ({ handleEmailSignIn, email, setEmail, password, setPassword }) => (
  <Box component="form" onSubmit={handleEmailSignIn} sx={{ width: '100%', maxWidth: '400px' }}>
    <TextField
      label="Email"
      variant="outlined"
      fullWidth
      margin="normal"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
    <TextField
      label="Password"
      type="password"
      variant="outlined"
      fullWidth
      margin="normal"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
      Login
    </Button>
  </Box>
);

export default EmailSignInForm;
