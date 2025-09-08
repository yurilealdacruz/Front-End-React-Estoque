// em src/pages/HistoryPage.jsx - VERSÃO CORRIGIDA

import React, { useState, useEffect, useCallback } from 'react'; // 1. Importa o useCallback
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar.jsx'; // 2. Corrige o caminho de importação

const HistoryPage = () => {
    // 3. Pega o 'logout' do contexto junto com o 'token'
    const { token, logout } = useAuth(); 
    const [movimentacoes, setMovimentacoes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const handleFilterChange = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    const fetchHistory = useCallback(async () => {
        if (!token) return;

        setIsLoading(true);
        const apiUrl = `${import.meta.env.VITE_API_URL}/movimentacoes/?${searchParams.toString()}`;

        try {
            const response = await fetch(apiUrl, {
                headers: { 'Authorization': `Token ${token}` }
            });
            if (!response.ok) {
                if (response.status === 401) logout();
                throw new Error('Falha ao buscar histórico.');
            }
            const data = await response.json();
            setMovimentacoes(data);
        } catch (error) {
            console.error("Erro ao buscar histórico:", error);
        } finally {
            setIsLoading(false);
        }
    }, [searchParams, token, logout]); // Agora 'logout' é uma dependência válida

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);


    return (
        <div className="history-container">
            <h1>Histórico de Movimentações</h1>

            <div className="stock-selector-container">
                <label htmlFor="stock-select">Filtrar por Estoque:</label>
                <select 
                    id="stock-select"
                    className="filter-select"
                    value={searchParams.get('estoque') || 'ALMOXARIFADO'}
                    onChange={e => handleFilterChange('estoque', e.target.value)}
                >
                    <option value="ALMOXARIFADO">Almoxarifado</option>
                    <option value="DIDATICO">Ambiente Didático</option>
                    <option value="ASSISTENCIA">Assistência Técnica</option>
                </select>
            </div>

            <div className="filters">
                <SearchBar onSearch={(term) => handleFilterChange('search', term)} />
            </div>

            {isLoading ? (
                <p style={{textAlign: 'center', padding: '2rem'}}>Carregando histórico...</p>
            ) : (
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Produto</th>
                            <th>SKU</th>
                            <th>Tipo</th>
                            <th>Quantidade</th>
                            <th>Usuário</th>
                            <th>Observação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movimentacoes.map(mov => (
                            <tr key={mov.id}>
                                <td>{new Date(mov.data).toLocaleString('pt-BR')}</td>
                                <td>{mov.produto_nome}</td>
                                <td>{mov.produto_sku}</td>
                                <td className={mov.tipo === 'ENTRADA' ? 'mov-entrada' : 'mov-saida'}>
                                    {mov.tipo}
                                </td>
                                <td>{mov.quantidade}</td>
                                <td>{mov.usuario_nome}</td>
                                <td>{mov.observacao}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default HistoryPage;