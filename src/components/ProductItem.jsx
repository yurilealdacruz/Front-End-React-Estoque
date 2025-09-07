// src/components/ProductItem.jsx - VERSÃO COMPLETA E CORRIGIDA

import React, { useState } from 'react'; // 1. Precisamos do 'useState' para a funcionalidade de expandir
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faChevronDown } from '@fortawesome/free-solid-svg-icons';

// O sub-componente de detalhes está ótimo, sem mudanças aqui.
const ProductDetails = ({ product }) => {
    return (
        <div className="product-details">
            {/* AQUI ESTÁ A MUDANÇA */}
            {/* Só mostra a imagem se a photoUrl existir */}
            {product.photoUrl && (
                <img 
                    src={product.photoUrl} 
                    alt={`Imagem de ${product.name}`} 
                    className="product-detail-image" 
                />
            )}
            
            <h4>Histórico de Movimentação</h4>
            <ul className="movement-history">
                <li><span className="movement-in">+100</span> unidades recebidas do fornecedor {product.supplier} em 01/08/2025.</li>
                <li><span className="movement-out">-{100 - product.quantity}</span> unidades vendidas/transferidas.</li>
            </ul>
            <h4>Detalhes Adicionais</h4>
            <p><strong>Preço de Custo:</strong> R$ 85,50 | <strong>Preço de Venda:</strong> R$ 179,90</p>
        </div>
    );
};


function ProductItem({ product }) {
  // 2. Adicionamos o estado para controlar se a linha está expandida ou não
  const [isExpanded, setIsExpanded] = useState(false);

  // 3. Função para alternar o estado (mostrar/esconder detalhes)
  const toggleDetails = () => {
    setIsExpanded(!isExpanded);
  };

  // 4. Função para obter a classe CSS correta para colorir o status
  const getStatusClass = (statusText) => {
    const status = statusText.toLowerCase().replace(' ', '-');
    if (status.includes('em-estoque')) return 'status-in-stock';
    if (status.includes('estoque-baixo')) return 'status-low-stock';
    if (status.includes('fora-de-estoque')) return 'status-out-of-stock';
    return '';
  };

  return (
    // React.Fragment (<>) permite retornar múltiplos elementos (as duas <tr>)
    <>
      <tr className="product-item-summary-row">
        <td><input type="checkbox" /></td>
        <td>
          <a href={`/product/${product.sku}`} className="product-sku-link">
            {product.sku}
          </a>
        </td>
        <td>{product.lastUpdated}</td>
        <td>{product.name}</td>
        <td>{product.supplier}</td>
        <td>{product.location}</td>
        <td>{product.quantity}</td>
        <td>
          {/* 5. Usamos a função getStatusClass para adicionar a classe de cor */}
          <span className={`status-pill ${getStatusClass(product.status)}`}>
            {product.status}
          </span>
        </td>
        <td>
          <span className="action-icons">
            <button className="icon-button" title="Editar">
              <FontAwesomeIcon icon={faPencilAlt} />
            </button>
            {/* 6. O botão da seta agora chama a função toggleDetails */}
            <button 
              className={`icon-button toggle-details-icon ${isExpanded ? 'expanded' : ''}`} 
              title="Ver Detalhes"
              onClick={toggleDetails}
            >
              <FontAwesomeIcon icon={faChevronDown} />
            </button>
          </span>
        </td>
      </tr>

      {/* 7. Renderização Condicional: A linha de detalhes só aparece se 'isExpanded' for true */}
      {isExpanded && (
        <tr className="product-details-row">
          <td colSpan="9"> {/* colSpan="9" faz esta célula ocupar todas as 9 colunas da tabela */}
            <ProductDetails product={product} />
          </td>
        </tr>
      )}
    </>
  );
};

export default ProductItem;