import React, { useState } from 'react';
import { Music, Search, Library, Compass, ListMusic, Shield, User as UserIcon, LogOut, Sparkles, PlusCircle } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenAIPlaylist: () => void;
  onOpenUpload: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenAIPlaylist,
  onOpenUpload
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 text-white px-6 py-4 flex items-center justify-between">
      {/* Brand Logo */}
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => setCurrentView('home')}
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
          <Music className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            MelodyHub
          </span>
          <span className="block text-[10px] text-violet-400 font-medium tracking-widest uppercase">
            Streaming & DJ
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="hidden md:flex items-center gap-1 bg-zinc-900/80 p-1.5 rounded-full border border-zinc-800/80">
        <button
          onClick={() => setCurrentView('home')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            currentView === 'home' 
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30' 
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
          }`}
        >
          <Music className="w-4 h-4" />
          Home
        </button>
        <button
          onClick={() => setCurrentView('explore')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            currentView === 'explore' 
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30' 
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
          }`}
        >
          <Compass className="w-4 h-4" />
          Explore
        </button>
        <button
          onClick={() => setCurrentView('playlists')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            currentView === 'playlists' 
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30' 
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
          }`}
        >
          <ListMusic className="w-4 h-4" />
          Playlists
        </button>
        <button
          onClick={() => setCurrentView('library')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            currentView === 'library' 
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30' 
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
          }`}
        >
          <Library className="w-4 h-4" />
          Library
        </button>
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setCurrentView('admin')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              currentView === 'admin' 
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30' 
                : 'text-amber-400 hover:text-amber-300 hover:bg-zinc-800/50'
            }`}
          >
            <Shield className="w-4 h-4" />
            Admin
          </button>
        )}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* AI DJ Playlist Generator Button */}
        <button
          onClick={onOpenAIPlaylist}
          className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/30 hover:border-violet-500 px-3.5 py-2 rounded-full text-xs font-semibold text-violet-300 hover:text-white transition-all shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
          AI Playlist DJ
        </button>

        {currentUser?.role === 'admin' && (
          <button
            onClick={onOpenUpload}
            className="hidden sm:flex items-center gap-1.5 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 px-3 py-2 rounded-full text-xs font-medium text-zinc-200 hover:text-white transition-all"
          >
            <PlusCircle className="w-4 h-4 text-violet-400" />
            Upload Track
          </button>
        )}

        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-1.5 pr-3 rounded-full transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-violet-500/40"
              />
              <span className="text-xs font-medium max-w-[100px] truncate">
                {currentUser.name}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                currentUser.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-violet-500/20 text-violet-400'
              }`}>
                {currentUser.role}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-zinc-800">
                  <p className="text-xs text-zinc-400">Signed in as</p>
                  <p className="text-sm font-medium truncate">{currentUser.email}</p>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-zinc-800/80 flex items-center gap-2 mt-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg shadow-violet-600/20 transition-all"
          >
            <UserIcon className="w-3.5 h-3.5" />
            Sign In / Register
          </button>
        )}
      </div>
    </header>
  );
};
