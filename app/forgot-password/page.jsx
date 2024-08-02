"use client";
import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    // Implement your password reset logic here
    console.log("Password reset requested for:", email);
    // After successful password reset, navigate to login page
    router.push('/login');
  };

  const handleBack = () => {
    router.push('/login'); // Navigate to login page
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        // Apply darkMode or lightMode styles if needed
      }}
    >
      <Typography variant='h4' sx={{ mb: 2 }}>
        Reset Password
      </Typography>
      <Box component="form" onSubmit={handleResetPassword} sx={{ width: '100%', maxWidth: '400px' }}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
          Reset Password
        </Button>
        <Button variant="text" onClick={handleBack} sx={{ mb: 2 }} >
          Back to Login
        </Button>
      </Box>
    </Box>
  );
}
