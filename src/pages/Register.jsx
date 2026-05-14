import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers, createUser } from '../services/api';
import { setLoggedUser } from '../utils/storage';
import './Register.css';

/**
 * Two-step registration form.
 * Step 1 collects credentials; step 2 collects profile details.
 */
export default function Register() {
  const navigate = useNavigate();

  // step 1 fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState('');

  // step 2 fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [companyName, setCompanyName] = useState('');

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  async function handleStep1(e) {
    e.preventDefault();
    setError('');
    if (password !== passwordVerify) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const users = await getUsers();
      if (users.some((u) => u.username === username)) {
        setError('Username already taken.');
        return;
      }
      setStep(2);
    } catch {
      setError('Could not connect to server.');
    }
  }

  async function handleStep2(e) {
    e.preventDefault();
    setError('');
    try {
      const newUser = {
        username,
        website: password,
        name: fullName,
        email,
        phone,
        address: { city },
        company: { name: companyName },
      };
      const created = await createUser(newUser);
      setLoggedUser(created);
      navigate('/home');
    } catch {
      setError('Registration failed. Please try again.');
    }
  }

  return (
    <div className="registerPage">
      <div className="registerCard">
        <h2 className="registerTitle">Register</h2>
        <p className="registerStep">Step {step} of 2</p>

        {step === 1 && (
          <form className="registerForm" onSubmit={handleStep1}>
            <label className="registerLabel" htmlFor="reg-username">Username</label>
            <input
              id="reg-username"
              className="registerInput"
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              required
            />
            <label className="registerLabel" htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              className="registerInput"
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              required
            />
            <label className="registerLabel" htmlFor="reg-verify">Verify Password</label>
            <input
              id="reg-verify"
              className="registerInput"
              type="password"
              value={passwordVerify}
              onChange={({ target }) => setPasswordVerify(target.value)}
              required
            />
            {error && <p className="registerError">{error}</p>}
            <button className="registerBtn" type="submit">Next</button>
          </form>
        )}

        {step === 2 && (
          <form className="registerForm" onSubmit={handleStep2}>
            <label className="registerLabel" htmlFor="reg-name">Full Name</label>
            <input
              id="reg-name"
              className="registerInput"
              type="text"
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              required
            />
            <label className="registerLabel" htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              className="registerInput"
              type="email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              required
            />
            <label className="registerLabel" htmlFor="reg-phone">Phone</label>
            <input
              id="reg-phone"
              className="registerInput"
              type="text"
              value={phone}
              onChange={({ target }) => setPhone(target.value)}
              required
            />
            <label className="registerLabel" htmlFor="reg-city">City</label>
            <input
              id="reg-city"
              className="registerInput"
              type="text"
              value={city}
              onChange={({ target }) => setCity(target.value)}
              required
            />
            <label className="registerLabel" htmlFor="reg-company">Company Name</label>
            <input
              id="reg-company"
              className="registerInput"
              type="text"
              value={companyName}
              onChange={({ target }) => setCompanyName(target.value)}
              required
            />
            {error && <p className="registerError">{error}</p>}
            <button className="registerBtn" type="submit">Complete Registration</button>
          </form>
        )}
      </div>
    </div>
  );
}
