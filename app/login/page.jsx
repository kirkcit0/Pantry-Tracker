"use client";
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { GoogleAuthProvider, signInWithPopup, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { Button, TextField, Box, Typography, Modal, Stack } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(email, password);
      setEmail('');
      setPassword('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result.user);
      router.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  const handlePhoneSignIn = async () => {
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
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
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
          {loading ? 'Logging In...' : 'Login'}
        </button>
      </form>
      <Button variant='contained' color='primary' onClick={() => setModalOpen(true)}>
        Sign In with Phone
      </Button>
      <Button variant='contained' color='primary' onClick={handleGoogleSignIn}>
        Sign In with Google
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
            Phone Number Sign In
          </Typography>
          <Stack direction='row' spacing={2}>
            <TextField
              label="Phone Number"
              variant="outlined"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Button variant='contained' color='primary' onClick={handlePhoneSignIn}>
              Sign In
            </Button>
          </Stack>
        </Box>
      </Modal>
      {error && <p>Error: {error.message}</p>}
      <p>
        Don't have an account? <Link href="/signup">Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;
