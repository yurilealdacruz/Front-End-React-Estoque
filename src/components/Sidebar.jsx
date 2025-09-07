// src/components/Sidebar.jsx - CÓDIGO ATUALIZADO

import React from 'react';

const Sidebar = ({ onLogout }) => {
  return (
    <nav className="sidebar">
      <ul className="sidebar-nav">
        <li className="nav-item">
          <a href="#" className="nav-link" title="Dashboard">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </a>
        </li>
        <li className="nav-item active">
          <a href="#" className="nav-link" title="Estoque">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link" title="Histórico">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </a>
        </li>

         
        {/* NOVO: BOTÃO DE LOGOUT */}
        {/* Usamos um <button> em vez de <a> para ações */}
        <button onClick={onLogout} className="nav-link logout-btn" title="Sair">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        </button>
      </ul>

      {/* Ícones do rodapé */}
      <div className="sidebar-footer">
        <a href="#" className="nav-link" title="Configurações">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.3 21.7c0 0-3.3-.5-4.6-3.4s-1.4-6.3.3-8.5S10.2 6 12 6s3.8 1.1 5 2.8 1.6 5.6.3 8.5-4.6 3.4-4.6 3.4Z"></path><path d="M12 6V2"></path><path d="M15 6.4L18 4"></path><path d="m9 6.4-3-2.4"></path><path d="M12 22v-3"></path><path d="M18.5 18.4l2.5 1.1"></path><path d="M3.5 19.5l2.5-1.1"></path></svg>
        </a>

        {/* NOVO: Ícone e Link do GitHub */}
        <a 
          href="https://yurilealdacruz.github.io" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="nav-link" 
          title="Meu GitHub"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
        </a>
      </div>
    </nav>
  );
};

export default Sidebar;