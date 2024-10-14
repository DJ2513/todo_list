import './App.css'
import TaskListItem from './Components/TaskListItem/TaskListItem';

function App() {
  return (
    <div className='main_container'>
      <h1 className='title'>Title of the App</h1>
      <div className='content'>
        <TaskListItem title='Task 1' description='This is a test' />
      </div>
    </div>
  )
}

export default App
