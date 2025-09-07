import React from 'react';

const FilterBar = () => {
  return (
    <div className="filters">
      <div className="search-container">
        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" placeholder="Buscar por ID, Nome ou Categoria..." />
      </div>
      <select className="filter-select"><option>Filtrar por Categoria</option></select>
      <select className="filter-select"><option>Filtrar por Fornecedor</option></select>
      <select className="filter-select"><option>Filtrar por Status</option></select>
    </div>
  );
};

export default FilterBar;