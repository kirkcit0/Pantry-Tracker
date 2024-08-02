"use client";
import { useState, Suspense } from 'react';
import { Box, Typography } from '@mui/material';
import ThemeToggle from '../components/ThemeToggle';
import ResetPasswordForm from '../components/ResetPasswordForm';

const darkModeStyles = {
  backgroundColor: '#121212',
  color: '#ffffff',
};

const lightModeStyles = {
  backgroundColor: '#ffffff',
  color: '#000000',
};

const ResetPasswordPage = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
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
        <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
        <Typography variant='h4' sx={{ mb: 2 }}>
          Reset Password
        </Typography>
        <ResetPasswordForm darkMode={darkMode} />
      </Box>
    </Suspense>
  );
};

export default ResetPasswordPage;
