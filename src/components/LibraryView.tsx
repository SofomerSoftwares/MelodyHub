import React, { useState } from 'react';
import { Heart, ListMusic, Play, Disc, Music } from 'lucide-react';
import { Track, Playlist, User } from '../types';

interface LibraryViewProps {
  tracks: Track[];
  playlists: Playlist[];
  currentUser: User | null;
  onPlayTrack: (track: Track) => void;
  onToggleLike: (trackId: string) => void;
  onSelectPlaylist: (playlist: Playlist) => void;
  onOpenAuth: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  tracks,
  playlists,
  currentUser,
  onPlayTrack,
  onToggleLike,
  onSelectPlaylist,
  onOpenAuth
}) => {
  const [activeTab, setActiveTab] = useState<'liked' | 'playlists'>('liked');

  if (!currentUser) {
    return (
      <div className="text-center py-24 space-y-4 bg-zinc-900/30 rounded-3xl border border-zinc-800">
        <Music className="w-16 h-16 text-violet-500 mx-auto opacity-80" />
        <h2 className="text-2xl font-bold text-white">Your Personal Library</h2>
        <p className="text-sm text-zinc-400 max-w-md mx-auto">
          Sign in to access your liked songs, custom playlists, and listening history.
        </p>
        <button
          onClick={onOpenAuth}
          className="bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-full font-semibold text-xs shadow-lg transition-transform hover:scale-105"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const likedTracks = tracks.filter(t => t.likedBy?.includes(currentUser.id));
  const myPlaylists = playlists.filter(p => p.userId === currentUser.id);

  return (
    <div className="space-y-8 pb-32">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Library</h1>
        <p className="text-sm text-zinc-400 mt-1">Manage your favorite tracks and personal collections.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
        <button
          onClick={() => setActiveTab('liked')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === 'liked'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Heart className="w-4 h-4 fill-current" />
          Liked Songs ({likedTracks.length})
        </button>
        <button
          onClick={() => setActiveTab('playlists')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeTab === 'playlists'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <ListMusic className="w-4 h-4" />
          My Playlists ({myPlaylists.length})
        </button>
      </div>

      {activeTab === 'liked' ? (
        likedTracks.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800">
            <Heart className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">No liked songs yet</h3>
            <p className="text-xs text-zinc-400 mt-1">Click the heart icon on any song to add it to your favorites.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {likedTracks.map(track => (
              <div
                key={track.id}
                className="group bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-zinc-950 flex-shrink-0">
                    <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
                    <button
                      onClick={() => onPlayTrack(track)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </button>
                  </div>
                  <div className="min-w-0">
                    <h4
                      className="font-semibold text-sm text-white truncate hover:underline cursor-pointer"
                      onClick={() => onPlayTrack(track)}
                    >
                      {track.title}
                    </h4>
                    <p className="text-xs text-zinc-400 truncate">{track.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onPlayTrack(track)}
                    className="p-2 bg-violet-600 hover:bg-violet-500 text-white rounded-full shadow transition-transform hover:scale-105"
                  >
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </button>
                  <button
                    onClick={() => onToggleLike(track.id)}
                    className="p-2 text-red-500 hover:bg-zinc-800 rounded-full transition-colors"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        myPlaylists.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800">
            <ListMusic className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">No playlists created</h3>
            <p className="text-xs text-zinc-400 mt-1">Go to Playlists view to create your first playlist.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {myPlaylists.map(playlist => (
              <div
                key={playlist.id}
                onClick={() => onSelectPlaylist(playlist)}
                className="group bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-violet-500/50 rounded-2xl p-4 cursor-pointer transition-all"
              >
                <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-zinc-950">
                  <img src={playlist.coverUrl} alt={playlist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <h3 className="font-semibold text-base text-white truncate group-hover:text-violet-400 transition-colors">{playlist.name}</h3>
                <p className="text-xs text-zinc-400 mt-1">{playlist.trackIds.length} tracks</p>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};
