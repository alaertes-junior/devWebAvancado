import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import './MainLayout.css';

export default function MainLayout({ children, activePage, setActivePage, onLogout }) {
  return (
    <div className="layout-container">
      <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={onLogout} />
      <div className="main-wrapper">
        <header className="main-header">
          <div className="user-profile-pill">
            <span className="user-avatar">AD</span>
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
