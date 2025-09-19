// em src/components/ProductList.jsx

import React from 'react';
import ProductItem from './ProductItem.jsx';

// 1. Receba a prop 'onMoveStock' aqui
const ProductList = ({ products, onMoveStock, onSort, currentOrdering }) => {

   const renderSortArrow = (field) => {
    if (currentOrdering === field) {
      return ' ▲'; // Seta para cima (ascendente)
    }
    if (currentOrdering === `-${field}`) {
      return ' ▼'; // Seta para baixo (descendente)
    }
    return ''; // Sem ordenação
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
            <th>Fornecedor</th> {/* Exemplo de campo não ordenável */}
            <th>Localização</th>
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