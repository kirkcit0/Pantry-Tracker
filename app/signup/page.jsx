"use client";
import { useState } from 'react';
import { useCreateUserWithEmailAndPassword, useSendEmailVerification } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import ThemeToggle from '../components/ThemeToggle';
import SignupForm from '../components/SignUpForm';
import AuthButtons from '../components/AuthButtons';
import { GoogleAuthProvider, RecaptchaVerifier, signInWithPopup, signInWithPhoneNumber } from 'firebase/auth';

const darkModeStyles = {
  backgroundColor: '#121212',
  color: '#ffffff',
};

const lightModeStyles = {
  backgroundColor: '#ffffff',
  color: '#000000',
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
        router.push('/login');
      } catch (err) {
        console.error('Error signing up:', err.message);
      }
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    router.push('/home');
  };

  const handlePhoneSignUp = async () => {
    try {
      const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      const verificationCode = window.prompt('Please enter the verification code that was sent to your phone.');
      await confirmationResult.confirm(verificationCode);
      router.push('/home');
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
      <ThemeToggle darkMode={darkMode} toggleTheme={toggleTheme} />
      <Typography variant='h4' sx={{ mb: 2 }}>
        Sign Up
      </Typography>
      <SignupForm
        handleSubmit={handleSubmit}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
      />
      <Button
        variant="text"
        onClick={() => router.push('/login')}
        sx={{ mt: 2 }}
      >
        Already have an account? Login
      </Button>
      <AuthButtons
        handleGoogleSignUp={handleGoogleSignUp}
        handlePhoneSignUp={handlePhoneSignUp}
      />
    </Box>
  );
}
