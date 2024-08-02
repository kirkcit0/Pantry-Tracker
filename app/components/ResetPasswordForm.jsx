import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { getAuth, confirmPasswordReset } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

const ResetPasswordForm = ({ darkMode }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const oobCode = searchParams.get('oobCode');

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
  );
};

export default ResetPasswordForm;
