import React, { useState, useEffect } from 'react'; 
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProductFormPage = () => {
    const { sku } = useParams();
    const isEditing = Boolean(sku);

    // O estado inicial do formulário deve ser definido aqui
    const [formData, setFormData] = useState({
        nome: '', sku: '', tipo_estoque: 'ALMOXARIFADO',
        quantidade: '', fornecedor: '', descricao: '',
        modelo: '', categoria_almo: '', endereco_almo: '',
        sala_laboratorio: '', foto: null,
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAuth();
    const navigate = useNavigate();

    // Este useEffect busca os dados do produto quando em modo de edição
    useEffect(() => {
        if (isEditing) {
            setIsLoading(true);
            const fetchProductData = async () => {
                try {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/produtos/${sku}/`, {
                        headers: { 'Authorization': `Token ${token}` }
                    });
                    if (!response.ok) throw new Error('Produto não encontrado.');
                    const data = await response.json();
                    setFormData({ ...data, foto: null });
                } catch (err) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProductData();
        }
    }, [sku, token, isEditing]);
    

   

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const dataToSend = new FormData();
        for (const key in formData) {
            // Não envia a foto se ela for nula (para não apagar a foto existente na edição)
            if (key === 'foto' && !formData.foto) continue;
            if (formData[key] !== null && formData[key] !== '') {
                dataToSend.append(key, formData[key]);
            }
        }

         // 4. LÓGICA CONDICIONAL: URL e método mudam se estamos editando
        const url = isEditing 
            ? `${import.meta.env.VITE_API_URL}/produtos/${sku}/` 
            : `${import.meta.env.VITE_API_URL}/produtos/`;
        
        const method = isEditing ? 'PUT' : 'POST';

       
        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Authorization': `Token ${token}` },
                body: dataToSend,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(JSON.stringify(errorData));
            }

            navigate('/');
             } catch (err) {
            setError(`Falha ao ${isEditing ? 'editar' : 'adicionar'} produto.`);
            console.error(err);
        } finally {
            setIsLoading(false);
        }

         };
               if (isLoading && isEditing) return <p>Carregando dados do produto...</p>;

    return (
        <div className="add-product-container">
            <h1>Adicionar Novo Produto</h1>
            {/* Garanta que a tag <form> envolve todos os campos e o botão */}
            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-grid">
                    
                    <div className="form-field">
                        <label htmlFor="nome">Nome do Produto</label>
                        <input id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
                    </div>

                    <div className="form-field">
                        <label htmlFor="sku">SKU (Código)</label>
                        <input id="sku" name="sku" value={formData.sku} onChange={handleChange} />
                    </div>

                    <div className="form-field">
                    <label htmlFor="quantidade">Quantidade</label>
                        <input 
                            id="quantidade" 
                            name="quantidade" 
                            type="number" 
                            value={formData.quantidade} 
                            onChange={handleChange} 
                            required
                            disabled={isEditing} // <-- AQUI ESTÁ A LÓGICA MÁGICA
                            title={isEditing ? "A quantidade só pode ser alterada através de uma movimentação de estoque." : ""}
                        />
                </div>
                    
                    <div className="form-field">
                        <label htmlFor="tipo_estoque">Tipo de Estoque</label>
                        <select id="tipo_estoque" name="tipo_estoque" value={formData.tipo_estoque} onChange={handleChange}>
                            <option value="ALMOXARIFADO">Almoxarifado</option>
                            <option value="DIDATICO">Ambiente Didático</option>
                            <option value="ASSISTENCIA">Assistência Técnica</option>
                        </select>
                    </div>

                    {/* Campos Condicionais */}
                    {formData.tipo_estoque === 'ALMOXARIFADO' && (
                        <>
                            <div className="form-field">
                                <label htmlFor="modelo">Modelo</label>
                                <input id="modelo" name="modelo" value={formData.modelo} onChange={handleChange} />
                            </div>
                            <div className="form-field">
                                <label htmlFor="categoria_almo">Categoria</label>
                                <input id="categoria_almo" name="categoria_almo" value={formData.categoria_almo} onChange={handleChange} />
                            </div>
                            <div className="form-field full-width">
                                <label htmlFor="endereco_almo">Endereço / Localização</label>
                                <input id="endereco_almo" name="endereco_almo" value={formData.endereco_almo} onChange={handleChange} />
                            </div>
                        </>
                    )}
                    {formData.tipo_estoque === 'DIDATICO' && (
                        <div className="form-field">
                            <label htmlFor="sala_laboratorio">Sala / Laboratório</label>
                            <input id="sala_laboratorio" name="sala_laboratorio" value={formData.sala_laboratorio} onChange={handleChange} />
                        </div>
                    )}
                    
                    <div className="form-field full-width">
                        <label htmlFor="descricao">Descrição (Opcional)</label>
                        <textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleChange}></textarea>
                    </div>

                    <div className="form-field full-width">
                        <label>Foto do Produto (Opcional)</label>
                        <div className="file-input-wrapper">
                            <label htmlFor="foto" className="file-input-label">Escolher arquivo</label>
                            <input id="foto" name="foto" type="file" onChange={handleChange} accept="image/*" />
                            {formData.foto && <span className="file-name">{formData.foto.name}</span>}
                        </div>
                    </div>
                    
                    {error && <p className="form-error full-width">{error}</p>}
                    
                    {/* Garanta que o botão tem type="submit" e está dentro do <form> */}
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? 'Adicionando...' : 'Adicionar Produto'}
                    </button>

                </div>
            </form>
        </div>
    );
};

export default ProductFormPage;