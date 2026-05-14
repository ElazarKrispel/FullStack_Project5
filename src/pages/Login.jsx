import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUsers } from '../services/api';
import { setLoggedUser } from '../utils/storage';
import './Login.css';

/**
 * Login page. Finds a user where username matches and website equals the password.
 */
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const users = await getUsers();
      const user = users.find(
        (u) => u.username === username && u.website === password
      );
      if (!user) {
        setError('Invalid username or password.');
        return;
      }
      setLoggedUser(user);
      navigate('/home');
    } catch {
      setError('Could not connect to server.');
    }
  }

  return (
    <div className="loginPage">
      <div className="loginCard">
        <h2 className="loginTitle">Login</h2>
        <form className="loginForm" onSubmit={handleSubmit}>
          <label className="loginLabel" htmlFor="username">Username</label>
          <input
            id="username"
            className="loginInput"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label className="loginLabel" htmlFor="password">Password</label>
          <input
            id="password"
            className="loginInput"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="loginError">{error}</p>}
          <button className="loginBtn" type="submit">Login</button>
        </form>
        <p className="loginRegisterLink">
          No account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
