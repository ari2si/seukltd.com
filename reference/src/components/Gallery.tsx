import { useEffect, useState, useCallback } from 'react';
import { Upload, X, Play, Trash2, Image as ImageIcon, Film } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Media } from '../lib/types';

export default function Gallery() {
  const [media, setMedia] = useState<Media[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Media | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const fetchMedia = useCallback(async () => {
    const { data } = await supabase
      .from('media')
      .select('*')
      .eq('section', 'gallery')
      .order('sort_order', { ascending: true });
    if (data) setMedia(data);
  }, []);

  useEffect(() => {
    fetchMedia();

    supabase.auth.getSession().then(({ data }) => {
      setIsAdmin(!!data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session);
    });

    return () => listener.subscription.unsubscribe();
  }, [fetchMedia]);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      const isVideo = file.type.startsWith('video/');
      const ext = file.name.split('.').pop();
      const path = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(path, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        continue;
      }

      const { data: urlData } = supabase.storage.from('media').getPublicUrl(path);
      const url = urlData.publicUrl;

      await supabase.from('media').insert({
        url,
        type: isVideo ? 'video' : 'image',
        section: 'gallery',
        caption: file.name.replace(/\.[^/.]+$/, ''),
      });
    }
    await fetchMedia();
    setUploading(false);
  };

  const handleDelete = async (item: Media) => {
    const path = item.url.split('/media/')[1];
    if (path) await supabase.storage.from('media').remove([`gallery/${path.split('/').pop()}`]);
    await supabase.from('media').delete().eq('id', item.id);
    setMedia((prev) => prev.filter((m) => m.id !== item.id));
    if (selectedImage?.id === item.id) setSelectedImage(null);
  };

  const images = media.filter((m) => m.type === 'image');
  const videos = media.filter((m) => m.type === 'video');

  return (
    <section id="gallery" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-50 border border-gold-200 rounded-full mb-6">
              <div className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
              <span className="text-gold-700 text-sm font-medium">Gallery</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight">
              Media
              <span className="text-gold-500"> Gallery</span>
            </h2>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="flex items-center gap-2 px-6 py-3 bg-gold-500 text-slate-900 font-semibold rounded-xl hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/20"
            >
              <Upload className="w-5 h-5" />
              Upload Media
            </button>
          )}
        </div>

        {/* Upload area */}
        {isAdmin && showUpload && (
          <div className="mb-12 p-8 bg-white rounded-2xl border-2 border-dashed border-gold-200 hover:border-gold-400 transition-colors">
            <label className="flex flex-col items-center justify-center cursor-pointer">
              <div className="w-16 h-16 bg-gold-50 rounded-2xl flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-gold-500" />
              </div>
              <span className="text-lg font-semibold text-slate-900 mb-1">
                {uploading ? 'Uploading...' : 'Drop files here or click to upload'}
              </span>
              <span className="text-sm text-slate-500">
                Supports images (JPG, PNG, WebP) and videos (MP4, WebM) up to 50MB
              </span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                className="hidden"
                onChange={(e) => e.target.files && handleUpload(e.target.files)}
                disabled={uploading}
              />
            </label>
          </div>
        )}

        {/* Videos section */}
        {videos.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Film className="w-5 h-5 text-gold-500" />
              <h3 className="text-2xl font-bold text-slate-900">Videos</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((item) => (
                <div key={item.id} className="relative group rounded-2xl overflow-hidden bg-slate-900">
                  <video
                    src={item.url}
                    className="w-full h-56 object-cover"
                    controls
                    preload="metadata"
                  />
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(item)}
                      className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Images section */}
        {images.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <ImageIcon className="w-5 h-5 text-gold-500" />
              <h3 className="text-2xl font-bold text-slate-900">Images</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((item) => (
                <div
                  key={item.id}
                  className="relative group cursor-pointer rounded-xl overflow-hidden aspect-square"
                  onClick={() => setSelectedImage(item)}
                >
                  <img
                    src={item.url}
                    alt={item.caption}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {media.length === 0 && (
          <div className="text-center py-20">
            <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No media uploaded yet.</p>
            {isAdmin && (
              <p className="text-slate-400 text-sm mt-2">
                Click "Upload Media" to add images and videos.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          {selectedImage.type === 'video' ? (
            <video
              src={selectedImage.url}
              controls
              autoPlay
              className="max-w-5xl max-h-[85vh] rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={selectedImage.url}
              alt={selectedImage.caption}
              className="max-w-5xl max-h-[85vh] rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </section>
  );
}
