import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const StockMovementModal = ({ product, onClose, onSuccess }) => {
    const [quantidade, setQuantidade] = useState(1);
    const [observacao, setObservacao] = useState('');
    const [error, setError] = useState('');
    const { token, user } = useAuth();

    if (!product) return null;  

    if (!product) {
        return (
            <div className="modal-backdrop">
                <div className="modal-content">
                    <p>Carregando informações do produto...</p>
                    <div className="modal-actions">
                        <button className="btn btn-secondary" onClick={onClose}>Fechar</button>
                    </div>
                </div>
            </div>
        );
    }

    const handleSubmit = async (tipoMovimentacao) => {
        if (quantidade <= 0) {
            setError('A quantidade deve ser maior que zero.');
            return;
        }
        setError('');

        try {
            const response = await fetch('${import.meta.env.VITE_API_URL}/movimentacoes/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    produto: product.id,
                    tipo: tipoMovimentacao,
                    quantidade: quantidade,
                    observacao: observacao,
                    usuario: user.user_id,
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.non_field_errors?.[0] || 'Falha ao registrar movimentação.';
                throw new Error(errorMessage);
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Movimentar Estoque: {product?.name}</h2>
                <p>Quantidade atual: {product?.quantity}</p>
                
                {error && <p className="form-error">{error}</p>}

                <div className="form-field">
                    <label htmlFor="quantidade">Quantidade a Movimentar</label>
                    <input 
                        id="quantidade"
                        type="number" 
                        value={quantidade} 
                        onChange={(e) => setQuantidade(Number(e.target.value))}
                        min="1"
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="observacao">Observação (Opcional)</label>
                    <textarea 
                        id="observacao"
                        value={observacao}
                        onChange={(e) => setObservacao(e.target.value)}
                        placeholder="Ex: Retirada para a Sala 2.1.03"
                    />
                </div>

                <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                    <button className="btn" style={{backgroundColor: '#F44336', color: 'white'}} onClick={() => handleSubmit('SAIDA')}>Registrar Saída</button>
                    <button className="btn btn-primary" onClick={() => handleSubmit('ENTRADA')}>Registrar Entrada</button>
                </div>
            </div>
        </div>
    );
};

export default StockMovementModal;
