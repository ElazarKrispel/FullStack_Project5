import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getLoggedUser, clearStorage } from '../utils/storage';
import NavBar from '../components/NavBar';
import InfoModal from '../components/InfoModal';
import './Home.css';

/**
 * Home page shown after login. Provides navigation to the user's resources.
 */
export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const user = getLoggedUser();

  function handleLogout() {
    clearStorage();
    navigate('/login');
  }

  return (
    <>
      <NavBar />
      <main className="homePage">
        <header className="homeHeader">
          <h1 className="homeUserName">{user?.name}</h1>
        </header>
        <nav className="homeNav">
          <Link className="homeNavLink" to={`/users/${user?.id}/todos`}>Todos</Link>
          <Link className="homeNavLink" to={`/users/${user?.id}/posts`}>Posts</Link>
          <Link className="homeNavLink" to={`/users/${user?.id}/albums`}>Albums</Link>
        </nav>
        <div className="homeActions">
          <button className="homeActionBtn" onClick={() => setShowModal(true)}>Info</button>
          <button className="homeActionBtn homeLogoutBtn" onClick={handleLogout}>Logout</button>
        </div>
      </main>
      {showModal && (
        <InfoModal user={user} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
