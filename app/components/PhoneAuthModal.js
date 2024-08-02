"use client";
import { useState } from 'react';
import { Box, Button, TextField, Modal, Typography } from '@mui/material';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';

const PhoneAuthModal = ({ open, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [step, setStep] = useState('input'); // 'input' or 'verify'
  const router = useRouter();

  const handlePhoneNumberSubmit = async () => {
    try {
      const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
      const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setConfirmationResult(result);
      setStep('verify');
    } catch (error) {
      console.error('Error sending verification code:', error.message);
    }
  };

  const handleVerificationCodeSubmit = async () => {
    try {
      await confirmationResult.confirm(verificationCode);
      router.push('/home');
    } catch (error) {
      console.error('Error confirming verification code:', error.message);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box
        sx={{
          width: '300px',
          p: 3,
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        {step === 'input' ? (
          <Box component="form" onSubmit={(e) => e.preventDefault()}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Enter your phone number
            </Typography>
            <TextField
              label="Phone Number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={handlePhoneNumberSubmit}
              fullWidth
              sx={{ mt: 2 }}
            >
              Send Verification Code
            </Button>
            <div id="recaptcha-container" style={{ marginTop: '16px' }}></div>
          </Box>
        ) : (
          <Box component="form" onSubmit={(e) => e.preventDefault()}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Enter the verification code
            </Typography>
            <TextField
              label="Verification Code"
              variant="outlined"
              fullWidth
              margin="normal"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={handleVerificationCodeSubmit}
              fullWidth
              sx={{ mt: 2 }}
            >
              Verify Code
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default PhoneAuthModal;
