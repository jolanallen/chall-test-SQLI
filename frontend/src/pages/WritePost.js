import React, { useState } from 'react';
import { createPost } from '../services/api';

function WritePost() {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost(content);
      alert("Post créé avec succès !");
      setContent('');
    } catch (error) {
      console.error("Erreur lors de la création du post", error);
    }
  };

  return (
    <div>
      <h1>Write Post</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Rédigez votre post ici..."
        />
        <button type="submit">Publier</button>
      </form>
    </div>
  );
}

export default WritePost;

