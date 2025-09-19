import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user } = useAuth();
  return (
    <header className="main-header">
      <h1>Controle de Estoque - Núcleo de Técnologia da Informação</h1>
      <div className="header-actions">
        
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