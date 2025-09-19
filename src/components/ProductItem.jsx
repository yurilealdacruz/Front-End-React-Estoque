
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Importa o useAuth para saber a hierarquia
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faChevronDown } from '@fortawesome/free-solid-svg-icons';

// Componente de Detalhes (sem alterações)
const ProductDetails = ({ product }) => {
    return (
        <div className="product-details">
            {product.photoUrl && (
                <img 
                    src={product.photoUrl} 
                    alt={`Imagem de ${product.name}`} 
                    className="product-detail-image" 
                />
            )}
             {/* 1. ADICIONA A SEÇÃO DE DESCRIÇÃO */}
            {product.descricao && (
                <div className="product-description">
                    <h4>Descrição</h4>
                    <p>{product.descricao}</p>
                </div>
            )}

            <h4>Detalhes Adicionais</h4>
            <p>Em breve: Histórico de movimentações deste item.</p>
        </div>
    );
};


function ProductItem({ product, onMoveStock }) {
  const { user } = useAuth(); // 2. Pega os dados do usuário logado do nosso contexto
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDetails = () => setIsExpanded(!isExpanded);

  const getStatusClass = (statusText) => {
    const status = statusText.toLowerCase().replace(' ', '-');
    if (status.includes('em-estoque')) return 'status-in-stock';
    if (status.includes('estoque-baixo')) return 'status-low-stock';
    if (status.includes('fora-de-estoque')) return 'status-out-of-stock';
    return '';
  };
  
  // 3. Verifica se o usuário tem permissão para editar/movimentar
  const canEdit = user && (user.role === 'Admin' || user.role === 'Moderador');

  return (
   <>
      <tr className="product-item-summary-row">
        <td><input type="checkbox" /></td>
        <td>
          <Link to={`/produtos/editar/${product.sku}`} className="product-sku-link">
            {product.sku}
          </Link>
        </td>
        <td>{product.lastUpdated}</td>
        <td>{product.name}</td>
        
        <td>{product.modelo || 'N/A'}</td>
        <td>{product.categoria_almo || 'N/A'}</td>
        
        <td>{product.supplier}</td>
        <td>{product.location}</td>
        <td>{product.quantity}</td>
        <td>
          <span className={`status-pill ${getStatusClass(product.status)}`}>
            {product.status}
          </span>
        </td>
        <td>
          <span className="action-icons">
            {canEdit && (
              <>
                <button className="icon-button" title="Movimentar Estoque" onClick={() => onMoveStock(product)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="8 21 3 21 3 16"></polyline><line x1="20" y1="4" x2="3" y2="21"></line></svg>
                </button>
                <Link to={`/produtos/editar/${product.sku}`} className="icon-button" title="Editar">
                  <FontAwesomeIcon icon={faPencilAlt} />
                </Link>
              </>
            )}
            <button className={`icon-button toggle-details-icon ${isExpanded ? 'expanded' : ''}`} title="Ver Detalhes" onClick={toggleDetails}>
              <FontAwesomeIcon icon={faChevronDown} />
            </button>
          </span>
        </td>
      </tr>

      {isExpanded && (
        <tr className="product-details-row">
          {/* 3. ATUALIZA O COLSPAN PARA 11 (O NOVO NÚMERO TOTAL DE COLUNAS) */}
          <td colSpan="11">
            <ProductDetails product={product} />
          </td>
        </tr>
      )}
    </>
  );
};

export default ProductItem;