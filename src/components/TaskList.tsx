import React, { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import {
  Paper,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import './TaskList.scss';

interface CardItem {
  id: string;
  content: string;
  dueDate: string;
  priority: number;
  completed: boolean;
}

interface ListsState {
  tasks: CardItem[];
}

const initialTasks: ListsState = {
  tasks: [
    { id: 'card1', content: 'Tarea 1', dueDate: '2024-10-20', priority: 2, completed: false },
    { id: 'card2', content: 'Tarea 2', dueDate: '2024-10-21', priority: 1, completed: false },
    { id: 'card3', content: 'Tarea 3', dueDate: '2024-10-22', priority: 3, completed: true },
  ],
};

const DragDropLists: React.FC<{ darkMode: boolean; toggleDarkMode: () => void }> = ({ darkMode }) => {
  const [lists, setLists] = useState<ListsState>(initialTasks);
  const [newTask, setNewTask] = useState<string>('');
  const [newDueDate, setNewDueDate] = useState<string>('');
  const [newPriority, setNewPriority] = useState<number>(1);
  const [filter, setFilter] = useState<string>('all');
  const [sortCriteria, setSortCriteria] = useState<string>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const addTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTask.trim() !== '') {
      const id = `card${lists.tasks.length + 1}`;
      const newTaskItem: CardItem = { id, content: newTask, dueDate: newDueDate, priority: newPriority, completed: false };
      setLists({ tasks: [...lists.tasks, newTaskItem] });
      setNewTask('');
      setNewDueDate('');
      setNewPriority(1);
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

  const editTask = (id: string, newContent: string, newDueDate: string, newPriority: number) => {
    setLists((prev) => ({
      tasks: prev.tasks.map((task) =>
        task.id === id ? { ...task, content: newContent, dueDate: newDueDate, priority: newPriority } : task
      ),
    }));
  };

  const onDragEnd = (result: DropResult): void => {
    const { source, destination } = result;
    if (!destination) return;

    const reorderedTasks = Array.from(lists.tasks);
    const [removed] = reorderedTasks.splice(source.index, 1);
    reorderedTasks.splice(destination.index, 0, removed);

    setLists({ tasks: reorderedTasks });
  };

  const filteredTasks = lists.tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const compareValue = sortOrder === 'asc' ? 1 : -1;
    if (sortCriteria === 'dueDate') {
      return compareValue * (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    } else if (sortCriteria === 'priority') {
      return compareValue * (a.priority - b.priority);
    } else {
      return compareValue * (new Date(a.id).getTime() - new Date(b.id).getTime()); // Sort by creation date (using id as a proxy)
    }
  });

  return (
    <section className={`task-list ${darkMode ? 'dark-mode' : ''}`} style={{transition: '1s ease'}}>
      <h3>Task Manager</h3>
      <TextField
        label="Add a new task"
        variant="outlined"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyDown={addTask}
        InputProps={{
          style: { color: darkMode ? 'white' : 'black' }, // Change text color
        }}
        InputLabelProps={{
          style: { color: darkMode ? 'lightgray' : 'black' }, // Change label color
        }}
      />

      <TextField
        variant="outlined"
        type="date"
        value={newDueDate}
        onChange={(e) => setNewDueDate(e.target.value)}
        InputProps={{
          style: { color: darkMode ? 'white' : 'black', transition: '1s ease' }, // Change text color
        }}
        InputLabelProps={{
          style: { color: darkMode ? 'lightgray' : 'black', transition: '1s ease' }, // Change label color
        }}
      />
      <TextField
        label="Priority"
        variant="outlined"
        type="number"
        value={newPriority}
        onChange={(e) => setNewPriority(Number(e.target.value))}
        inputProps={{ min: 1, max: 5 }}
        InputProps={{
          style: { color: darkMode ? 'white' : 'black', transition: '1s ease'}, // Change text color
        }}
        InputLabelProps={{
          style: { color: darkMode ? 'lightgray' : 'black', transition: '1s ease' }, // Change label color
        }}
      />
      <select onChange={(e) => setFilter(e.target.value)} value={filter}>
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
      </select>
      <select onChange={(e) => setSortCriteria(e.target.value)} value={sortCriteria}>
        <option value="dueDate">Due Date</option>
        <option value="priority">Priority</option>
        <option value="creationDate">Creation Date</option>
      </select>
      <select onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')} value={sortOrder}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
      <DragDropContext onDragEnd={onDragEnd} >
        <Droppable droppableId="tasks">
          {(provided) => (
            <Paper
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`list-container ${darkMode ? 'dark-mode' : ''}`}
            >
              {sortedTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <Paper
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`card-item ${task.completed ? 'completed' : ''} ${darkMode ? 'dark-mode' : ''}`}
                      style= {{transition: '1s ease'}}
                    >
                      <Typography
                        onClick={() => toggleTaskCompletion(task.id)}
                        style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                      >
                        {task.content} - Due: {task.dueDate} - Priority: {task.priority}
                      </Typography>
                      <Button onClick={() => deleteTask(task.id)} color="error">
                        Delete
                      </Button>
                      <Button
                        onClick={() => {
                          const newContent = prompt("Edit task", task.content) || task.content;
                          const newDueDate = prompt("Edit due date", task.dueDate) || task.dueDate;
                          const newPriority = Number(prompt("Edit priority (1-5)", task.priority.toString()) || task.priority);
                          editTask(task.id, newContent, newDueDate, newPriority);
                        }}
                        color="primary"
                      >
                        Edit
                      </Button>
                    </Paper>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Paper>
          )}
        </Droppable>
      </DragDropContext>
    </section>
  );
};

export default DragDropLists;
