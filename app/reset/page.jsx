"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, confirmPasswordReset } from 'firebase/auth';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useSearchParams } from 'next/navigation';

const darkModeStyles = {
  backgroundColor: '#121212',
  color: '#ffffff',
};

const lightModeStyles = {
  backgroundColor: '#ffffff',
  color: '#000000',
};

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get('oobCode'); // This is the code sent in the reset email

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword === confirmNewPassword) {
      try {
        const auth = getAuth();
        await confirmPasswordReset(auth, oobCode, newPassword);
        alert('Password has been reset successfully!');
        router.push('/login');
      } catch (error) {
        console.error("Error resetting password: ", error);
      }
    } else {
      alert('Passwords do not match');
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
        Reset Password
      </Typography>
      <Box component="form" onSubmit={handleResetPassword} sx={{ width: '100%', maxWidth: '400px' }}>
        <TextField
          label="New Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextField
          label="Confirm New Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
        <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
          Reset Password
        </Button>
      </Box>
    </Box>
  );
}
