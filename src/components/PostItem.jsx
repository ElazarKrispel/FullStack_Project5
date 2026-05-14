import { useState } from 'react';
import './PostItem.css';

/**
 * Renders a single post row with select, inline editing, and delete.
 * Highlights when isSelected is true.
 */
export default function PostItem({ post, isSelected, onSelect, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editBody, setEditBody] = useState(post.body);

  function handleSave() {
    if (editTitle.trim()) {
      onUpdate(post.id, editTitle.trim(), editBody.trim());
    }
    setIsEditing(false);
  }

  return (
    <li className={`postItem ${isSelected ? 'postItemSelected' : ''}`}>
      <div className="postItemHeader">
        <span className="postItemId">#{post.id}</span>
        {isEditing ? (
          <input
            className="postItemEditTitle"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
        ) : (
          <strong className="postItemTitle">{post.title}</strong>
        )}
        <div className="postItemActions">
          <button className="postItemBtn" onClick={() => onSelect(post.id)}>
            {isSelected ? 'Deselect' : 'Select'}
          </button>
          {isEditing ? (
            <button className="postItemBtn" onClick={handleSave}>Save</button>
          ) : (
            <button className="postItemBtn" onClick={() => setIsEditing(true)}>Edit</button>
          )}
          <button
            className="postItemBtn postItemBtnDelete"
            onClick={() => onDelete(post.id)}
          >
            Delete
          </button>
        </div>
      </div>
      {isEditing && (
        <textarea
          className="postItemEditBody"
          value={editBody}
          onChange={(e) => setEditBody(e.target.value)}
          rows={3}
        />
      )}
    </li>
  );
}
