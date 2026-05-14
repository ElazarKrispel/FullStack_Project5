import { useState, useEffect, useRef } from 'react';
import { getPhotos, createPhoto, updatePhoto, deletePhoto } from '../services/api';

const LIMIT = 10;

/**
 * Manages photos for a given album with server-side batch-loading and sessionStorage caching.
 *
 * we decided to do here a Two-effect design:
 * 1. Effect 1 [albumId]: on mount, restores from cache or fetches page 1.
 * 2. Effect 2 [albumId, currentPage]: fires only when currentPage exceeds what's already loaded,
 *    preventing StrictMode's double-invocation from triggering extra fetches.
 */
export function usePhotos(albumId) {
  const [photos, setPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // tracks the highest page already loaded so Effect 2 can skip re-runs for already-loaded pages
  const loadedUpTo = useRef(0);

  const cacheKey = `photos_${albumId}`;

  // Effect 1: runs once per albumId — restores cache or fetches page 1.
  // Sets loadedUpTo = 1 synchronously so Effect 2 (which runs after) skips page 1.
  useEffect(() => {
    loadedUpTo.current = 1;
    setCurrentPage(1);
    setPhotos([]);
    setHasMore(true);
    setError(null);

    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      setPhotos(parsed.photos);
      setHasMore(parsed.hasMore);
      loadedUpTo.current = parsed.currentPage ?? 1;
      setCurrentPage(parsed.currentPage ?? 1);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    getPhotos(albumId, 1, LIMIT)
      .then((res) => {
        if (cancelled) return;
        const more = res.next !== null;
        const newPhotos = res.data;
        setPhotos(newPhotos);
        setHasMore(more);
        loadedUpTo.current = 1;
        sessionStorage.setItem(cacheKey, JSON.stringify({ photos: newPhotos, hasMore: more, currentPage: 1 }));
      })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [albumId]);

  // Effect 2: fires when currentPage increments beyond what's already loaded (i.e., loadMore was called)
  useEffect(() => {
    if (currentPage <= loadedUpTo.current) return;

    let cancelled = false;
    setLoading(true);
    getPhotos(albumId, currentPage, LIMIT)
      .then((res) => {
        if (cancelled) return;
        const more = res.next !== null;
        setPhotos((prev) => {
          const updated = [...prev, ...res.data];
          sessionStorage.setItem(cacheKey, JSON.stringify({ photos: updated, hasMore: more, currentPage }));
          return updated;
        });
        setHasMore(more);
        loadedUpTo.current = currentPage;
      })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [albumId, currentPage]);

  /** Writes the updated photos array to state and sessionStorage without changing the batch-loading state. */
  function persist(updated) {
    setPhotos(updated);
    sessionStorage.setItem(cacheKey, JSON.stringify({ photos: updated, hasMore, currentPage }));
  }

  /** Increments currentPage, triggering Effect 2 to fetch and append the next batch. */
  function loadMore() {
    setCurrentPage((p) => p + 1);
  }

  /** Adds a new photo to the album. */
  async function addPhoto(title, url, thumbnailUrl) {
    try {
      const created = await createPhoto({ albumId: Number(albumId), title, url, thumbnailUrl });
      persist([...photos, created]);
    } catch (err) {
      setError(err.message);
    }
  }

  /** Deletes a photo by id. */
  async function deletePhotoItem(id) {
    try {
      await deletePhoto(id);
      persist(photos.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  /** Updates a photo's title and/or URL. */
  async function updatePhotoItem(id, data) {
    try {
      const updated = await updatePhoto(id, data);
      persist(photos.map((p) => (p.id === id ? updated : p)));
    } catch (err) {
      setError(err.message);
    }
  }

  return {
    photos,
    loading,
    error,
    hasMore,
    loadMore,
    addPhoto,
    deletePhoto: deletePhotoItem,
    updatePhoto: updatePhotoItem,
  };
}
