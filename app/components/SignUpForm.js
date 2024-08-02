import { Box, Button, TextField } from '@mui/material';

const SignupForm = ({ handleSubmit, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword }) => (
  <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: '400px' }}>
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
    <TextField
      label="Confirm Password"
      type="password"
      variant="outlined"
      fullWidth
      margin="normal"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
    />
    <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
      Sign Up
    </Button>
  </Box>
);

export default SignupForm;
