// em src/components/ProductList.jsx

import React from 'react';
import ProductItem from './ProductItem.jsx';

// 1. Receba a prop 'onMoveStock' aqui
const ProductList = ({ products, onMoveStock }) => {
  return (
     <div className="products-list">
      <table className="product-table">
        <thead>
          <tr>
            <th></th> {/* Checkbox */}
            <th>SKU</th>
            <th>Última Atualização</th>
            <th>Produto</th>
            <th>Modelo</th>      {/* <-- ADICIONADO */}
            <th>Categoria</th>   {/* <-- ADICIONADO */}
            <th>Fornecedor</th>
            <th>Localização</th>
            <th>Qtd.</th>
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