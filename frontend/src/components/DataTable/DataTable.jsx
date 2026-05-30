import React from 'react';
import './DataTable.css';

export default function DataTable({ columns, data, onDelete }) {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.header}</th>
            ))}
            {onDelete && <th style={{ width: '80px', textAlign: 'center' }}>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (onDelete ? 1 : 0)} style={{ textAlign: 'center', color: '#64748b' }}>
                Nenhum registro encontrado.
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id || Math.random()}>
                {columns.map((col, index) => (
                  <td key={index}>{row[col.key]}</td>
                ))}
                {onDelete && (
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      className="btn-delete"
                      onClick={() => onDelete(row.id)}
                      title="Excluir"
                    >
                      🗑️
                    </button>
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
