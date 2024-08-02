"use client";
import { useState } from 'react';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

const darkModeStyles = {
  backgroundColor: '#121212',
  color: '#ffffff',
};

const lightModeStyles = {
  backgroundColor: '#ffffff',
  color: '#000000',
};

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sendPasswordResetEmail] = useSendPasswordResetEmail(auth);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleSendResetEmail = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(email);
      alert('Password reset email sent! Please check your inbox.');
      router.push('/login');
    } catch (error) {
      console.error("Error sending password reset email: ", error);
    }
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
        ...(darkMode ? darkModeStyles : lightModeStyles),
      }}
    >
      <Button variant="outlined" onClick={toggleTheme} sx={{ mb: 2 }}>
        Toggle Dark Mode
      </Button>
      <Typography variant='h4' sx={{ mb: 2 }}>
        Forgot Password
      </Typography>
      <Box component="form" onSubmit={handleSendResetEmail} sx={{ width: '100%', maxWidth: '400px' }}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
          Send Password Reset Email
        </Button>
      </Box>
    </Box>
  );
}
