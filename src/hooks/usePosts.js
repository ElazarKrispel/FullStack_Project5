import { useState, useEffect } from 'react';
import { getPosts, createPost, updatePost, deletePost } from '../services/api';
import { getLoggedUser } from '../utils/storage';

/**
 * Manages posts for a given user with sessionStorage caching.
 * Performs a security check before fetching: userId must match the logged user.
 */
export function usePosts(userId) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cacheKey = `posts_${userId}`;

  useEffect(() => {
    const loggedUser = getLoggedUser();
    if (!loggedUser || String(loggedUser.id) !== String(userId)) {
      setLoading(false);
      return;
    }

    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      setPosts(JSON.parse(cached));
      setLoading(false);
      return;
    }

    // fetch posts from server
    getPosts(userId)
      .then((data) => {
        setPosts(data);
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  /** Saves an updated posts array to both state and sessionStorage. */
  function persist(updated) {
    setPosts(updated);
    sessionStorage.setItem(cacheKey, JSON.stringify(updated));
  }

  /** Adds a new post with the given title and body. */
  async function addPost(title, body) {
    try {
      const created = await createPost({ userId: Number(userId), title, body });
      persist([...posts, created]);
    } catch (err) {
      setError(err.message);
    }
  }

  /** Deletes a post by id. */
  async function deletePostItem(id) {
    try {
      await deletePost(id);
      persist(posts.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  /** Updates the title and body of a post. */
  async function updatePostItem(id, title, body) {
    try {
      const updated = await updatePost(id, { title, body });
      persist(posts.map((p) => (p.id === id ? updated : p)));
    } catch (err) {
      setError(err.message);
    }
  }

  return {
    posts,
    loading,
    error,
    addPost,
    deletePost: deletePostItem,
    updatePost: updatePostItem,
  };
}
