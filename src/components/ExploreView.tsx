import React, { useState, useEffect } from 'react';
import { Search, Play, Heart, SlidersHorizontal, Disc, Plus, Check } from 'lucide-react';
import { Track, User, Playlist } from '../types';

interface ExploreViewProps {
  tracks: Track[];
  onPlayTrack: (track: Track) => void;
  currentUser: User | null;
  onToggleLike: (trackId: string) => void;
  playlists: Playlist[];
  onAddToPlaylist: (playlistId: string, trackId: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  tracks,
  onPlayTrack,
  currentUser,
  onToggleLike,
  playlists,
  onAddToPlaylist
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [genres, setGenres] = useState<string[]>(['All']);
  const [activeDropdownTrackId, setActiveDropdownTrackId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/genres')
      .then(res => res.json())
      .then(data => setGenres(data))
      .catch(err => console.error("Error loading genres:", err));
  }, []);

  const filteredTracks = tracks.filter(track => {
    const matchesSearch =
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.album.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || track.genre.toLowerCase() === selectedGenre.toLowerCase();
    return matchesSearch && matchesGenre;
  }).sort((a, b) => {
    if (sortBy === 'popular') return b.playCount - a.playCount;
    if (sortBy === 'likes') return b.likesCount - a.likesCount;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-8 pb-32">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Explore Music</h1>
          <p className="text-sm text-zinc-400 mt-1">Browse tracks by genre, artist, or keyword search.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search songs, artists, albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
      </div>

      {/* Genre Filter Pills & Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 sm:pb-0">
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedGenre === genre
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-zinc-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500"
          >
            <option value="newest">Newest Releases</option>
            <option value="popular">Most Played</option>
            <option value="likes">Most Liked</option>
          </select>
        </div>
      </div>

      {/* Tracks Grid */}
      {filteredTracks.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800">
          <Disc className="w-12 h-12 text-zinc-600 mx-auto mb-3 animate-spin" style={{ animationDuration: '10s' }} />
          <h3 className="text-lg font-semibold text-white">No tracks found</h3>
          <p className="text-sm text-zinc-400 mt-1">Try adjusting your search query or genre filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTracks.map(track => {
            const isLiked = currentUser && track.likedBy?.includes(currentUser.id);
            return (
              <div
                key={track.id}
                className="group bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 transition-all flex items-center justify-between gap-4 relative"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-950 flex-shrink-0">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <button
                      onClick={() => onPlayTrack(track)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                    >
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </button>
                  </div>
                  <div className="min-w-0">
                    <h4
                      className="font-semibold text-sm text-white truncate hover:underline cursor-pointer"
                      onClick={() => onPlayTrack(track)}
                    >
                      {track.title}
                    </h4>
                    <p className="text-xs text-zinc-400 truncate mt-0.5">{track.artist}</p>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-zinc-500">
                      <span className="bg-zinc-800 px-2 py-0.5 rounded text-violet-300 font-medium">{track.genre}</span>
                      <span>{track.playCount} plays</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {currentUser && (
                    <button
                      onClick={() => onToggleLike(track.id)}
                      className={`p-2 rounded-full transition-colors ${
                        isLiked ? 'text-red-500 bg-red-500/10' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                  )}

                  {currentUser && (
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdownTrackId(activeDropdownTrackId === track.id ? null : track.id)}
                        className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
                        title="Add to Playlist"
                      >
                        <Plus className="w-4 h-4" />
                      </button>

                      {activeDropdownTrackId === track.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl py-2 z-50">
                          <p className="px-3 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                            Add to Playlist
                          </p>
                          {playlists.filter(p => p.userId === currentUser.id).map(pl => (
                            <button
                              key={pl.id}
                              onClick={() => {
                                onAddToPlaylist(pl.id, track.id);
                                setActiveDropdownTrackId(null);
                              }}
                              className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 truncate flex items-center justify-between"
                            >
                              <span>{pl.name}</span>
                              {pl.trackIds.includes(track.id) && <Check className="w-3.5 h-3.5 text-violet-400" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
