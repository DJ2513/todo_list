import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import './TaskList.scss';

interface CardItem {
  id: string;
  content: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

interface ListsState {
  tasks: CardItem[];
}

const prioritiesOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
];

const sortCriteriaOptions = [
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
];

const sortOrderOptions = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
];

const loadInitialTasks = (): ListsState => {
  const storedTasks = localStorage.getItem('tasks');
  return storedTasks ? JSON.parse(storedTasks) : {
    tasks: [
      { id: 'card1', content: 'Tarea 1', dueDate: '2024-10-20', priority: 'medium', completed: false },
      { id: 'card2', content: 'Tarea 2', dueDate: '2024-10-21', priority: 'high', completed: false },
      { id: 'card3', content: 'Tarea 3', dueDate: '2024-10-22', priority: 'low', completed: true },
    ],
  };
};

const TaskList: React.FC<{ darkMode: boolean, toggleDarkMode: () => void }> = ({ darkMode }) => {
  const [lists, setLists] = useState<ListsState>(loadInitialTasks);
  const [newTask, setNewTask] = useState<string>('');
  const [newDueDate, setNewDueDate] = useState<string>('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('low');
  const [filter, setFilter] = useState<string>('all');
  const [sortCriteria, setSortCriteria] = useState<string>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Guarda las tareas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(lists));
  }, [lists]);

  // Guarda los valores cuando se da enter
  const addTaskWithKB = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTask.trim() !== '') {
      const id = `card${lists.tasks.length + 1}`;
      const newTaskItem: CardItem = { id, content: newTask, dueDate: newDueDate, priority: newPriority, completed: false };
      setLists({ tasks: [...lists.tasks, newTaskItem] });
      setNewTask('');
      setNewDueDate('');
      setNewPriority('low');
    }
  };

  // Guarda los valores cuando le des click al boton de agregar
  const addTask = () => {
    if (newTask.trim() !== '') {
      const id = `card${lists.tasks.length + 1}`;
      const newTaskItem: CardItem = { id, content: newTask, dueDate: newDueDate, priority: newPriority, completed: false };
      setLists({ tasks: [...lists.tasks, newTaskItem] });
      setNewTask('');
      setNewDueDate('');
      setNewPriority('low');
    }
  };

  const deleteTask = (id: string) => {
    setLists((prev) => ({
      tasks: prev.tasks.filter((task) => task.id !== id),
    }));
  };

  const toggleTaskCompletion = (id: string) => {
    setLists((prev) => ({
      tasks: prev.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    }));
  };

  const editTask = (id: string, newContent: string, newDueDate: string, newPriority: 'low' | 'medium' | 'high') => {
    setLists((prev) => ({
      tasks: prev.tasks.map((task) =>
        task.id === id ? { ...task, content: newContent, dueDate: newDueDate, priority: newPriority } : task
      ),
    }));
  };

  // Filtra las opciones dependiendo si estan completas o pendientes
  const filteredTasks = lists.tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  //Filtra las tareas con base a cierta caracteristica de la misma
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const compareValue = sortOrder === 'asc' ? 1 : -1;
    if (sortCriteria === 'dueDate') {
      return compareValue * (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    } else {
      const priorityMap = { low: 1, medium: 2, high: 3 };
      return compareValue * (priorityMap[a.priority] - priorityMap[b.priority]);
    }
  });

  return (
    <section className={`task-list ${darkMode ? 'dark-mode' : ''}`} style={{ transition: '1s ease' }}>

      {/*Seccion para agragar una nueva tarea */}
      <div>
        <h4> New Task</h4>
        <TextField
          label="Add a new task"
          helperText="Type your task"
          variant="outlined"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={addTaskWithKB}
          InputProps={{ style: { color: darkMode ? 'white' : 'black', transition: '1s ease' } }}
          InputLabelProps={{ style: { color: darkMode ? 'lightgray' : 'black', transition: '1s ease' } }}
        />
        <TextField
          variant="outlined"
          type="date"
          helperText="Select a Due Date"
          value={newDueDate}
          onKeyDown={addTaskWithKB}
          onChange={(e) => setNewDueDate(e.target.value)}
          InputProps={{ style: { color: darkMode ? 'white' : 'black', transition: '1s ease' } }}
          InputLabelProps={{ style: { color: darkMode ? 'lightgray' : 'black', transition: '1s ease' } }}
        />
        <TextField
          label="Priority"
          variant="outlined"
          select
          onKeyDown={addTaskWithKB}
          helperText="Select a priority"
          value={newPriority}
          onChange={(e) => {
            if (e.target.value === 'low' || e.target.value === 'medium' || e.target.value === 'high') setNewPriority(e.target.value);
          }}
          InputProps={{ style: { color: darkMode ? 'white' : 'black', transition: '1s ease' } }}
          InputLabelProps={{ style: { color: darkMode ? 'lightgray' : 'black', transition: '1s ease' } }}
        >
          {prioritiesOptions.map((op) => (
            <MenuItem key={op.label} value={op.value}>
              {op.label}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          color="primary"
          onClick={addTask}
          style={{ marginTop: '10px', marginLeft: "10px" }}
        >
          Add Task
        </Button>
      </div>
      {/*Seccion para aplicar los filtros */}
      <h4>Filters</h4>
      <TextField
        label="Status"
        variant="outlined"
        select
        value={filter}
        onChange={(e) => { setFilter(e.target.value) }}
        inputProps={{ min: 1, max: 5 }}
        InputProps={{
          style: { color: darkMode ? 'white' : 'black', transition: '1s ease' }, // Change text color
        }}
        InputLabelProps={{
          style: { color: darkMode ? 'lightgray' : 'black', transition: '1s ease' }, // Change label color
        }}
      >
        {filterOptions.map((op) => (
          <MenuItem key={op.label} value={op.value}>
            {op.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Task Value"
        variant="outlined"
        select
        value={sortCriteria}
        onChange={(e) => { setSortCriteria(e.target.value) }}
        inputProps={{ min: 1, max: 5 }}
        InputProps={{
          style: { color: darkMode ? 'white' : 'black', transition: '1s ease' }, // Change text color
        }}
        InputLabelProps={{
          style: { color: darkMode ? 'lightgray' : 'black', transition: '1s ease' }, // Change label color
        }}
      >
        {sortCriteriaOptions.map((op) => (
          <MenuItem key={op.label} value={op.value}>
            {op.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Task Value"
        variant="outlined"
        select
        value={sortOrder}
        onChange={(e) => { setSortOrder(e.target.value as 'asc' | 'desc') }}
        inputProps={{ min: 1, max: 5 }}
        InputProps={{
          style: { color: darkMode ? 'white' : 'black', transition: '1s ease' }, // Change text color
        }}
        InputLabelProps={{
          style: { color: darkMode ? 'lightgray' : 'black', transition: '1s ease' }, // Change label color
        }}
      >
        {sortOrderOptions.map((op) => (
          <MenuItem key={op.label} value={op.value}>
            {op.label}
          </MenuItem>
        ))}
      </TextField>

      {/*Lista de tareas */}
      <Paper className={`list-container ${darkMode ? 'dark-mode' : ''}`}>
        {sortedTasks.map((task) => (
          <Paper
            key={task.id}
            className={`card-item ${task.completed ? 'completed' : ''} ${darkMode ? 'dark-mode' : ''}`}
            onClick={() => toggleTaskCompletion(task.id)}
            style={{ transition: '1s ease' }}
          >
            <Typography
              style={{
                textDecoration: task.completed ? 'line-through' : 'none',
                cursor: 'pointer',
              }}
            >
              {task.content} - Due: {task.dueDate} - Priority: {task.priority}
            </Typography>
            <Button onClick={() => deleteTask(task.id)} color="error">
              Delete
            </Button>
            <Button
              onClick={() => {
                const newContent = prompt('Edit task', task.content) || task.content;
                const newDueDate = prompt('Edit due date', task.dueDate) || task.dueDate;
                const newPriorityInput = prompt('Edit priority (low, medium, high)', task.priority) || task.priority;
                const newPriority =
                  newPriorityInput === 'low' || newPriorityInput === 'medium' || newPriorityInput === 'high'
                    ? newPriorityInput
                    : task.priority;
                editTask(task.id, newContent, newDueDate, newPriority);
              }}
              color="primary"
            >
              Edit
            </Button>
          </Paper>
        ))}
      </Paper>
    </section>
  );
};

export default TaskList;
