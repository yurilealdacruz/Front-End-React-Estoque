import React from 'react';

const Header = () => {
  return (
    <header className="main-header">
      <h1>Controle de Estoque</h1>
      <div className="header-actions">
        <button className="btn btn-secondary">Exportar para Excel</button>
        <button className="btn btn-secondary">Exportar para PDF</button>
        <button className="btn btn-primary">+ Adicionar Produto</button>
      </div>
    </header>
  );
};

export default Header;