// em src/pages/StockDashboard.jsx - VERSÃO FINAL E UNIFICADA

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

    // Função única para manipular TODOS os parâmetros da URL
    const handleUrlParamsChange = useCallback((key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    }, [searchParams, setSearchParams]);

    // Lógica de Ordenação
    const handleSort = (field) => {
        const currentOrdering = searchParams.get('ordering') || '';
        let newOrdering = field;
        if (currentOrdering === field) newOrdering = `-${field}`;
        else if (currentOrdering === `-${field}`) newOrdering = '';
        handleUrlParamsChange('ordering', newOrdering);
    };
    
    // Lógica de Exportação para Excel
    const handleExportExcel = () => {
        const dataToExport = products.map(p => ({
            'SKU': p.sku, 'Produto': p.name, 'Modelo': p.modelo, 'Categoria': p.categoria_almo,
            'Fornecedor': p.supplier, 'Localização': p.location, 'Quantidade': p.quantity,
            'Status': p.status, 'Última Atualização': p.lastUpdated
        }));
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Estoque");
        XLSX.writeFile(workbook, "relatorio_estoque.xlsx");
    };

    // Lógica de Exportação para PDF
    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text("Relatório de Estoque", 14, 15);
        doc.autoTable({
            head: [["SKU", "Produto", "Modelo", "Qtd.", "Status"]],
            body: products.map(p => [p.sku, p.name, p.modelo || 'N/A', p.quantity, p.status]),
            startY: 20, theme: 'grid', headStyles: { fillColor: [26, 32, 53] },
        });
        doc.save("relatorio_estoque.pdf");
    };

    const fetchProducts = useCallback(async () => {
        if (!token) return;
        setIsLoading(true);
        const apiUrl = `https://yakiromorfera.pythonanywhere.com/api/produtos/?${searchParams.toString()}`;
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
                id: p.id, sku: p.sku,
                lastUpdated: new Date(p.ultima_atualizacao).toLocaleDateString('pt-BR'),
                name: p.nome, supplier: p.fornecedor || 'N/A',
                location: p.sala_laboratorio || p.endereco_almo || 'N/A',
                quantity: p.quantidade,
                status: p.quantidade > 20 ? 'Em Estoque' : (p.quantidade > 0 ? 'Estoque Baixo' : 'Fora de Estoque'),
                photoUrl: p.foto ? `${p.foto}` : null,
                modelo: p.modelo, categoria_almo: p.categoria_almo, descricao: p.descricao,
            }));
            setProducts(formattedData);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        } finally {
            setIsLoading(false);
        }
    }, [searchParams, token, logout]);

    useEffect(() => {
        if (isVisualizador && searchParams.get('estoque') !== 'ALMOXARIFADO') {
            handleUrlParamsChange('estoque', 'ALMOXARIFADO');
        } else {
            // Garante que pelo menos o filtro padrão seja definido na URL ao carregar
            if (!searchParams.get('estoque')) {
                handleUrlParamsChange('estoque', isVisualizador ? 'ALMOXARIFADO' : (user?.managed_stock || 'ALMOXARIFADO'));
            }
        }
    }, [isVisualizador, user, searchParams, handleUrlParamsChange]);
    
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleOpenStockMovementModal = (product) => { setSelectedProduct(product); setIsStockMovementModalOpen(true); };
    const handleCloseStockMovementModal = () => { setSelectedProduct(null); setIsStockMovementModalOpen(false); };
    const handleOpenQRCodeModal = () => setIsQRCodeModalOpen(true);
    const handleCloseQRCodeModal = () => setIsQRCodeModalOpen(false);
    const currentAbsoluteUrl = window.location.href;

    return (
        <>
            <div className="stock-selector-container">
                <label htmlFor="stock-select">Visualizando Estoque:</label>
                <select 
                    id="stock-select" className="filter-select"
                    value={searchParams.get('estoque') || 'ALMOXARIFADO'}
                    onChange={e => handleUrlParamsChange('estoque', e.target.value)}
                    disabled={user.role !== 'Admin'}
                    title={user.role !== 'Admin' ? "Você só tem permissão para ver este estoque." : ""}
                >
                    {user.role === 'Admin' && (
                        <>
                            <option value="ALMOXARIFADO">Almoxarifado</option>
                            <option value="DIDATICO">Ambiente Didático</option>
                            <option value="ASSISTENCIA">Assistência Técnica</option>
                            <option value="ADMINISTRATIVO">Estoque Administrativo</option>
                        </>
                    )}
                    {user.role === 'Moderador' && <option value={user.managed_stock}>{user.managed_stock.replace('_', ' ')}</option>}
                    {user.role === 'Visualizador' && <option value="ALMOXARIFADO">Almoxarifado</option>}
                </select>
            </div>
            
            <div className="filters">
                <SearchBar onSearch={(term) => handleUrlParamsChange('search', term)} />
                <button className="btn btn-secondary" onClick={handleExportExcel}>Exportar para Excel</button>
              {/*   <button className="btn btn-secondary" onClick={handleExportPDF}>Exportar para PDF</button>  */}
                <button className="btn btn-primary" onClick={handleOpenQRCodeModal} style={{ marginLeft: '10px' }}>Gerar QR Code</button>
            </div>
            
            {isLoading ? (
                <p style={{textAlign: 'center', padding: '2rem'}}>Carregando produtos...</p> 
            ) : (
                <ProductList 
                    products={products} 
                    onMoveStock={handleOpenStockMovementModal}
                    onSort={handleSort}
                    currentOrdering={searchParams.get('ordering') || ''}
                />
            )}

            {isStockMovementModalOpen && (
                <StockMovementModal 
                    product={selectedProduct}
                    onClose={handleCloseStockMovementModal}
                    onSuccess={fetchProducts}
                />
            )}
            {isQRCodeModalOpen && (
                <QRCodeModal
                    url={currentAbsoluteUrl}
                    onClose={handleCloseQRCodeModal}
                />
            )}
        </>
    );
};

export default StockDashboard;