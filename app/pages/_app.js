// pages/_app.js
import * as React from 'react';
import { ThemeProvider, CssBaseline, Button } from '@mui/material';
import { lightTheme, darkTheme } from '../theme';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [darkMode, setDarkMode] = useState(false);

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Component {...pageProps} darkMode={darkMode} toggleTheme={handleThemeChange} />
    </ThemeProvider>
  );
}

export default MyApp;
