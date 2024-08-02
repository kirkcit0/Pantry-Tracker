"use client";
import { useState } from 'react';
import { Box, Button, TextField, Typography, Avatar, IconButton, CircularProgress } from '@mui/material';
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';
import { useRouter } from 'next/navigation';
import { Google as GoogleIcon } from '@mui/icons-material';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const darkModeStyles = {
  backgroundColor: '#121212',
  color: '#ffffff',
};

const lightModeStyles = {
  backgroundColor: '#ffffff',
  color: '#000000',
};

const iconStyle = {
  width: 48,
  height: 48,
  borderRadius: '50%',
  backgroundColor: '#f5f5f5',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [signInWithEmailAndPassword, user, loadingAuth, error] = useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle, googleUser] = useSignInWithGoogle(auth);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(email, password);
      if (user) {
        router.push('/home');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signInWithGoogle();
    if (googleUser) {
      router.push('/home');
    }
    setLoading(false);
  };

  const handlePhoneSignIn = async () => {
    try {
      const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      const verificationCode = window.prompt('Please enter the verification code that was sent to your phone.');
      await confirmationResult.confirm(verificationCode);
      router.push('/home');
    } catch (error) {
      console.error('Error signing in with phone number:', error.message);
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
        Login
      </Typography>
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
        <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Login'}
        </Button>
        <Button
          variant="text"
          onClick={() => router.push('/forgot-password')}
          sx={{ mt: 2 }}
        >
          Forgot Password?
        </Button>
        <Button
          variant="text"
          onClick={() => router.push('/signup')}
          sx={{ mt: 2 }}
        >
          Don&apos;t have an account? Sign Up
        </Button>
        <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center'}}>
          <IconButton onClick={handleGoogleSignIn} sx={iconStyle} disabled={loading}>
            <GoogleIcon />
          </IconButton>
          <div id="recaptcha-container"></div>
        </Box>
      </Box>
    </Box>
  );
}
