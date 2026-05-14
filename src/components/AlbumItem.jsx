import { Link } from 'react-router-dom';
import './AlbumItem.css';

/**
 * Renders a single album row with a link to its photos and a delete button.
 * Passes the album title via router state so the Photos page can display it.
 */
export default function AlbumItem({ album, index, userId, onDelete }) {
  return (
    <li className="albumItem">
      <Link
        to={`/users/${userId}/albums/${album.id}/photos`}
        state={{ albumTitle: album.title }}
        className="albumItemLink"
      >
        <span className="albumItemId">#{index + 1}</span>
        <span className="albumItemTitle">{album.title}</span>
      </Link>
      <button
        className="albumItemBtnDelete"
        onClick={() => onDelete(album.id)}
      >
        Delete
      </button>
    </li>
  );
}
