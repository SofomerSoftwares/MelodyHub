import React, { useState } from 'react';
import { Sparkles, X, Play, Music, Wand2 } from 'lucide-react';
import { Track } from '../types';

interface AIPlaylistModalProps {
  onClose: () => void;
  tracks: Track[];
  onPlayTrack: (track: Track) => void;
  onCreatePlaylistFromAI: (name: string, trackIds: string[]) => void;
}

export const AIPlaylistModal: React.FC<AIPlaylistModalProps> = ({
  onClose,
  tracks,
  onPlayTrack,
  onCreatePlaylistFromAI
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedTrackIds, setGeneratedTrackIds] = useState<string[]>([]);
  const [playlistName, setPlaylistName] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/ai/playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate playlist');
      setGeneratedTrackIds(data.trackIds || []);
      setPlaylistName(`AI Mix: ${prompt.slice(0, 30)}...`);
    } catch (err: any) {
      setError(err.message || 'AI generation failed');
    } finally {
      setLoading(false);
    }
  };

  const generatedTracks = tracks.filter(t => generatedTrackIds.includes(t.id));

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-xl shadow-2xl relative space-y-6">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-zinc-400 hover:text-white p-2 rounded-full hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI Playlist DJ</h2>
            <p className="text-xs text-zinc-400">Describe your mood, activity, or favorite genre to instantly curate a custom mix.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1">What vibe are you looking for?</label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="e.g. Late night lofi beats for coding with rainy atmosphere..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-6 rounded-xl font-bold text-xs shadow-lg shadow-violet-600/30 flex items-center gap-2 transition-transform active:scale-95"
              >
                <Wand2 className="w-4 h-4" />
                {loading ? 'Curating...' : 'Generate'}
              </button>
            </div>
          </div>
        </form>

        {generatedTracks.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Curated Tracks ({generatedTracks.length})</h3>
              <button
                onClick={() => {
                  onCreatePlaylistFromAI(playlistName, generatedTrackIds);
                  onClose();
                }}
                className="bg-zinc-800 hover:bg-zinc-700 text-violet-300 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
              >
                Save as Playlist
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {generatedTracks.map(track => (
                <div
                  key={track.id}
                  className="group bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={track.coverUrl} alt={track.title} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="font-semibold text-xs text-white truncate">{track.title}</p>
                      <p className="text-[11px] text-zinc-400 truncate">{track.artist}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onPlayTrack(track)}
                    className="p-2 bg-violet-600 text-white rounded-full hover:scale-105 transition-transform"
                  >
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
