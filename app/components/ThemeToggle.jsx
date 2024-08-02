import { Button } from '@mui/material';

const ThemeToggle = ({ darkMode, toggleTheme }) => (
  <Button variant="outlined" onClick={toggleTheme} sx={{ mb: 2 }}>
    Toggle Dark Mode
  </Button>
);

export default ThemeToggle;
