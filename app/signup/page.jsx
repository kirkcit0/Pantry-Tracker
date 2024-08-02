"use client";
import { useState, useEffect } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { GoogleAuthProvider, signInWithPopup, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { Button, TextField, Box, Typography, Modal, Stack } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(email, password);
      setEmail('');
      setPassword('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result.user);
      router.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  const handlePhoneSignUp = async () => {
    if (!recaptchaVerifier) {
      const verifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
      setRecaptchaVerifier(verifier);
    }

    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      const code = prompt('Enter the verification code sent to your phone');
      await confirmationResult.confirm(code);
      router.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  return (
    <div className="container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSignUp}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      <Button variant='contained' color='primary' onClick={() => setModalOpen(true)}>
        Sign Up with Phone
      </Button>
      <Button variant='contained' color='primary' onClick={handleGoogleSignUp}>
        Sign Up with Google
      </Button>
      <div id="recaptcha-container"></div>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            Phone Number Sign Up
          </Typography>
          <Stack direction='row' spacing={2}>
            <TextField
              label="Phone Number"
              variant="outlined"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Button variant='contained' color='primary' onClick={handlePhoneSignUp}>
              Sign Up
            </Button>
          </Stack>
        </Box>
      </Modal>
      {error && <p>Error: {error.message}</p>}
      <p>
        Already have an account? <Link href="/login">Login here</Link>
      </p>
    </div>
  );
};

export default SignUp;
