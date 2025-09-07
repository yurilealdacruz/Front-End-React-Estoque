// em src/App.jsx - ATUALIZADO COM ROTAS

import React from 'react';
import { Routes, Route } from 'react-router-dom'; // 1. Importa componentes de rota
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import Login from './components/Login.jsx';
import StockDashboard from './components/StockDashboard.jsx'; // 2. Vamos criar este componente
import UserAdminPage from './components/UserAdminPage.jsx'; // 3. Importa a nova página
import HistoryPage from './components/HistoryPage.jsx'; // 4. Importa a página de histórico
import ProductFormPage from './components/ProductFormPage.jsx';

function App() {
  const { user } = useAuth();

  // Se não houver usuário, mostra apenas a tela de login
  if (!user) {
    return <Login />;
  }

  // Se houver usuário, mostra o layout principal com as rotas
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Header />
        
         
        <Routes>
          <Route path="/" element={<StockDashboard />} />
          <Route path="/historico" element={<HistoryPage />} /> 
          {user.role === 'Admin' && (
            <Route path="/admin/users" element={<UserAdminPage />} />
          )}
          {(user.role === 'Admin' || user.role === 'Moderador') && (
            <>
              {/* 2. Atualize o componente da rota de "novo" */}
              <Route path="/produtos/novo" element={<ProductFormPage />} />
              {/* 3. ADICIONE A NOVA ROTA DE EDIÇÃO */}
              <Route path="/produtos/editar/:sku" element={<ProductFormPage />} />
            </>
          )}
        </Routes>


      </main>
    </div>
  );
}

export default App;