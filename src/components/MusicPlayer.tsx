import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, Repeat, Shuffle, MessageSquare, Disc, ListMusic } from 'lucide-react';
import { Track, User } from '../types';

interface MusicPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentUser: User | null;
  onToggleLike: (trackId: string) => void;
  onOpenComments: (track: Track) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  currentUser,
  onToggleLike,
  onOpenComments
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const isLiked = currentTrack && currentUser && currentTrack.likedBy?.includes(currentUser.id);

  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-zinc-950 border-t border-zinc-800 text-zinc-500 px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <Disc className="w-6 h-6 text-zinc-700 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-400">No track selected</p>
            <p className="text-xs text-zinc-600">Choose a song from explore or home to start streaming</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/80 text-white px-6 flex items-center justify-between z-50 shadow-2xl">
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onNext}
      />

      {/* Left: Track Info */}
      <div className="flex items-center gap-4 w-1/4 min-w-[200px]">
        <div className="relative group w-14 h-14 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex-shrink-0 shadow-md">
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? 'scale-105' : ''}`}
          />
          {isPlaying && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
              <span className="flex gap-0.5 items-end h-4">
                <span className="w-1 bg-violet-400 animate-bounce h-3"></span>
                <span className="w-1 bg-violet-400 animate-bounce h-4" style={{ animationDelay: '0.15s' }}></span>
                <span className="w-1 bg-violet-400 animate-bounce h-2" style={{ animationDelay: '0.3s' }}></span>
              </span>
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold truncate text-zinc-100 hover:underline cursor-pointer">
            {currentTrack.title}
          </h4>
          <p className="text-xs text-zinc-400 truncate mt-0.5">{currentTrack.artist}</p>
        </div>
        {currentUser && (
          <button
            onClick={() => onToggleLike(currentTrack.id)}
            className={`p-2 rounded-full transition-colors ml-2 ${
              isLiked ? 'text-red-500 bg-red-500/10' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
            title={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        )}
        <button
          onClick={() => onOpenComments(currentTrack)}
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-full transition-colors ml-1"
          title="Comments & Discussion"
        >
          <MessageSquare className="w-4 h-4" />
        </button>
      </div>

      {/* Center: Controls & Seek Bar */}
      <div className="flex flex-col items-center gap-2 w-2/4 max-w-xl">
        <div className="flex items-center gap-5">
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`p-1.5 transition-colors ${isShuffle ? 'text-violet-400' : 'text-zinc-500 hover:text-zinc-300'}`}
            title="Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            onClick={onPrev}
            className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-full transition-colors"
            title="Previous Track"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button
            onClick={onTogglePlay}
            className="w-11 h-11 bg-white hover:bg-zinc-200 text-zinc-950 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>
          <button
            onClick={onNext}
            className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-full transition-colors"
            title="Next Track"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
          <button
            onClick={() => setIsRepeat(!isRepeat)}
            className={`p-1.5 transition-colors ${isRepeat ? 'text-violet-400' : 'text-zinc-500 hover:text-zinc-300'}`}
            title="Repeat"
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Seek Bar */}
        <div className="flex items-center gap-3 w-full text-xs text-zinc-400 font-medium">
          <span>{formatTime(currentTime)}</span>
          <div className="relative flex-1 group flex items-center h-4 cursor-pointer">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="absolute w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-violet-500 group-hover:h-2 transition-all"
            />
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Volume & Extra */}
      <div className="flex items-center gap-3 w-1/4 justify-end min-w-[180px]">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 text-zinc-400 hover:text-white transition-colors"
        >
          {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(Number(e.target.value));
            if (isMuted) setIsMuted(false);
          }}
          className="w-24 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
        />
      </div>
    </div>
  );
};
