import { Box, Button, IconButton } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';

const AuthButtons = ({ handleGoogleSignIn, handlePhoneSignIn }) => (
  <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
    <IconButton onClick={handleGoogleSignIn} sx={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#f5f5f5', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <GoogleIcon />
    </IconButton>
    <div id="recaptcha-container"></div>
  </Box>
);

export default AuthButtons;
