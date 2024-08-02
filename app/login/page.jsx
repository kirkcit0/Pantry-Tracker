"use client";
import { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, CircularProgress, Alert } from '@mui/material';
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';
import { useRouter } from 'next/navigation';
import AuthButtons from '../components/AuthButtons';
import { GoogleAuthProvider, RecaptchaVerifier, signInWithPopup, signInWithPhoneNumber, signInAnonymously } from 'firebase/auth';

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

const errorMessages = {
  'auth/invalid-email': 'Invalid email address.',
  'auth/user-not-found': 'No user found with this email.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/user-disabled': 'User account is disabled.',
  'auth/too-many-requests': 'Too many login attempts. Try again later.',
  'auth/network-request-failed': 'Network error. Please try again.',
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [signInWithEmailAndPassword, user, loadingAuth, error] = useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle, googleUser] = useSignInWithGoogle(auth);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkVerification = async () => {
      if (user) {
        const userEmailVerified = auth.currentUser?.emailVerified;
        if (userEmailVerified) {
          router.push('/home');
        } else {
          setErrorMessage('Please verify your email before logging in.');
          await auth.signOut(); // Log out the user if not verified
        }
      }
      if (googleUser) {
        router.push('/home');
      }
    };
    checkVerification();
  }, [user, googleUser, router]);

  useEffect(() => {
    if (error) {
      setErrorMessage(errorMessages[error.code] || 'Invalid login, please try again.');
    }
  }, [error]);

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const result = await signInWithEmailAndPassword(email, password);
      if (result.user && !result.user.emailVerified) {
        setErrorMessage('Please verify your email before logging in.');
        await auth.signOut(); // Log out the user if not verified
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    router.push('/home');
  };
  
  const handleAnonAuth = async () => {
    try {
      await signInAnonymously(auth);
      router.push('/home');
    } catch (error) {
      console.error('Error signing in anonymously:', error.message);
    }
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
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
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
        <AuthButtons
          handleGoogleAuth={handleGoogleAuth}
          handleAnonAuth={handleAnonAuth}
        />
      </Box>
    </Box>
  );
}
