import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import './MainLayout.css';

export default function MainLayout({ children, activePage, setActivePage }) {
  return (
    <div className="layout-container">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
