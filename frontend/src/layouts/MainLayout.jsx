import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import './MainLayout.css';

export default function MainLayout({ children, activePage, setActivePage, onLogout }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userInitials = user.nome
    ? user.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'AD';

  return (
    <div className="layout-container">
      <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={onLogout} />
      <div className="main-wrapper">
        <header className="main-header">
          <div className="user-profile-pill" title={user.nome || ''}>
            <span className="user-avatar">{userInitials}</span>
            <span className="user-role">Administrador</span>
          </div>
        </header>
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
