import React from 'react';
import './Modal.css';

export default function Modal({ isOpen, onClose, children, title }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">{title}</h2>
        {/* Renderiza o conteúdo (formulário) passado para o modal */}
        {children}
      </div>
      {/* Clicar no overlay também pode fechar o modal, opcionalmente, mas vamos colocar um controle no form ou fechar via overlay */}
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}
