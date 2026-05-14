import { useState } from 'react';
import './TodoItem.css';

/**
 * Renders a single todo row with a checkbox, inline title editing, and delete.
 */
export default function TodoItem({ todo, onDelete, onToggle, onUpdateTitle }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);

  function handleSave() {
    if (editValue.trim()) {
      onUpdateTitle(todo.id, editValue.trim());
    }
    setIsEditing(false);
  }

  return (
    <li className={`todoItem ${todo.completed ? 'todoItemDone' : ''}`}>
      <span className="todoItemId">#{todo.id}</span>
      <input
        type="checkbox"
        className="todoItemCheckbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id, todo.completed)}
      />
      {isEditing ? (
        <input
          className="todoItemEditInput"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          autoFocus
        />
      ) : (
        <span className="todoItemTitle">{todo.title}</span>
      )}
      <div className="todoItemActions">
        {isEditing ? (
          <button className="todoItemBtn" onClick={handleSave}>Save</button>
        ) : (
          <button className="todoItemBtn" onClick={() => setIsEditing(true)}>Edit</button>
        )}
        <button className="todoItemBtn todoItemBtnDelete" onClick={() => onDelete(todo.id)}>Delete</button>
      </div>
    </li>
  );
}
