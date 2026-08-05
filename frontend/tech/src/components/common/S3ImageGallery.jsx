/**
 * S3ImageGallery.jsx
 *
 * A reusable component that fetches and displays images (or PDF links)
 * from a specific S3 bucket folder/category.
 *
 * Usage:
 *   <S3ImageGallery category="hotel" title="Hotel Photos" />
 *   <S3ImageGallery category="destination" searchQuery="Goa" title="Destination Images" />
 *   <S3ImageGallery folder="restaurants/images" title="Restaurants" />
 *
 * When searchQuery is provided, it filters the displayed images
 * by filename match (case-insensitive).
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { fetchImagesByCategory, fetchImagesByFolder, uploadToCategory } from '../../services/s3MediaService';
import { ImageIcon, Upload, X, ZoomIn, Download, Loader2, RefreshCcw, FileText } from 'lucide-react';

const CATEGORY_META = {
  hotel:       { emoji: '🏨', label: 'Hotels',       color: 'from-purple-600 to-violet-700' },
  destination: { emoji: '🗺️', label: 'Destinations', color: 'from-blue-600 to-indigo-700' },
  attraction:  { emoji: '🏰', label: 'Attractions',  color: 'from-pink-600 to-rose-700' },
  restaurant:  { emoji: '🍽️', label: 'Restaurants',  color: 'from-amber-500 to-orange-600' },
  profile:     { emoji: '👤', label: 'Profiles',     color: 'from-emerald-600 to-teal-700' },
  itinerary:   { emoji: '📄', label: 'Itineraries',  color: 'from-slate-600 to-gray-700' },
};

export default function S3ImageGallery({
  category = null,
  folder = null,
  searchQuery = '',
  title = null,
  allowUpload = false,
  maxCols = 3,
  compact = false,
}) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const meta = category ? (CATEGORY_META[category] || { emoji: '📁', label: category, color: 'from-gray-600 to-slate-700' }) : { emoji: '📁', label: folder || 'Media', color: 'from-gray-600 to-slate-700' };
  const displayTitle = title || `${meta.emoji} ${meta.label}`;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const urls = category
        ? await fetchImagesByCategory(category)
        : await fetchImagesByFolder(folder);
      setImages(urls);
    } catch (e) {
      setError('Could not load images from S3.');
    } finally {
      setLoading(false);
    }
  }, [category, folder]);

  useEffect(() => { load(); }, [load]);

  // Filter by searchQuery (matches filename in URL)
  const filtered = searchQuery
    ? images.filter(url => {
        const filename = url.split('/').pop().toLowerCase();
        return filename.includes(searchQuery.toLowerCase());
      })
    : images;

  const isPdf = (url) => url.toLowerCase().endsWith('.pdf');

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !category) return;
    setUploading(true);
    try {
      await uploadToCategory(file, category);
      await load(); // refresh list
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
  }[maxCols] || 'grid-cols-2 sm:grid-cols-3';

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      {/* Header */}
      <div className={`flex items-center justify-between gap-3 bg-gradient-to-r ${meta.color} px-4 py-3`}>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-white/70">S3 Bucket</p>
          <h3 className="text-sm font-bold text-white">{displayTitle}</h3>
        </div>
        <div className="flex items-center gap-2">
          {allowUpload && category && (
            <>
              <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleUpload} />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/30 transition-all disabled:opacity-50"
              >
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                {uploading ? 'Uploading…' : 'Upload'}
              </button>
            </>
          )}
          <button onClick={load} title="Refresh" className="rounded-full bg-white/20 p-1.5 text-white hover:bg-white/30 transition-all">
            <RefreshCcw className="h-3.5 w-3.5" />
          </button>
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold text-white">
            {filtered.length} files
          </span>
        </div>
      </div>

      {/* Body */}
      <div className={compact ? 'p-2' : 'p-4'}>
        {loading && (
          <div className="flex flex-col items-center gap-3 py-10 text-text-muted">
            <Loader2 className="h-8 w-8 animate-spin text-accent-violet" />
            <p className="text-sm">Loading from S3…</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-danger">
            <ImageIcon className="h-8 w-8 opacity-50" />
            <p>{error}</p>
            <button onClick={load} className="mt-1 rounded-full bg-accent-violet/10 px-3 py-1 text-xs font-bold text-accent-violet hover:bg-accent-violet/20">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-10 text-center text-text-muted">
            <ImageIcon className="h-10 w-10 opacity-30" />
            <p className="text-sm font-medium">No files found</p>
            <p className="text-xs">
              {searchQuery ? `No match for "${searchQuery}"` : `Upload files to the S3 folder to see them here.`}
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className={`grid gap-2.5 ${gridClass}`}>
            {filtered.map((url, i) => (
              isPdf(url) ? (
                /* PDF tile */
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-surface-elevated p-4 text-center hover:border-accent-violet/40 transition-all group"
                >
                  <FileText className="h-8 w-8 text-accent-violet group-hover:scale-110 transition-transform" />
                  <p className="text-[11px] font-semibold text-text-secondary leading-tight line-clamp-2">
                    {decodeURIComponent(url.split('/').pop().replace(/[_-]/g, ' '))}
                  </p>
                  <span className="rounded-full bg-accent-violet/10 px-2 py-0.5 text-[10px] font-bold text-accent-violet">PDF</span>
                </a>
              ) : (
                /* Image tile */
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-xl border border-border bg-surface-elevated cursor-pointer"
                  onClick={() => setLightbox(url)}
                >
                  <img
                    src={url}
                    alt={`S3 image ${i + 1}`}
                    className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${compact ? 'h-24' : 'h-40'}`}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${i}/400/300`; }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                    <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-3xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
            >
              <X className="h-5 w-5" />
            </button>
            <img src={lightbox} alt="Full view" className="w-full rounded-2xl shadow-2xl" />
            <a
              href={lightbox}
              target="_blank"
              rel="noreferrer"
              download
              className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/30"
              onClick={(e) => e.stopPropagation()}
            >
              <Download className="h-3.5 w-3.5" /> Open
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
