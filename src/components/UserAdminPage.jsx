// em src/pages/UserAdminPage.jsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const UserAdminPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('${process.env.REACT_APP_API_URL}/users/', {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        if (!response.ok) throw new Error('Não foi possível carregar os usuários.');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  const handleRoleChange = async (userId, newGroup) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}/set-group/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ group: newGroup })
        });
        if (!response.ok) throw new Error('Falha ao atualizar o grupo.');
        
        // Atualiza a lista de usuários na tela para refletir a mudança
        setUsers(users.map(user => 
            user.id === userId ? { ...user, groups: [{ name: newGroup }] } : user
        ));
        
    } catch (err) {
        alert(err.message); // Mostra um alerta de erro
    }
  };

  if (isLoading) return <p>Carregando usuários...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="user-admin-container">
      <h1>Gerenciamento de Usuários</h1>
      <table className="product-table"> {/* Reutilizando o estilo da sua tabela de produtos */}
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Email</th>
            <th>Hierarquia Atual</th>
            <th>Mudar Hierarquia Para</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email || 'N/A'}</td>
              <td>{user.groups[0]?.name || 'Sem Grupo'}</td>
              <td>
                <select 
                    className="filter-select"
                    defaultValue={user.groups[0]?.name}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="Visualizador">Visualizador</option>
                  <option value="Moderador">Moderador</option>
                  <option value="Admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserAdminPage;