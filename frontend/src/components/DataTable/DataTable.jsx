import React from 'react';
import './DataTable.css';

export default function DataTable({ columns, data, onEdit, onDelete }) {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.header}</th>
            ))}
            {(onEdit || onDelete) && <th style={{ width: '120px', textAlign: 'center' }}>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} style={{ textAlign: 'center', color: '#64748b' }}>
                Nenhum registro encontrado.
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id || Math.random()}>
                {columns.map((col, index) => (
                  <td key={index}>{row[col.key]}</td>
                ))}
                {(onEdit || onDelete) && (
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                      {onEdit && (
                        <button 
                          className="btn-edit"
                          onClick={() => onEdit(row)}
                          title="Editar"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', transition: 'transform 0.2s' }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#305677" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="edit-icon">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                      )}
                      {onDelete && (
                        <button 
                          className="btn-delete"
                          onClick={() => onDelete(row.id)}
                          title="Excluir"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', transition: 'transform 0.2s' }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="trash-icon">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
