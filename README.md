# FullStack Project 5: Social Productivity App

**Course:** Full-Stack Web Development, Lev Academic Center
**Students:** Elazar Krispel & Tomere Kalman

---

## Project Overview

A multi-user social productivity web app where users can register, log in, and manage their personal content — todos, posts, albums, and photos.
Each user has a private dashboard with full CRUD capabilities across all content types.
Comments can be read and added on posts, photos are organized in albums with paginated loading, and all data is cached in session storage to minimize API calls.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, React Router DOM 7 |
| Build Tool | Vite 8 |
| Backend | JSON Server (mock REST API) |
| Storage | localStorage + sessionStorage |
| Styling | Plain CSS (per-component files) |

---

## Features

- **Authentication** — 2-step registration form & login with username/password, session persisted in localStorage
- **Protected Routes** — all user pages are guarded; unauthorized access redirects to login
- **Todos** — create, edit, delete, toggle complete, search by title, sort by ID / title / status
- **Posts** — full CRUD, search by ID/title, lazy-load comments per post, add/edit/delete comments
- **Albums** — create, rename, delete, search by ID/title
- **Photos** — paginated photo gallery (10 per page), edit title & image URL, click to open full size
- **User Info Modal** — view profile details (name, email, phone, city, company) inline
- **Session Caching** — todos, posts, albums, and photos are cached per user to reduce redundant API calls
- **Custom Hooks** — `useTodos`, `usePosts`, `useComments`, `useAlbums`, `usePhotos` for clean separation of logic

---

## How to Run

**Prerequisites:** Node.js installed

```bash
npm install
```

Open two terminals:

```bash
# Terminal 1 — start the mock backend (port 3001)
npm run server

# Terminal 2 — start the React dev server (port 5173)
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

> **Test credentials:** username `yossi` / password `pass1` (or register a new account)
