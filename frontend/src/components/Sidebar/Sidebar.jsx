import React from 'react';
import './Sidebar.css';
import logoImg from '../../assets/positivo_univer_bi_pos_cmyk-1024x315.png';

export default function Sidebar({ activePage, setActivePage, onLogout }) {
  // Helper para definir a classe ativa
  const getNavClass = (page) => {
    return `nav-item ${activePage === page ? 'active' : ''}`;
  };

  return (
    <aside className="sidebar">
      {/* Logo da Universidade Positivo */}
      <div className="sidebar-logo">
        <div className="logo-placeholder">
          <img src={logoImg} alt="Universidade Positivo" className="logo-img" />
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className={getNavClass('Professores')} onClick={() => setActivePage('Professores')}>
          Professores
        </div>
        
        <div className={getNavClass('Disciplinas')} onClick={() => setActivePage('Disciplinas')}>
          Disciplinas
        </div>
        
        <div className={getNavClass('Alunos')} onClick={() => setActivePage('Alunos')}>
          Alunos
        </div>
        
        <div className={getNavClass('Notas')} onClick={() => setActivePage('Notas')}>
          Notas
        </div>
        
        <div className={getNavClass('Frequência')} onClick={() => setActivePage('Frequência')}>
          Frequência
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="logout-btn" onClick={onLogout}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Sair
        </div>
      </div>
    </aside>
  );
}
