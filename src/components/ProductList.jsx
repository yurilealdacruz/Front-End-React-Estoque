// src/components/ProductList.jsx - CÓDIGO ATUALIZADO E SIMPLIFICADO

import React from 'react'; // Não precisamos mais de useState aqui
import ProductItem from './ProductItem.jsx';

// 1. O componente agora recebe o "bilhete" (props). 
// Usamos { products } para já pegar a lista de dentro do bilhete.
// src/components/ProductList.jsx

// ...

function ProductList({ products }) {
  return (
    <div className="product-list-container">
      <table className="product-table">
        <thead>
          <tr>
            <th></th> {/* Checkbox */}
            <th>SKU</th> {/* ALTERADO: de 'N' para 'SKU' */}
            <th>Última Atualização</th>
            <th>Produto</th>
            <th>Fornecedor</th>
            <th>Localização</th>
            <th>Qtd.</th>
            <th>Status</th>
            <th></th> {/* Coluna para os ícones de ação */}
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductItem key={product.sku} product={product} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;