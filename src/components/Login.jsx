// em src/components/Login.jsx - VERSÃO CORRIGIDA E FINAL

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // 1. Importa o hook 'useAuth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

// A propriedade 'onLogin' é removida, pois não a usamos mais
const Login = () => {
  const { login } = useAuth(); // 2. Pega a função 'login' diretamente do nosso contexto
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Garanta que a URL está correta (porta 8000)
      const response = await fetch('${import.meta.env.VITE_API_URL}/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        // Tenta ler a mensagem de erro específica do Django
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.non_field_errors?.[0] || 'Login ou senha inválidos.');
      }

      const data = await response.json();
      
      // 3. AQUI ESTÁ A MUDANÇA CRUCIAL:
      // Chamamos a função 'login' do contexto, passando todos os dados do usuário
      login(data);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      {/* O resto do seu formulário de login está perfeito e não precisa de alterações */}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 7L12 12L22 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 12V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h2>Acessar Sistema</h2>

        {error && <p className="login-error">{error}</p>}

        <div className="form-group">
          <label htmlFor="username">Usuário</label>
          <FontAwesomeIcon icon={faUser} className="input-icon" />
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Digite seu usuário"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <FontAwesomeIcon icon={faLock} className="input-icon" />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary">Entrar</button>
      </form>
    </div>
  );
};

export default Login;