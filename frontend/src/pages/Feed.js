import React, { useEffect, useState } from 'react';
import { fetchFeed } from '../services/api';

function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await fetchFeed();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Liste des Articles</h1>
      <ul className="article-list">
        {posts.map((article) => (
          <li key={article.id}>
            <h3>{article.title}</h3>
            <p>{article.content}</p>
            <p>Par {article.username}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Feed;
