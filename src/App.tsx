'use client';
import { useState } from 'react';
import Header from './components/Header';
import TaskList from './components/TaskList';
import './styles/global.scss'; // Import global styles

const App = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div className={`dashboard ${darkMode ? 'dark-mode' : ''}`}
      style={{ transition: '1s ease', borderRadius: '1rem'}}>
      <div className="main-content">
        <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <div className="tasks" style={{ transition: '1s ease' }}>
          <TaskList darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </div>
      </div>
    </div>
  );
};

export default App;
  