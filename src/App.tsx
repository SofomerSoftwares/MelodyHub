import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MusicPlayer } from './components/MusicPlayer';
import { HomeView } from './components/HomeView';
import { ExploreView } from './components/ExploreView';
import { PlaylistView } from './components/PlaylistView';
import { LibraryView } from './components/LibraryView';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { AIPlaylistModal } from './components/AIPlaylistModal';
import { TrackUploadModal } from './components/TrackUploadModal';
import { TrackDetailModal } from './components/TrackDetailModal';
import { Track, Playlist, User } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('melodyhub_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  // Modals
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [commentTrack, setCommentTrack] = useState<Track | null>(null);

  const fetchTracks = () => {
    fetch('/api/tracks')
      .then(res => res.json())
      .then(data => setTracks(data))
      .catch(err => console.error("Error loading tracks:", err));
  };

  const fetchPlaylists = () => {
    fetch('/api/playlists')
      .then(res => res.json())
      .then(data => setPlaylists(data))
      .catch(err => console.error("Error loading playlists:", err));
  };

  useEffect(() => {
    fetchTracks();
    fetchPlaylists();
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('melodyhub_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('melodyhub_user');
    }
  }, [currentUser]);

  const handlePlayTrack = async (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    // Increment play count
    try {
      await fetch(`/api/tracks/${track.id}/play`, { method: 'POST' });
      fetchTracks();
    } catch (err) {
      console.error("Error recording play:", err);
    }
  };

  const handleToggleLike = async (trackId: string) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    try {
      const res = await fetch(`/api/tracks/${trackId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      });
      if (res.ok) {
        fetchTracks();
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleNextTrack = () => {
    if (!currentTrack || tracks.length === 0) return;
    const idx = tracks.findIndex(t => t.id === currentTrack.id);
    const nextIdx = (idx + 1) % tracks.length;
    handlePlayTrack(tracks[nextIdx]);
  };

  const handlePrevTrack = () => {
    if (!currentTrack || tracks.length === 0) return;
    const idx = tracks.findIndex(t => t.id === currentTrack.id);
    const prevIdx = (idx - 1 + tracks.length) % tracks.length;
    handlePlayTrack(tracks[prevIdx]);
  };

  const handleCreatePlaylist = async (name: string, description: string, coverUrl: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          userId: currentUser.id,
          userName: currentUser.name,
          coverUrl,
          isPublic: true
        })
      });
      if (res.ok) {
        fetchPlaylists();
      }
    } catch (err) {
      console.error("Error creating playlist:", err);
    }
  };

  const handleAddToPlaylist = async (playlistId: string, trackId: string) => {
    try {
      const res = await fetch(`/api/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackId })
      });
      if (res.ok) {
        fetchPlaylists();
      }
    } catch (err) {
      console.error("Error adding to playlist:", err);
    }
  };

  const handleRemoveTrackFromPlaylist = async (playlistId: string, trackId: string) => {
    try {
      const res = await fetch(`/api/playlists/${playlistId}/tracks/${trackId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchPlaylists();
      }
    } catch (err) {
      console.error("Error removing track:", err);
    }
  };

  const handleDeleteTrack = async (id: string) => {
    if (!confirm("Are you sure you want to delete this track?")) return;
    try {
      const res = await fetch(`/api/tracks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchTracks();
      }
    } catch (err) {
      console.error("Error deleting track:", err);
    }
  };

  const handleCreatePlaylistFromAI = async (name: string, trackIds: string[]) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description: "Curated automatically by MelodyHub AI DJ.",
          userId: currentUser.id,
          userName: currentUser.name,
          coverUrl: tracks[0]?.coverUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
          isPublic: true
        })
      });
      const newPl = await res.json();
      if (res.ok && newPl.id) {
        for (const tid of trackIds) {
          await handleAddToPlaylist(newPl.id, tid);
        }
        setCurrentView('playlists');
      }
    } catch (err) {
      console.error("Error saving AI playlist:", err);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-violet-500 selection:text-white flex flex-col">
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          setSelectedPlaylist(null);
          setCurrentView(view);
        }}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={() => setCurrentUser(null)}
        onOpenAIPlaylist={() => setShowAIModal(true)}
        onOpenUpload={() => setShowUploadModal(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-8">
        {currentView === 'home' && (
          <HomeView
            tracks={tracks}
            playlists={playlists}
            onPlayTrack={handlePlayTrack}
            onOpenAIPlaylist={() => setShowAIModal(true)}
            setCurrentView={setCurrentView}
            onSelectPlaylist={(pl) => {
              setSelectedPlaylist(pl);
              setCurrentView('playlists');
            }}
            currentUser={currentUser}
            onToggleLike={handleToggleLike}
          />
        )}

        {currentView === 'explore' && (
          <ExploreView
            tracks={tracks}
            onPlayTrack={handlePlayTrack}
            currentUser={currentUser}
            onToggleLike={handleToggleLike}
            playlists={playlists}
            onAddToPlaylist={handleAddToPlaylist}
          />
        )}

        {currentView === 'playlists' && (
          <PlaylistView
            playlists={playlists}
            tracks={tracks}
            currentUser={currentUser}
            onCreatePlaylist={handleCreatePlaylist}
            onDeletePlaylist={(id) => {}}
            onRemoveTrackFromPlaylist={handleRemoveTrackFromPlaylist}
            onPlayTrack={handlePlayTrack}
            selectedPlaylist={selectedPlaylist}
            onSelectPlaylist={setSelectedPlaylist}
          />
        )}

        {currentView === 'library' && (
          <LibraryView
            tracks={tracks}
            playlists={playlists}
            currentUser={currentUser}
            onPlayTrack={handlePlayTrack}
            onToggleLike={handleToggleLike}
            onSelectPlaylist={(pl) => {
              setSelectedPlaylist(pl);
              setCurrentView('playlists');
            }}
            onOpenAuth={() => setShowAuthModal(true)}
          />
        )}

        {currentView === 'admin' && currentUser?.role === 'admin' && (
          <AdminDashboard
            tracks={tracks}
            onDeleteTrack={handleDeleteTrack}
            onRefreshTracks={fetchTracks}
            onOpenUploadModal={() => setShowUploadModal(true)}
          />
        )}
      </main>

      {/* Persistent Audio Player */}
      <MusicPlayer
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onNext={handleNextTrack}
        onPrev={handlePrevTrack}
        currentUser={currentUser}
        onToggleLike={handleToggleLike}
        onOpenComments={(track) => setCommentTrack(track)}
      />

      {/* Modals */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={(user) => setCurrentUser(user)}
        />
      )}

      {showAIModal && (
        <AIPlaylistModal
          onClose={() => setShowAIModal(false)}
          tracks={tracks}
          onPlayTrack={handlePlayTrack}
          onCreatePlaylistFromAI={handleCreatePlaylistFromAI}
        />
      )}

      {showUploadModal && (
        <TrackUploadModal
          onClose={() => setShowUploadModal(false)}
          onTrackUploaded={fetchTracks}
        />
      )}

      {commentTrack && (
        <TrackDetailModal
          track={commentTrack}
          onClose={() => setCommentTrack(null)}
          currentUser={currentUser}
          onPlayTrack={handlePlayTrack}
        />
      )}
    </div>
  );
}
