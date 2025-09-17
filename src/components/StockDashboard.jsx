import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/SearchBar.jsx';
import ProductList from '../components/ProductList.jsx';
import StockMovementModal from '../components/StockMovementModal.jsx';
import QRCodeModal from '../components/QRCodeModal.jsx'; 


const StockDashboard = () => {
    const { user, token, logout } = useAuth();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isStockMovementModalOpen, setIsStockMovementModalOpen] = useState(false); 
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const isVisualizador = user && user.role === 'Visualizador';

    const handleFilterChange = useCallback((key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    }, [searchParams, setSearchParams]);

    const fetchProducts = useCallback(async () => {
        if (!token) return;

        setIsLoading(true);
        const apiUrl = `${import.meta.env.VITE_API_URL}/produtos/?${searchParams.toString()}`;
        
        try {
            const response = await fetch(apiUrl, {
                headers: { 'Authorization': `Token ${token}` }
            });
            if (!response.ok) {
                if (response.status === 401) logout();
                throw new Error('Falha ao buscar dados');
            }
            const data = await response.json();

            const formattedData = data.map(p => ({
                id: p.id,
                sku: p.sku,
                lastUpdated: new Date(p.ultima_atualizacao).toLocaleDateString('pt-BR'),
                name: p.nome,
                supplier: p.fornecedor || 'N/A',
                location: p.sala_laboratorio || p.endereco_almo || 'N/A',
                quantity: p.quantidade,
                status: p.quantidade > 20 ? 'Em Estoque' : (p.quantidade > 0 ? 'Estoque Baixo' : 'Fora de Estoque'),
                photoUrl: p.foto ? `${p.foto}` : null,
                modelo: p.modelo,
                categoria_almo: p.categoria_almo,
                descricao: p.descricao,
            }));
            setProducts(formattedData);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        } finally {
            setIsLoading(false);
        }
    }, [searchParams, token, logout]);

    useEffect(() => {
        if (isVisualizador) {
            handleFilterChange('estoque', 'ALMOXARIFADO');
        }
    }, [isVisualizador, handleFilterChange]);

     useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);


    const handleOpenStockMovementModal = (product) => { // Renomeado
        setSelectedProduct(product);
        setIsStockMovementModalOpen(true);
    };

    const handleCloseStockMovementModal = () => { // Renomeado
        setSelectedProduct(null);
        setIsStockMovementModalOpen(false);
    };

    const handleOpenQRCodeModal = () => { // 3. Nova função para abrir o modal de QR Code
        setIsQRCodeModalOpen(true);
    };

    const handleCloseQRCodeModal = () => { // 3. Nova função para fechar o modal de QR Code
        setIsQRCodeModalOpen(false);
    };

    // 4. Constrói a URL completa para o QR Code
    const currentAbsoluteUrl = window.location.origin + window.location.pathname + '?' + searchParams.toString();


    return (
        <>
            <div className="stock-selector-container">
            <label htmlFor="stock-select">Visualizando Estoque:</label>
            <select 
                id="stock-select"
                className="filter-select"
                value={searchParams.get('estoque') || (user.role === 'Moderador' ? user.managed_stock : 'ALMOXARIFADO')} 
                onChange={e => handleFilterChange('estoque', e.target.value)}
                // Desabilita se não for Admin, pois Moderadores e Visualizadores só podem ver um estoque.
                disabled={user.role !== 'Admin'}
                title={user.role !== 'Admin' ? "Você só tem permissão para ver este estoque." : ""}
            >
                {/* Lógica condicional para renderizar as opções */}
                {user.role === 'Admin' && (
                    <>
                        <option value="ALMOXARIFADO">Almoxarifado</option>
                        <option value="DIDATICO">Ambiente Didático</option>
                        <option value="ASSISTENCIA">Assistência Técnica</option>
                        <option value="ADMINISTRATIVO">Estoque Administrativo</option>
                    </>
                )}
                {user.role === 'Moderador' && (
                    <option value={user.managed_stock}>{user.managed_stock.replace('_', ' ')}</option>
                )}
                {user.role === 'Visualizador' && (
                    <option value="ALMOXARIFADO">Almoxarifado</option>
                )}
            </select>
        </div>
            
            <div className="filters">
                <SearchBar onSearch={(term) => handleFilterChange('search', term)} />
                {/* Botão para gerar QR Code */}
                <button className="btn btn-primary" onClick={handleOpenQRCodeModal} style={{ marginLeft: '10px' }}>
                    Gerar QR Code
                </button>
                {/* TODO: Botão de Exportar para Excel aqui, se quiser */}
            </div>
            
            {isLoading ? (
                <p style={{textAlign: 'center', padding: '2rem'}}>Carregando produtos...</p> 
            ) : (
                <ProductList products={products} onMoveStock={handleOpenStockMovementModal} />
            )}

            {isStockMovementModalOpen && (
                <StockMovementModal 
                    product={selectedProduct}
                    onClose={handleCloseStockMovementModal}
                    onSuccess={fetchProducts}
                />
            )}

            {isQRCodeModalOpen && ( // 5. Renderiza o modal de QR Code condicionalmente
                <QRCodeModal
                    url={currentAbsoluteUrl} // Passa a URL atual completa
                    onClose={handleCloseQRCodeModal}
                />
            )}
        </>
    );
};

export default StockDashboard;