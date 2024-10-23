'use client';
import { useState } from 'react';
import Header from './components/Header';
import DragDropLists from './components/TaskList';
import CalendarComponent from './components/Calendar';
import './styles/global.scss'; // Import global styles

const App = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div className={`dashboard ${darkMode ? 'dark-mode' : ''}`} style={{transition: '1s ease'}}>
      <div className="main-content">
        <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <div className="tasks" style={{transition: '1s ease'}}>
          <DragDropLists darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </div>
        <CalendarComponent darkMode={darkMode} />
      </div>
    </div>
  );
};

export default App;
