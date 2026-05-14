import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Todos from './pages/Todos';
import Posts from './pages/Posts';
import Albums from './pages/Albums';
import Photos from './pages/Photos';
import ProtectedRoute from './components/ProtectedRoute';

/** Root component that defines all application routes. */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/:id/todos"
        element={
          <ProtectedRoute>
            <Todos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/:id/posts"
        element={
          <ProtectedRoute>
            <Posts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/:id/albums"
        element={
          <ProtectedRoute>
            <Albums />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/:id/albums/:albumId/photos"
        element={
          <ProtectedRoute>
            <Photos />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
