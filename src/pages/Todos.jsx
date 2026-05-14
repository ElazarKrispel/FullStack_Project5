import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTodos } from '../hooks/useTodos';
import { getLoggedUser } from '../utils/storage';
import NavBar from '../components/NavBar';
import TodoItem from '../components/TodoItem';
import './Todos.css';

/**
 * Todos page for a specific user. Supports sort, search, add, and CRUD on todos.
 */
export default function Todos() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { todos, loading, error, addTodo, deleteTodo, toggleTodo, updateTodoTitle } = useTodos(id);

  const [sortBy, setSortBy] = useState('id');
  const [searchTerm, setSearchTerm] = useState('');
  const [newTitle, setNewTitle] = useState('');

  // redirect if user navigates to another user's todos
  useEffect(() => {
    const user = getLoggedUser();
    if (!user || String(user.id) !== String(id)) {
      navigate('/home');
    }
  }, [id]);

  async function handleAdd(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await addTodo(newTitle.trim());
    setNewTitle('');
  }

  // filter then sort - computed on every render, no useEffect needed
  const filtered = todos.filter((t) =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'completed') return Number(a.completed) - Number(b.completed);
    return a.id - b.id;
  });

  return (
    <>
      <NavBar />
      <main className="todosPage">
        <h2 className="todosTitle">My Todos</h2>
        <div className="todosControls">
          <select
            className="todosSort"
            value={sortBy}
            onChange={({ target }) => setSortBy(target.value)}
          >
            <option value="id">Sort by ID</option>
            <option value="title">Sort by Title</option>
            <option value="completed">Sort by Status</option>
          </select>
          <input
            className="todosSearch"
            type="text"
            placeholder="Search todos..."
            value={searchTerm}
            onChange={({ target }) => setSearchTerm(target.value)}
          />
        </div>
        {loading && <p className="todosLoading">Loading...</p>}
        {error && <p className="todosError">{error}</p>}
        <ul className="todosList">
          {sorted.map((todo, index) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              index={index}
              onDelete={deleteTodo}
              onToggle={toggleTodo}
              onUpdateTitle={updateTodoTitle}
            />
          ))}
        </ul>
        <form className="todosAddForm" onSubmit={handleAdd}>
          <input
            className="todosAddInput"
            type="text"
            placeholder="New todo title..."
            value={newTitle}
            onChange={({ target }) => setNewTitle(target.value)}
          />
          <button className="todosAddBtn" type="submit">Add Todo</button>
        </form>
      </main>
    </>
  );
}
