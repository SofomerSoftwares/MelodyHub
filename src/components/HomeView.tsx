import React from 'react';
import { Play, Sparkles, Flame, TrendingUp, Music, Heart, Plus, Compass } from 'lucide-react';
import { Track, Playlist, User } from '../types';

interface HomeViewProps {
  tracks: Track[];
  playlists: Playlist[];
  onPlayTrack: (track: Track) => void;
  onOpenAIPlaylist: () => void;
  setCurrentView: (view: string) => void;
  onSelectPlaylist: (playlist: Playlist) => void;
  currentUser: User | null;
  onToggleLike: (trackId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  tracks,
  playlists,
  onPlayTrack,
  onOpenAIPlaylist,
  setCurrentView,
  onSelectPlaylist,
  currentUser,
  onToggleLike
}) => {
  const topTracks = [...tracks].sort((a, b) => b.playCount - a.playCount).slice(0, 4);
  const recentTracks = [...tracks].slice(0, 6);

  return (
    <div className="space-y-10 pb-32">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-900/80 via-indigo-900/60 to-zinc-900 border border-violet-500/20 p-8 md:p-12 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            AI-Powered Music Streaming & DJ
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Immerse in the Sound of Tomorrow.
          </h1>
          <p className="text-sm md:text-base text-zinc-300">
            Discover curated tracks, lossless streaming, custom playlists, and AI-generated mood mixes crafted instantly for you.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            {tracks.length > 0 && (
              <button
                onClick={() => onPlayTrack(tracks[0])}
                className="flex items-center gap-2 bg-white text-zinc-950 px-6 py-3 rounded-full font-bold text-sm shadow-xl hover:bg-zinc-200 transition-transform hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                Listen Now
              </button>
            )}
            <button
              onClick={onOpenAIPlaylist}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg shadow-violet-600/30 transition-transform hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              Generate AI Playlist
            </button>
            <button
              onClick={() => setCurrentView('explore')}
              className="flex items-center gap-2 bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-700 px-6 py-3 rounded-full font-semibold text-sm transition-all"
            >
              <Compass className="w-4 h-4" />
              Explore All
            </button>
          </div>
        </div>
      </div>

      {/* Trending / Top Played Tracks */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-white tracking-tight">Trending Right Now</h2>
          </div>
          <button
            onClick={() => setCurrentView('explore')}
            className="text-xs font-semibold text-violet-400 hover:text-violet-350 transition-colors"
          >
            See All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topTracks.map((track) => {
            const isLiked = currentUser && track.likedBy?.includes(currentUser.id);
            return (
              <div
                key={track.id}
                className="group relative bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-3 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-zinc-950">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => onPlayTrack(track)}
                      className="w-12 h-12 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </button>
                  </div>
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-violet-300">
                    {track.genre}
                  </span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm text-white truncate cursor-pointer hover:underline" onClick={() => onPlayTrack(track)}>
                    {track.title}
                  </h3>
                  <p className="text-xs text-zinc-400 truncate">{track.artist}</p>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-zinc-800/60 text-xs text-zinc-500">
                  <span>{track.playCount.toLocaleString()} plays</span>
                  {currentUser && (
                    <button
                      onClick={() => onToggleLike(track.id)}
                      className={`hover:text-red-500 transition-colors ${isLiked ? 'text-red-500' : ''}`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular Playlists */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-violet-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Featured Playlists</h2>
          </div>
          <button
            onClick={() => setCurrentView('playlists')}
            className="text-xs font-semibold text-violet-400 hover:text-violet-350 transition-colors"
          >
            View Playlists
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => onSelectPlaylist(playlist)}
              className="group bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-violet-500/40 rounded-2xl p-4 cursor-pointer transition-all flex gap-4 items-center"
            >
              <img
                src={playlist.coverUrl}
                alt={playlist.name}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="min-w-0">
                <h3 className="font-semibold text-base text-white truncate group-hover:text-violet-400 transition-colors">
                  {playlist.name}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{playlist.description}</p>
                <span className="inline-block text-[11px] text-zinc-500 mt-2">
                  {playlist.trackIds.length} tracks • By {playlist.userName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* New Releases Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">New Releases</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {recentTracks.map((track) => (
            <div
              key={track.id}
              onClick={() => onPlayTrack(track)}
              className="group bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-3 cursor-pointer transition-all"
            >
              <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-zinc-950 relative">
                <img
                  src={track.coverUrl}
                  alt={track.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-8 h-8 text-white fill-current" />
                </div>
              </div>
              <h4 className="font-medium text-xs text-white truncate">{track.title}</h4>
              <p className="text-[11px] text-zinc-400 truncate mt-0.5">{track.artist}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
