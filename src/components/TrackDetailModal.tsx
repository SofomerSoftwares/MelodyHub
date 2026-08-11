import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Send, Heart, Play, Disc } from 'lucide-react';
import { Track, Comment, User } from '../types';

interface TrackDetailModalProps {
  track: Track;
  onClose: () => void;
  currentUser: User | null;
  onPlayTrack: (track: Track) => void;
}

export const TrackDetailModal: React.FC<TrackDetailModalProps> = ({
  track,
  onClose,
  currentUser,
  onPlayTrack
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState('');

  useEffect(() => {
    fetch(`/api/tracks/${track.id}/comments`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(err => console.error("Error fetching comments:", err));
  }, [track.id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !currentUser) return;

    try {
      const res = await fetch(`/api/tracks/${track.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          text: newCommentText
        })
      });
      const data = await res.json();
      if (res.ok) {
        setComments([data, ...comments]);
        setNewCommentText('');
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-xl shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-zinc-400 hover:text-white p-2 rounded-full hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Track Header */}
        <div className="flex items-center gap-5">
          <img
            src={track.coverUrl}
            alt={track.title}
            className="w-24 h-24 rounded-2xl object-cover shadow-xl border border-zinc-800"
          />
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-violet-400 uppercase tracking-wider">{track.genre}</span>
            <h2 className="text-2xl font-extrabold text-white">{track.title}</h2>
            <p className="text-sm text-zinc-300">By {track.artist} • <span className="text-zinc-500">{track.album}</span></p>
            <div className="flex items-center gap-4 pt-1 text-xs text-zinc-400 font-medium">
              <span>{track.playCount} plays</span>
              <span>{track.likesCount} likes</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onPlayTrack(track)}
          className="w-full bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <Play className="w-4 h-4 fill-current ml-0.5" />
          Play Track Now
        </button>

        {/* Comments Section */}
        <div className="space-y-4 pt-4 border-t border-zinc-800">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-bold text-white">Discussion & Comments ({comments.length})</h3>
          </div>

          {currentUser ? (
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Share your thoughts on this track..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500"
              />
              <button
                type="submit"
                className="bg-violet-600 hover:bg-violet-500 text-white px-5 rounded-xl font-semibold text-xs shadow transition-transform active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <p className="text-xs text-zinc-500 italic bg-zinc-950 p-3 rounded-xl text-center">
              Sign in to join the conversation and leave comments.
            </p>
          )}

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {comments.map(c => (
              <div key={c.id} className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={c.userAvatar} alt={c.userName} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-xs font-semibold text-white">{c.userName}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-zinc-300 pl-8">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
