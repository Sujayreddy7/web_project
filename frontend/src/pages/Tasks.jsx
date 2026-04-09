import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, getGoals, createGoal, updateGoal } from '../services/api';
import { CheckCircle2, Circle } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [goalText, setGoalText] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getTasks().then(res => setTasks(res.data)).catch(console.error);
    getGoals().then(res => setGoals(res.data)).catch(console.error);
  };

  const handleCreateTask = async () => {
    if(!taskTitle || !taskDeadline) return;
    await createTask({ title: taskTitle, deadline: taskDeadline, is_completed: false });
    setTaskTitle(''); setTaskDeadline('');
    fetchData();
  };

  const handleCreateGoal = async () => {
    if(!goalText) return;
    await createGoal({ goal_text: goalText, is_completed: false });
    setGoalText('');
    fetchData();
  };

  const toggleTask = async (task) => {
    await updateTask(task.id, { is_completed: !task.is_completed });
    fetchData();
  };

  const toggleGoal = async (goal) => {
    await updateGoal(goal.id, { is_completed: !goal.is_completed });
    fetchData();
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h2 className="text-2xl font-bold">Tasks & Daily Goals</h2>
        <p className="text-muted">Track your progress and stay on top of deadlines.</p>
      </div>

      <div className="grid md:grid-cols-2">
        {/* Daily Goals */}
        <div className="card">
          <h3 className="font-bold mb-4">Daily Goals</h3>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input 
              className="input-field" 
              placeholder="E.g., Read Chapter 3..." 
              value={goalText}
              onChange={e => setGoalText(e.target.value)}
            />
            <button className="btn-primary" onClick={handleCreateGoal}>Add</button>
          </div>
          <div className="flex-col gap-2">
            {goals.map(goal => (
              <div key={goal.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--bg-color)', borderRadius: 'var(--radius)' }}>
                <button onClick={() => toggleGoal(goal)} style={{ color: goal.is_completed ? 'var(--primary-color)' : 'var(--text-muted)' }}>
                  {goal.is_completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>
                <div style={{ textDecoration: goal.is_completed ? 'line-through' : 'none', color: goal.is_completed ? 'var(--text-muted)' : 'var(--text-main)' }}>
                  {goal.goal_text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assignments/Tasks */}
        <div className="card">
          <h3 className="font-bold mb-4">Upcoming Deadlines</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <input 
              className="input-field" 
              placeholder="Task Title..." 
              value={taskTitle}
              onChange={e => setTaskTitle(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="datetime-local"
                className="input-field" 
                value={taskDeadline}
                onChange={e => setTaskDeadline(e.target.value)}
              />
              <button className="btn-primary" onClick={handleCreateTask}>Add</button>
            </div>
          </div>
          <div className="flex-col gap-2">
            {tasks.map(task => (
              <div key={task.id} style={{ display: 'flex', alignItems: 'center', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button onClick={() => toggleTask(task)} style={{ color: task.is_completed ? 'var(--primary-color)' : 'var(--text-muted)' }}>
                    {task.is_completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                  </button>
                  <div>
                    <div className="font-bold" style={{ textDecoration: task.is_completed ? 'line-through' : 'none' }}>{task.title}</div>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>{new Date(task.deadline).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
