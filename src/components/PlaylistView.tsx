import React, { useState } from 'react';
import { ListMusic, Plus, Play, Trash2, Music, Globe, Lock, ArrowLeft } from 'lucide-react';
import { Playlist, Track, User } from '../types';

interface PlaylistViewProps {
  playlists: Playlist[];
  tracks: Track[];
  currentUser: User | null;
  onCreatePlaylist: (name: string, description: string, coverUrl: string) => void;
  onDeletePlaylist: (id: string) => void;
  onRemoveTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  onPlayTrack: (track: Track) => void;
  selectedPlaylist: Playlist | null;
  onSelectPlaylist: (playlist: Playlist | null) => void;
}

export const PlaylistView: React.FC<PlaylistViewProps> = ({
  playlists,
  tracks,
  currentUser,
  onCreatePlaylist,
  onDeletePlaylist,
  onRemoveTrackFromPlaylist,
  onPlayTrack,
  selectedPlaylist,
  onSelectPlaylist
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCover, setNewCover] = useState('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onCreatePlaylist(newName, newDesc, newCover);
    setNewName('');
    setNewDesc('');
    setShowCreateModal(false);
  };

  if (selectedPlaylist) {
    const playlistTracks = tracks.filter(t => selectedPlaylist.trackIds.includes(t.id));

    return (
      <div className="space-y-8 pb-32">
        <button
          onClick={() => onSelectPlaylist(null)}
          className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Playlists
        </button>

        {/* Playlist Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 bg-gradient-to-r from-violet-950/60 to-zinc-900 p-8 rounded-3xl border border-zinc-800">
          <img
            src={selectedPlaylist.coverUrl}
            alt={selectedPlaylist.name}
            className="w-40 h-40 rounded-2xl object-cover shadow-2xl border border-zinc-800"
          />
          <div className="space-y-2">
            <span className="text-xs font-bold text-violet-400 uppercase tracking-wider flex items-center gap-1.5">
              {selectedPlaylist.isPublic ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              Playlist • Created by {selectedPlaylist.userName}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{selectedPlaylist.name}</h1>
            <p className="text-sm text-zinc-300 max-w-xl">{selectedPlaylist.description || "No description provided."}</p>
            <p className="text-xs text-zinc-500">{playlistTracks.length} tracks</p>
          </div>
        </div>

        {/* Playlist Tracks Table */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white tracking-tight">Songs in Playlist</h3>
          {playlistTracks.length === 0 ? (
            <div className="text-center py-16 bg-zinc-900/30 rounded-2xl border border-zinc-800">
              <Music className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-zinc-400">This playlist is empty.</p>
              <p className="text-xs text-zinc-600 mt-1">Explore tracks and click the plus button to add songs here.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {playlistTracks.map((track, idx) => (
                <div
                  key={track.id}
                  className="group bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-xs font-semibold text-zinc-500 w-6 text-center">{idx + 1}</span>
                    <img src={track.coverUrl} alt={track.title} className="w-12 h-12 rounded-lg object-cover" />
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
                    {currentUser && selectedPlaylist.userId === currentUser.id && (
                      <button
                        onClick={() => onRemoveTrackFromPlaylist(selectedPlaylist.id, track.id)}
                        className="p-2 text-zinc-500 hover:text-red-400 rounded-full hover:bg-zinc-800 transition-colors"
                        title="Remove from Playlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Playlists</h1>
          <p className="text-sm text-zinc-400 mt-1">Discover community playlists or create your own custom mixes.</p>
        </div>
        {currentUser && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-full font-bold text-xs shadow-lg shadow-violet-600/20 transition-transform hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Create Playlist
          </button>
        )}
      </div>

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {playlists.map(playlist => (
          <div
            key={playlist.id}
            onClick={() => onSelectPlaylist(playlist)}
            className="group bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-violet-500/50 rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-zinc-950">
                <img
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md p-1.5 rounded-full text-zinc-300">
                  {playlist.isPublic ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                </div>
              </div>
              <h3 className="font-semibold text-base text-white truncate group-hover:text-violet-400 transition-colors">
                {playlist.name}
              </h3>
              <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{playlist.description}</p>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800/60 text-xs text-zinc-500">
              <span>{playlist.trackIds.length} tracks</span>
              <span>By {playlist.userName}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-white">Create New Playlist</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Playlist Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Morning Acoustic"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Description</label>
                <textarea
                  placeholder="What's this playlist about?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 resize-none h-20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={newCover}
                  onChange={(e) => setNewCover(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-lg transition-transform hover:scale-105"
                >
                  Create Playlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
