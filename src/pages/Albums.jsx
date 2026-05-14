import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAlbums } from '../hooks/useAlbums';
import { getLoggedUser } from '../utils/storage';
import NavBar from '../components/NavBar';
import AlbumItem from '../components/AlbumItem';
import './Albums.css';

/**
 * Albums page for a specific user. Supports add, delete, and search.
 */
export default function Albums() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { albums, loading, error, addAlbum, deleteAlbum } = useAlbums(id);

  const [searchTerm, setSearchTerm] = useState('');
  const [newAlbumTitle, setNewAlbumTitle] = useState('');

  // redirect if wrong user
  useEffect(() => {
    const user = getLoggedUser();
    if (!user || String(user.id) !== String(id)) {
      navigate('/home');
    }
  }, [id]);

  async function handleAdd(e) {
    e.preventDefault();
    if (!newAlbumTitle.trim()) return;
    await addAlbum(newAlbumTitle.trim());
    setNewAlbumTitle('');
  }

  // filter by id or title
  const filtered = albums.filter((a) => {
    const term = searchTerm.toLowerCase();
    return (
      String(a.id).includes(term) ||
      a.title.toLowerCase().includes(term)
    );
  });

  return (
    <>
      <NavBar />
      <main className="albumsPage">
        <h2 className="albumsTitle">My Albums</h2>
        <input
          className="albumsSearch"
          type="text"
          placeholder="Search by id or title..."
          value={searchTerm}
          onChange={({ target }) => setSearchTerm(target.value)}
        />
        {loading && <p className="albumsLoading">Loading...</p>}
        {error && <p className="albumsError">{error}</p>}
        <ul className="albumsList">
          {filtered.map((album) => (
            <AlbumItem
              key={album.id}
              album={album}
              userId={id}
              onDelete={deleteAlbum}
            />
          ))}
        </ul>
        <form className="albumsAddForm" onSubmit={handleAdd}>
          <input
            className="albumsAddInput"
            type="text"
            placeholder="New album title..."
            value={newAlbumTitle}
            onChange={({ target }) => setNewAlbumTitle(target.value)}
          />
          <button className="albumsAddBtn" type="submit">Create Album</button>
        </form>
      </main>
    </>
  );
}
