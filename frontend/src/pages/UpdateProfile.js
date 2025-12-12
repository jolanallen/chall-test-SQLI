import React, { useState } from 'react';
import { updateProfile } from '../services/api';

function UpdateProfile() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(username, password, description);
      setMessage('Profil mis à jour avec succès !');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erreur lors de la mise à jour du profil.');
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Mettre à Jour le Profil</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nouveau Nom d'utilisateur :</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nom d'utilisateur"
          />
        </div>
        <div>
          <label>Nouveau Mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
          />
        </div>
        <div>
          <label>Description :</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez-vous ici..."
          />
        </div>
        <button type="submit">Mettre à Jour</button>
      </form>
    </div>
  );
}

export default UpdateProfile;
