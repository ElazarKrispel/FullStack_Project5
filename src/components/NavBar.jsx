import { Link } from 'react-router-dom';
import { getLoggedUser } from '../utils/storage';
import './NavBar.css';

/**
 * Navigation bar shown on all protected pages.
 * Displays the logged-in user's name and a link back to the home page.
 */
export default function NavBar() {
  const user = getLoggedUser();
  return (
    <nav className="navBar">
      <Link to="/home" className="navBarHomeLink">Home</Link>
      {user && <span className="navBarUserName">{user.name}</span>}
    </nav>
  );
}
