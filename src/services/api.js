const BASE_URL = 'http://localhost:3001';

/** Sends a fetch request and throws if the response is not ok. */
async function request(path, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    // DELETE returns 200 with empty body on json-server v1
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (err) {
    throw err;
  }
}

/** Returns JSON headers for POST/PATCH requests. */
function jsonHeaders() {
  return { 'Content-Type': 'application/json' };
}

// Users

/** Fetches all users. */
export async function getUsers() {
  return request('/users');
}

/** Creates a new user and returns the created object. */
export async function createUser(data) {
  return request('/users', {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });
}

// Todos

/** Fetches all todos belonging to a user. */
export async function getTodos(userId) {
  return request(`/todos?userId=${userId}`);
}

/** Creates a new todo and returns the created object. */
export async function createTodo(data) {
  return request('/todos', {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });
}

/** Updates a todo by id with the given fields. */
export async function updateTodo(id, data) {
  return request(`/todos/${id}`, {
    method: 'PATCH',
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });
}

/** Deletes a todo by id. */
export async function deleteTodo(id) {
  return request(`/todos/${id}`, { method: 'DELETE' });
}

// Posts

/** Fetches all posts belonging to a user. */
export async function getPosts(userId) {
  return request(`/posts?userId=${userId}`);
}

/** Creates a new post and returns the created object. */
export async function createPost(data) {
  return request('/posts', {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });
}

/** Updates a post by id with the given fields. */
export async function updatePost(id, data) {
  return request(`/posts/${id}`, {
    method: 'PATCH',
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });
}

/** Deletes a post by id. */
export async function deletePost(id) {
  return request(`/posts/${id}`, { method: 'DELETE' });
}

// Comments

/** Fetches all comments belonging to a post. */
export async function getComments(postId) {
  return request(`/comments?postId=${postId}`);
}

/** Creates a new comment and returns the created object. */
export async function createComment(data) {
  return request('/comments', {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });
}

/** Updates a comment by id with the given fields. */
export async function updateComment(id, data) {
  return request(`/comments/${id}`, {
    method: 'PATCH',
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });
}

/** Deletes a comment by id. */
export async function deleteComment(id) {
  return request(`/comments/${id}`, { method: 'DELETE' });
}

// Albums

/** Fetches all albums belonging to a user. */
export async function getAlbums(userId) {
  return request(`/albums?userId=${userId}`);
}

/** Creates a new album and returns the created object. */
export async function createAlbum(data) {
  return request('/albums', {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });
}

/** Deletes an album by id. */
export async function deleteAlbum(id) {
  return request(`/albums/${id}`, { method: 'DELETE' });
}

// Photos

/** Fetches a page of photos for an album. Returns { data, next, items, pages }. */
export async function getPhotos(albumId, page = 1, perPage = 10) {
  return request(`/photos?albumId=${albumId}&_page=${page}&_per_page=${perPage}`);
}

/** Creates a new photo and returns the created object. */
export async function createPhoto(data) {
  return request('/photos', {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });
}

/** Updates a photo by id with the given fields. */
export async function updatePhoto(id, data) {
  return request(`/photos/${id}`, {
    method: 'PATCH',
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });
}

/** Deletes a photo by id. */
export async function deletePhoto(id) {
  return request(`/photos/${id}`, { method: 'DELETE' });
}
