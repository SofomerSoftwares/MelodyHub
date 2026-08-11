export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  avatar: string;
  token?: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: number; // in seconds
  coverUrl: string;
  audioUrl: string;
  playCount: number;
  likesCount: number;
  createdAt: string;
  likedBy?: string[]; // user IDs who liked
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  userId: string;
  userName: string;
  trackIds: string[];
  coverUrl: string;
  isPublic: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  trackId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
}

export interface Artist {
  id: string;
  name: string;
  bio: string;
  image: string;
  genre: string;
  followersCount: number;
}

export interface AdminStats {
  totalPlays: number;
  totalUsers: number;
  totalTracks: number;
  totalPlaylists: number;
  recentUploads: Track[];
}
