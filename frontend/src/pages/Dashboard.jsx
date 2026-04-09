import React, { useEffect, useState } from 'react';
import { getGoals, getTasks } from '../services/api';
import { Target, ListTodo, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ goals: 0, completedGoals: 0, tasks: 0 });

  useEffect(() => {
    Promise.all([getGoals(), getTasks()]).then(([resGoals, resTasks]) => {
      const goals = resGoals.data || [];
      const tasks = resTasks.data || [];
      const completedGoals = goals.filter(g => g.is_completed).length;
      setStats({
        goals: goals.length,
        completedGoals: completedGoals,
        tasks: tasks.length
      });
    }).catch(err => console.error("Error fetching dashboard data", err));
  }, []);

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <p className="text-muted">Here is what's happening with your study goals today.</p>
      </div>

      <div className="grid md:grid-cols-3">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', color: 'var(--primary-color)' }}>
            <Target size={28} />
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: '0.875rem' }}>Total Daily Goals</div>
            <div className="font-bold text-2xl">{stats.goals}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(236, 72, 153, 0.1)', borderRadius: '50%', color: 'var(--secondary-color)' }}>
            <TrendingUp size={28} />
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: '0.875rem' }}>Goals Completed</div>
            <div className="font-bold text-2xl">{stats.completedGoals}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(56, 189, 248, 0.1)', borderRadius: '50%', color: '#38bdf8' }}>
            <ListTodo size={28} />
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: '0.875rem' }}>Upcoming Tasks</div>
            <div className="font-bold text-2xl">{stats.tasks}</div>
          </div>
        </div>
      </div>
      
      <div className="card mt-4" style={{ marginTop: '2rem' }}>
        <h3 className="font-bold" style={{ marginBottom: '1rem' }}>Recent Activity & AI Insights</h3>
        <p className="text-muted">No recent activity detected. Try creating a Note or generating a Study Plan!</p>
      </div>
    </div>
  );
};

export default Dashboard;
