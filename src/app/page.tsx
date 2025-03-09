'use client';
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import '../styles/todo.css'; // Import CSS file

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editTaskText, setEditTaskText] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode) {
      setDarkMode(JSON.parse(storedDarkMode));
    }
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: uuidv4(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const handleCompleteTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleEditTask = (id: string, text: string) => {
    setEditTaskId(id);
    setEditTaskText(text);
  };

  const handleUpdateTask = () => {
    setTasks(
      tasks.map((task) =>
        task.id === editTaskId ? { ...task, text: editTaskText } : task
      )
    );
    setEditTaskId(null);
    setEditTaskText('');
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);
  };

  return (
    <div className="container">
      <div className="mode-toggle-container">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="mode-toggle"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <div className="todo-app">
        <h1 className="title">To-Do List</h1>
        <div className="add-task">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add new task..."
            className="task-input"
          />
          <button onClick={handleAddTask} className="add-button">
            Add
          </button>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef} className="task-list">
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`task ${task.completed ? 'completed' : ''}`}
                      >
                        {editTaskId === task.id ? (
                          <div className="edit-task">
                            <input
                              type="text"
                              value={editTaskText}
                              onChange={(e) => setEditTaskText(e.target.value)}
                              className="edit-input"
                            />
                            <button onClick={handleUpdateTask} className="update-button">Update</button>
                            <button onClick={() => handleDeleteTask(task.id)} className="del-button">Delete</button>
                          </div>
                        ) : (
                          <>
                            <div className="task-content">
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleCompleteTask(task.id)}
                                className="task-checkbox"
                              />
                              <span>{task.text}</span>
                            </div>
                            <div className="task-actions">
                              <button onClick={() => handleEditTask(task.id, task.text)} className="edit-button">Edit</button>
                              <button onClick={() => handleDeleteTask(task.id)} className="delete-button">Done</button>
                            </div>
                          </>
                        )}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Home;