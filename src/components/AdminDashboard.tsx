import React, { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, Edit2, BarChart3, Users, Disc, Play, CheckCircle } from 'lucide-react';
import { Track, User, AdminStats } from '../types';

interface AdminDashboardProps {
  tracks: Track[];
  onDeleteTrack: (id: string) => void;
  onRefreshTracks: () => void;
  onOpenUploadModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  tracks,
  onDeleteTrack,
  onRefreshTracks,
  onOpenUploadModal
}) => {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Error fetching stats:", err));
  }, [tracks]);

  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900 p-8 rounded-3xl border border-amber-500/20">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            Admin Control Center
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-2">Platform Management</h1>
          <p className="text-sm text-zinc-400 mt-1">Monitor analytics, manage tracks, and upload new audio content.</p>
        </div>
        <button
          onClick={onOpenUploadModal}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-full font-bold text-xs shadow-lg shadow-amber-600/20 transition-transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          Upload New Track
        </button>
      </div>

      {/* Analytics Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Plays</span>
              <BarChart3 className="w-5 h-5 text-violet-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.totalPlays.toLocaleString()}</p>
            <p className="text-xs text-zinc-500">Across all platform tracks</p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Tracks</span>
              <Disc className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.totalTracks}</p>
            <p className="text-xs text-zinc-500">Active streaming items</p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Playlists</span>
              <BarChart3 className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.totalPlaylists}</p>
            <p className="text-xs text-zinc-500">User & admin playlists</p>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Registered Users</span>
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.totalUsers}</p>
            <p className="text-xs text-zinc-500">Active community members</p>
          </div>
        </div>
      )}

      {/* Tracks Management Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight">Track Inventory Management</h2>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-900 border-b border-zinc-800 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Track</th>
                  <th className="px-6 py-4">Genre</th>
                  <th className="px-6 py-4">Plays</th>
                  <th className="px-6 py-4">Likes</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {tracks.map(track => (
                  <tr key={track.id} className="hover:bg-zinc-900/80 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img src={track.coverUrl} alt={track.title} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-semibold text-white">{track.title}</p>
                        <p className="text-xs text-zinc-400">{track.artist}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-violet-300 text-xs font-medium">
                        {track.genre}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{track.playCount}</td>
                    <td className="px-6 py-4 font-mono text-xs">{track.likesCount}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onDeleteTrack(track.id)}
                        className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                        title="Delete Track"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
