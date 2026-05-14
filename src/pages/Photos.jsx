import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { usePhotos } from '../hooks/usePhotos';
import { getLoggedUser } from '../utils/storage';
import NavBar from '../components/NavBar';
import PhotoItem from '../components/PhotoItem';
import './Photos.css';

/**
 * Photos page for a specific album. Supports server-side batch-loading, add, delete, and edit.
 */
export default function Photos() {
  const { id, albumId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const albumTitle = state?.albumTitle ?? 'Album';

  const { photos, loading, error, hasMore, loadMore, addPhoto, deletePhoto, updatePhoto } =
    usePhotos(albumId);

  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // redirect if wrong user
  useEffect(() => {
    const user = getLoggedUser();
    if (!user || String(user.id) !== String(id)) {
      navigate('/home');
    }
  }, [id]);

  async function handleAdd(e) {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;
    await addPhoto(newTitle.trim(), newUrl.trim(), newUrl.trim());
    setNewTitle('');
    setNewUrl('');
  }

  return (
    <>
      <NavBar />
      <main className="photosPage">
        <div className="photosPageHeader">
          <button className="photosBackBtn" onClick={() => navigate(-1)}>Back</button>
          <h2 className="photosAlbumTitle">{albumTitle}</h2>
        </div>
        {loading && <p className="photosLoading">Loading...</p>}
        {error && <p className="photosError">{error}</p>}
        <div className="photosGrid">
          {photos.map((photo) => (
            <PhotoItem
              key={photo.id}
              photo={photo}
              onDelete={deletePhoto}
              onUpdate={updatePhoto}
            />
          ))}
        </div>
        {hasMore && (
          <button className="photosLoadMore" onClick={loadMore}>
            Load More
          </button>
        )}
        <form className="photosAddForm" onSubmit={handleAdd}>
          <h3 className="photosAddTitle">Add Photo</h3>
          <input
            className="photosAddInput"
            type="text"
            placeholder="Photo title"
            value={newTitle}
            onChange={({ target }) => setNewTitle(target.value)}
            required
          />
          <input
            className="photosAddInput"
            type="url"
            placeholder="Image URL (https://picsum.photos/id/1/150/150)"
            value={newUrl}
            onChange={({ target }) => setNewUrl(target.value)}
            required
          />
          <button className="photosAddBtn" type="submit">Add</button>
        </form>
      </main>
    </>
  );
}
