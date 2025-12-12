import React, { useState } from 'react';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { setAuth } = useAuth(); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      const token = response.token;
      
      localStorage.setItem('token', token);

      setAuth({ username, token });

      setMessage('Connexion réussie !');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erreur lors de la connexion.');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Nom d'utilisateur"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
      />
      <button type="submit">Connexion</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default Login;
