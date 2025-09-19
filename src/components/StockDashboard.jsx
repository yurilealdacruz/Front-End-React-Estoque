import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as XLSX from 'xlsx';
import SearchBar from '../components/SearchBar.jsx';
import ProductList from '../components/ProductList.jsx';
import StockMovementModal from '../components/StockMovementModal.jsx';
import QRCodeModal from '../components/QRCodeModal.jsx'; 
import jsPDF from 'jspdf'; 
import 'jspdf-autotable';

const StockDashboard = () => {
    const { user, token, logout } = useAuth();
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isStockMovementModalOpen, setIsStockMovementModalOpen] = useState(false); 
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const isVisualizador = user && user.role === 'Visualizador';

    // Esta função genérica agora lida com TODOS os filtros da URL
    const handleFilterChange = useCallback((key, value) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    }, [searchParams, setSearchParams]);

    const handleSort = (field) => {
        const currentOrdering = searchParams.get('ordering') || '';
        
        let newOrdering = field;
        if (currentOrdering === field) {
            newOrdering = `-${field}`; // Inverte a ordem
        } else if (currentOrdering === `-${field}`) {
            newOrdering = ''; // Remove a ordenação
        }

        // Usa a mesma função que já temos para atualizar a URL!
        handleFilterChange('ordering', newOrdering);
    };

    const handleExportExcel = () => {
        // Mapeia os dados para ter cabeçalhos amigáveis em português
        const dataToExport = products.map(p => ({
            'SKU': p.sku,
            'Produto': p.name,
            'Modelo': p.modelo,
            'Categoria': p.categoria_almo,
            'Fornecedor': p.supplier,
            'Localização': p.location,
            'Quantidade': p.quantity,
            'Status': p.status,
            'Última Atualização': p.lastUpdated
        }));

        // Cria uma "planilha" a partir dos seus dados
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        // Cria um novo "livro" de Excel
        const workbook = XLSX.utils.book_new();
        // Adiciona a planilha ao livro
        XLSX.utils.book_append_sheet(workbook, worksheet, "Estoque");

        // Gera e baixa o arquivo .xlsx
        XLSX.writeFile(workbook, "relatorio_estoque.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();

        // Define os cabeçalhos da tabela no PDF
        const tableColumn = ["SKU", "Produto", "Modelo", "Qtd.", "Status"];
        // Define as linhas da tabela
        const tableRows = [];

        products.forEach(product => {
            const productData = [
                product.sku,
                product.name,
                product.modelo || 'N/A',
                product.quantity,
                product.status
            ];
            tableRows.push(productData);
        });

        // Usa o plugin autoTable para desenhar a tabela
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20, // Onde a tabela começa na página
            theme: 'grid', // Estilo da tabela
            headStyles: { fillColor: [22, 160, 133] }, // Cor do cabeçalho
        });
        
        doc.text("Relatório de Estoque", 14, 15);
        doc.save("relatorio_estoque.pdf");
    };

    const fetchProducts = useCallback(async () => {
        if (!token) return;

        setIsLoading(true);
        // A URL já lê todos os parâmetros, incluindo o de ordenação
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

    // Funções para os modais (sem alteração)
    const handleOpenStockMovementModal = (product) => {
        // Usa a variável 'product' para definir qual produto foi selecionado
        setSelectedProduct(product);
        // Usa a função 'setIsStockMovementModalOpen' para abrir o modal
        setIsStockMovementModalOpen(true);
    };
     const handleCloseStockMovementModal = () => {
        setSelectedProduct(null);
        // Usa a função 'setIsStockMovementModalOpen' para fechar o modal
        setIsStockMovementModalOpen(false);
    };
   const handleOpenQRCodeModal = () => {
        setIsQRCodeModalOpen(true);
    };
     const handleCloseQRCodeModal = () => {
        setIsQRCodeModalOpen(false);
    };

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
                <button className="btn btn-secondary" onClick={handleExportExcel}>
                    Exportar para Excel
                </button>
                <button className="btn btn-secondary" onClick={handleExportPDF}>
                    Exportar para PDF
                </button>
                <button className="btn btn-primary" onClick={handleOpenQRCodeModal} style={{ marginLeft: '10px' }}>
                    Gerar QR Code
                </button>
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