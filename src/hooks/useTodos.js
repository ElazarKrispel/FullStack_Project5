import { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../services/api';
import { getLoggedUser } from '../utils/storage';

/**
 * Manages todos for a given user with sessionStorage caching.
 * Performs a security check before fetching: userId must match the logged user.
 */
export function useTodos(userId) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cacheKey = `todos_${userId}`;

  useEffect(() => {
    const loggedUser = getLoggedUser();
    if (!loggedUser || String(loggedUser.id) !== String(userId)) {
      setLoading(false);
      return;
    }

    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      setTodos(JSON.parse(cached));
      setLoading(false);
      return;
    }

    // fetch todos from server
    getTodos(userId)
      .then((data) => {
        setTodos(data);
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  /** Saves an updated todos array to both state and sessionStorage. */
  function persist(updated) {
    setTodos(updated);
    sessionStorage.setItem(cacheKey, JSON.stringify(updated));
  }

  /** Adds a new todo with the given title for this user. */
  async function addTodo(title) {
    try {
      const created = await createTodo({ userId: Number(userId), title, completed: false });
      persist([...todos, created]);
    } catch (err) {
      setError(err.message);
    }
  }

  /** Deletes a todo by id. */
  async function deleteTodoItem(id) {
    try {
      await deleteTodo(id);
      persist(todos.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  /** Toggles the completed state of a todo. */
  async function toggleTodo(id, completed) {
    try {
      const updated = await updateTodo(id, { completed: !completed });
      persist(todos.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  }

  /** Updates the title of a todo. */
  async function updateTodoTitle(id, title) {
    try {
      const updated = await updateTodo(id, { title });
      persist(todos.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  }

  return {
    todos,
    loading,
    error,
    addTodo,
    deleteTodo: deleteTodoItem,
    toggleTodo,
    updateTodoTitle,
  };
}
