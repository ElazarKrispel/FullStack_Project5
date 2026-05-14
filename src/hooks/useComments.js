import { useState } from 'react';
import { getComments, createComment, updateComment, deleteComment } from '../services/api';

/**
 * Manages comments for posts.
 * Fetches comments lazily to allow "Show Comments" toggles without loading upfront.
 */
export function useComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchComments(postId) {
    setLoading(true);
    setError(null);
    try {
      const data = await getComments(postId);
      setComments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function addComment(postId, name, email, body) {
    try {
      const created = await createComment({ postId, name, email, body });
      setComments((prev) => [...prev, created]);
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteCommentItem(commentId) {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateCommentItem(commentId, body) {
    try {
      const updated = await updateComment(commentId, { body });
      setComments((prev) => prev.map((c) => (c.id === commentId ? updated : c)));
    } catch (err) {
      setError(err.message);
    }
  }

  function clearComments() {
    setComments([]);
    setError(null);
  }

  return {
    comments,
    loading,
    error,
    fetchComments,
    addComment,
    deleteComment: deleteCommentItem,
    updateComment: updateCommentItem,
    clearComments,
  };
}
