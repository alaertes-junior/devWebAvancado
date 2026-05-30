import React, { useState } from 'react';
import './PageHeader.css';

export default function PageHeader({ 
  title, 
  buttonText, 
  onAddClick, 
  onSearch,
  showFilter = false,
  filterOptions = [],
  onFilterChange
}) {
  const [searchValue, setSearchValue] = useState('');

  // Ao digitar, atualizamos o input e disparamos a função de busca vinda das props
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    
    // Se a função onSearch foi passada, chama ela com o novo valor
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="page-header-wrapper">
      <div className="page-header-title-area">
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Pesquisa por ID:" 
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="toolbar-actions">
          {showFilter && (
            <select 
              className="filter-select"
              onChange={(e) => onFilterChange && onFilterChange(e.target.value)}
            >
              <option value="">Todas as Disciplinas</option>
              {filterOptions && filterOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          <button className="btn-add" onClick={onAddClick}>
            <span className="plus-icon">⊕</span> {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
