import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user } = useAuth();
  return (
    <header className="main-header">
      <h1>Controle de Estoque</h1>
      <div className="header-actions">
        <button className="btn btn-secondary">Exportar para Excel</button>
        <button className="btn btn-secondary">Exportar para PDF</button>


        
        {/* Botão condicional para adicionar produto */}
        {(user.role === 'Admin' || user.role === 'Moderador') && (
          <Link to="/produtos/novo" className="btn btn-primary">
            + Adicionar Produto
          </Link>
        )}


      </div>
    </header>
  );
};

export default Header;