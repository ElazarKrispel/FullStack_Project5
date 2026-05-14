/**
 * Returns the currently logged-in user object from localStorage, or null.
 */
export function getLoggedUser() {
  const raw = localStorage.getItem('loggedUser');
  return raw ? JSON.parse(raw) : null;
}

/**
 * Saves a user object to localStorage.
 */
export function setLoggedUser(user) {
  localStorage.setItem('loggedUser', JSON.stringify(user));
}

/**
 * Clears all localStorage entries.
 */
export function clearStorage() {
  localStorage.clear();
  sessionStorage.clear();
}
