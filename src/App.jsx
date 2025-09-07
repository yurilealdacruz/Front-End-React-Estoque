// src/App.jsx - VERSÃO FINAL CORRIGIDA

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import FilterBar from './components/FilterBar.jsx';
import ProductList from './components/ProductList.jsx';
import Login from './components/Login.jsx';

function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [selectedStock, setSelectedStock] = useState('ALMOXARIFADO');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Começa como false

  const handleLogin = (newToken) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
  };

  useEffect(() => {
    // Se não houver token, simplesmente não faz nada.
    if (!token) {
        setProducts([]); // Limpa a lista de produtos se o usuário deslogar
        return;
    }

    setIsLoading(true);
    const apiUrl = `http://127.0.0.1:8000/api/produtos/?estoque=${selectedStock}`;

    const fetchProducts = async () => {
      try {
        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        
        if (!response.ok) {
            // Se a resposta for 401 (Não Autorizado), o token pode ter expirado.
            if (response.status === 401) {
                handleLogout(); // Desloga o usuário
            }
            throw new Error('Falha ao buscar dados');
        }

        const data = await response.json();
        
        const formattedData = data.map(p => ({
            sku: p.sku,
            lastUpdated: new Date(p.ultima_atualizacao).toLocaleDateString('pt-BR'),
            name: p.nome,
            supplier: p.fornecedor || 'N/A',
            location: p.sala_laboratorio || p.endereco_almo || 'N/A',
            quantity: p.quantidade,
            status: p.quantidade > 20 ? 'Em Estoque' : (p.quantidade > 0 ? 'Estoque Baixo' : 'Fora de Estoque'),
            photoUrl: p.foto ? `${p.foto}` : null 
        }));
        
        setProducts(formattedData);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedStock, token]); // Roda o efeito quando o estoque ou o token mudam

  // Se não houver token, mostra a tela de login
  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  // Se houver token, mostra o dashboard
  return (
    <div className="app-container">
      {/* Precisamos de um botão de logout em algum lugar, pode ser na Sidebar */}
      <Sidebar onLogout={handleLogout} /> 
      
      <main className="main-content">
        <Header />
        
        <div className="stock-selector-container">
            <label htmlFor="stock-select">Visualizando Estoque:</label>
            <select 
                id="stock-select"
                className="filter-select"
                value={selectedStock} 
                onChange={e => setSelectedStock(e.target.value)}
            >
                <option value="ALMOXARIFADO">Almoxarifado</option>
                <option value="DIDATICO">Ambiente Didático</option>
                <option value="ASSISTENCIA">Assistência Técnica</option>
            </select>
        </div>

        <FilterBar />

        {isLoading ? (
            <p style={{textAlign: 'center', padding: '2rem'}}>Carregando produtos...</p> 
        ) : (
            <ProductList products={products} />
        )}
      </main>
    </div>
  );
}

export default App;