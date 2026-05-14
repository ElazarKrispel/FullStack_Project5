import { useState } from 'react';
import './PhotoItem.css';

/**
 * Renders a single photo card with thumbnail, title, inline editing, and delete.
 */
export default function PhotoItem({ photo, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [editTitle, setEditTitle] = useState(photo.title);
  const [editUrl, setEditUrl] = useState(photo.thumbnailUrl);

  function handleSave() {
    if (editTitle.trim()) {
      onUpdate(photo.id, { title: editTitle.trim(), thumbnailUrl: editUrl.trim() });
    }
    setIsEditing(false);
  }

  return (
    <>
      <div className="photoItem">
        <img
          src={photo.thumbnailUrl}
          alt={photo.title}
          className="photoItemImg"
          width={150}
          height={150}
          onClick={() => setShowLightbox(true)}
        />
        <div className="photoItemContent">
          {isEditing ? (
            <div className="photoItemEdit">
              <input
                className="photoItemEditInput"
                value={editTitle}
                onChange={({ target }) => setEditTitle(target.value)}
                placeholder="Title"
              />
              <input
                className="photoItemEditInput"
                value={editUrl}
                onChange={({ target }) => setEditUrl(target.value)}
                placeholder="Image URL"
              />
            </div>
          ) : (
            <p className="photoItemTitle">{photo.title}</p>
          )}
          <div className="photoItemActions">
            {isEditing ? (
              <button className="photoItemBtn" onClick={handleSave}>Save</button>
            ) : (
              <button className="photoItemBtn" onClick={() => setIsEditing(true)}>Edit</button>
            )}
            <button
              className="photoItemBtn photoItemBtnDelete"
              onClick={() => onDelete(photo.id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {showLightbox && (
        <div className="lightboxOverlay" onClick={() => setShowLightbox(false)}>
          <div className="lightboxContent" onClick={(e) => e.stopPropagation()}>
            <button className="lightboxClose" onClick={() => setShowLightbox(false)}>&times;</button>
            <img src={photo.url} alt={photo.title} className="lightboxImg" />
          </div>
        </div>
      )}
    </>
  );
}
