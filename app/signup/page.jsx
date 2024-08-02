"use client";
import { useState } from 'react';
import { useCreateUserWithEmailAndPassword, useSendEmailVerification } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { Box, Button, TextField, Typography, IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Google as GoogleIcon, Phone as PhoneIcon } from '@mui/icons-material';
import { sendEmailVerification } from 'firebase/auth';
import { signInWithPopup, GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

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

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
  const [sendEmailVerification] = useSendEmailVerification(auth);
  const router = useRouter();

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      try {
        const userCredential = await createUserWithEmailAndPassword(email, password);
        await sendEmailVerification(userCredential.user);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        window.location.href = '/login';
      } catch (err) {
        console.error('Error signing up:', err.message);
      }
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    router.push('/');
  };

  const handlePhoneSignUp = async () => {
    try {
      const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      const verificationCode = window.prompt('Please enter the verification code that was sent to your phone.');
      await confirmationResult.confirm(verificationCode);
      router.push('/');
    } catch (error) {
      console.error('Error signing up with phone number:', error.message);
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
        Sign Up
      </Typography>
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
        <Button
          variant="text"
          onClick={() => router.push('/login')}
          sx={{ mt: 2 }}
        >
          Already have an account? Login
        </Button>
        <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center'}}>
          <IconButton onClick={handleGoogleSignUp} sx={iconStyle}>
            <GoogleIcon />
          </IconButton>
          {/* <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <IconButton onClick={handlePhoneSignUp} sx={iconStyle}>
            <PhoneIcon />
          </IconButton> */}
          <div id="recaptcha-container"></div>
        </Box>
      </Box>
    </Box>
  );
}
