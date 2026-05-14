import { useState, useEffect } from 'react';
import { getAlbums, createAlbum, deleteAlbum } from '../services/api';
import { getLoggedUser } from '../utils/storage';

/**
 * Manages albums for a given user with sessionStorage caching.
 * Performs a security check before fetching: userId must match the logged user.
 */
export function useAlbums(userId) {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cacheKey = `albums_${userId}`;

  useEffect(() => {
    const loggedUser = getLoggedUser();
    if (!loggedUser || String(loggedUser.id) !== String(userId)) {
      setLoading(false);
      return;
    }

    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      setAlbums(JSON.parse(cached));
      setLoading(false);
      return;
    }

    // fetch albums from server
    getAlbums(userId)
      .then((data) => {
        setAlbums(data);
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  /** Saves an updated albums array to both state and sessionStorage. */
  function persist(updated) {
    setAlbums(updated);
    sessionStorage.setItem(cacheKey, JSON.stringify(updated));
  }

  /** Adds a new album with the given title. */
  async function addAlbum(title) {
    try {
      const created = await createAlbum({ userId: Number(userId), title });
      persist([...albums, created]);
    } catch (err) {
      setError(err.message);
    }
  }

  /** Deletes an album by id. */
  async function deleteAlbumItem(id) {
    try {
      await deleteAlbum(id);
      persist(albums.filter((a) => a.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return {
    albums,
    loading,
    error,
    addAlbum,
    deleteAlbum: deleteAlbumItem,
  };
}
