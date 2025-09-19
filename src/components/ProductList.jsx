import React from 'react';
import ProductItem from './ProductItem.jsx';

const ProductList = ({ products, onMoveStock, onSort, currentOrdering }) => {
  
  const renderSortArrow = (field) => {
    if (currentOrdering === field) return ' ▲';
    if (currentOrdering === `-${field}`) return ' ▼';
    return '';
  };

  const SortableHeader = ({ field, label }) => (
    <th>
      <button onClick={() => onSort(field)} className="sort-button">
        {label}{renderSortArrow(field)}
      </button>
    </th>
  );
  
  return (
    <div className="products-list">
      <table className="product-table">
        <thead>
          <tr>
            <th></th> {/* Checkbox */}
            <SortableHeader field="sku" label="SKU" />
            <SortableHeader field="ultima_atualizacao" label="Última Atualização" />
            <SortableHeader field="nome" label="Produto" />
            <SortableHeader field="modelo" label="Modelo" />
            <SortableHeader field="categoria_almo" label="Categoria" />
            <SortableHeader field="fornecedor" label="Fornecedor" />
            <SortableHeader field="endereco_almo" label="Localização" />
            <SortableHeader field="quantidade" label="Qtd." />
            <th>Status</th>
            
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductItem 
              key={product.sku || product.id} 
              product={product} 
              onMoveStock={onMoveStock} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;