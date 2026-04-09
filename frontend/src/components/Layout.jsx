import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookText, CheckSquare, Calendar, Sparkles, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Layout = () => {
  const navigate = useNavigate();
  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar" style={{ padding: '2rem 1rem' }}>
        <div style={{ marginBottom: '2rem', padding: '0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles color="var(--primary-color)" />
          <h1 className="font-bold text-2xl" style={{ background: 'linear-gradient(to right, var(--primary-color), var(--secondary-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            StudyGenie AI
          </h1>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavLink to="/" style={({isActive}) => ({
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
            color: isActive ? 'var(--primary-color)' : 'var(--text-main)',
            fontWeight: isActive ? '600' : '400',
            transition: 'all 0.2s ease'
          })}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
          <NavLink to="/notes" style={({isActive}) => ({
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
            color: isActive ? 'var(--primary-color)' : 'var(--text-main)',
            fontWeight: isActive ? '600' : '400',
            transition: 'all 0.2s ease'
          })}>
            <BookText size={20} />
            Notes
          </NavLink>
          <NavLink to="/tasks" style={({isActive}) => ({
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
            color: isActive ? 'var(--primary-color)' : 'var(--text-main)',
            fontWeight: isActive ? '600' : '400',
            transition: 'all 0.2s ease'
          })}>
            <CheckSquare size={20} />
            Tasks & Goals
          </NavLink>
          <NavLink to="/planner" style={({isActive}) => ({
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
            color: isActive ? 'var(--primary-color)' : 'var(--text-main)',
            fontWeight: isActive ? '600' : '400',
            transition: 'all 0.2s ease'
          })}>
            <Calendar size={20} />
            Study Planner
          </NavLink>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="header">
          <div className="text-muted">Welcome back!</div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <ThemeToggle />
            <button 
              className="btn-outline flex items-center gap-2" 
            style={{ padding: '0.5rem 1rem' }}
            onClick={() => {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              navigate('/login');
            }}
          >
            <LogOut size={16} /> Logout
            </button>
          </div>
        </header>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
