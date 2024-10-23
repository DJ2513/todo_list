import React from 'react';
import { AppBar, Toolbar, Typography, Switch } from '@mui/material';

interface HeaderProps {
  toggleDarkMode: () => void;
  darkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleDarkMode, darkMode }) => {
  return (
    <AppBar position="static" style={{backgroundColor: darkMode ? '#0f4982' : '#1976d2', transition: "1s ease"}}>
      <Toolbar>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          Task Manager
        </Typography>
        <Switch checked={darkMode} onChange={toggleDarkMode} >
        </Switch>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
