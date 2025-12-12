import React, { useEffect, useState } from 'react';
import { fetchPublishers, followPublisher, unfollowPublisher } from '../services/api';

function PublisherList() {
  const [publishers, setPublishers] = useState([]);
  const [followed, setFollowed] = useState(new Set());
  const [error, setError] = useState('');

  useEffect(() => {
    const loadPublishers = async () => {
      try {
        const data = await fetchPublishers();
        setPublishers(data);
      } catch (error) {
        setError('Erreur lors du chargement des publishers');
        console.error(error);
      }
    };

    loadPublishers();
  }, []);

  const handleFollow = async (publisherId) => {
    try {
      await followPublisher(publisherId);
      setFollowed(new Set(followed).add(publisherId));
    } catch (error) {
      console.error('Erreur lors du suivi', error);
    }
  };

  const handleUnfollow = async (publisherId) => {
    try {
      await unfollowPublisher(publisherId);
      const newFollowed = new Set(followed);
      newFollowed.delete(publisherId);
      setFollowed(newFollowed);
    } catch (error) {
      console.error('Erreur lors du désabonnement', error);
    }
  };

  return (
    <div>
      <h1>Liste des Publishers</h1>
      {error && <p>{error}</p>}
      <ul className="publisher-list">
        {publishers.map((publisher) => (
          <li key={publisher.id}>
            <h3>{publisher.username}</h3>
            <p>{publisher.description}</p>
            {followed.has(publisher.id) ? (
              <button onClick={() => handleUnfollow(publisher.id)}>Se désabonner</button>
            ) : (
              <button onClick={() => handleFollow(publisher.id)}>Suivre</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PublisherList;
