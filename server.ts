import express from "express";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// MongoDB Atlas Connection Setup
let isMongoConnected = false;
let dbMode = "Local JSON File Storage";

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      isMongoConnected = true;
      dbMode = "MongoDB Atlas";
      console.log("Connected to MongoDB Atlas successfully!");
      seedMongoIfNeeded();
    })
    .catch((err) => {
      console.error("MongoDB Atlas connection error:", err.message);
      dbMode = "Local JSON File Storage (Atlas error)";
    });
}

// Mongoose Schemas & Models
const userSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: String,
  email: { type: String, unique: true, required: true },
  role: String,
  avatar: String
});

const trackSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  title: String,
  artist: String,
  album: String,
  genre: String,
  duration: Number,
  coverUrl: String,
  audioUrl: String,
  playCount: { type: Number, default: 0 },
  likesCount: { type: Number, default: 0 },
  createdAt: String,
  likedBy: [String]
});

const playlistSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: String,
  description: String,
  userId: String,
  userName: String,
  trackIds: [String],
  coverUrl: String,
  isPublic: Boolean,
  createdAt: String
});

const commentSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  trackId: String,
  userId: String,
  userName: String,
  userAvatar: String,
  text: String,
  createdAt: String
});

const artistSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: String,
  bio: String,
  image: String,
  genre: String,
  followersCount: Number
});

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
const TrackModel = mongoose.models.Track || mongoose.model("Track", trackSchema);
const PlaylistModel = mongoose.models.Playlist || mongoose.model("Playlist", playlistSchema);
const CommentModel = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
const ArtistModel = mongoose.models.Artist || mongoose.model("Artist", artistSchema);

// Database file path for fallback
const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Seed Data
const initialData = {
  users: [
    {
      id: "usr_admin",
      name: "Admin Maestro",
      email: "admin@melodyhub.com",
      role: "admin",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "usr_user1",
      name: "Aria Melody",
      email: "aria@melodyhub.com",
      role: "user",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "usr_user2",
      name: "Julian Beats",
      email: "julian@melodyhub.com",
      role: "user",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    }
  ],
  tracks: [
    {
      id: "trk_1",
      title: "Midnight Tokyo Lofi",
      artist: "Neko Beats",
      album: "Neon Rain",
      genre: "Lo-Fi",
      duration: 184,
      coverUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      playCount: 1420,
      likesCount: 389,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      likedBy: ["usr_user1", "usr_user2"]
    },
    {
      id: "trk_2",
      title: "Electric Horizon",
      artist: "Synthwave Pioneers",
      album: "Cyber Odyssey",
      genre: "Electronic",
      duration: 215,
      coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      playCount: 2310,
      likesCount: 612,
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      likedBy: ["usr_admin", "usr_user1"]
    },
    {
      id: "trk_3",
      title: "Acoustic Sunset",
      artist: "Clara Woods",
      album: "Unplugged Sessions",
      genre: "Acoustic",
      duration: 198,
      coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      playCount: 980,
      likesCount: 245,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      likedBy: ["usr_user2"]
    },
    {
      id: "trk_4",
      title: "Velvet Jazz Cafe",
      artist: "The Blue Notes",
      album: "After Hours",
      genre: "Jazz",
      duration: 245,
      coverUrl: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=500&auto=format&fit=crop&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      playCount: 1750,
      likesCount: 489,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      likedBy: ["usr_admin", "usr_user2"]
    },
    {
      id: "trk_5",
      title: "Cosmic Nebula",
      artist: "Stellar Echoes",
      album: "Beyond Dimensions",
      genre: "Ambient",
      duration: 310,
      coverUrl: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=500&auto=format&fit=crop&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      playCount: 890,
      likesCount: 310,
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      likedBy: ["usr_user1"]
    },
    {
      id: "trk_6",
      title: "Urban Rhythm",
      artist: "Metro Groove",
      album: "City Lights",
      genre: "Hip-Hop",
      duration: 172,
      coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
      playCount: 3040,
      likesCount: 920,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      likedBy: ["usr_admin", "usr_user1", "usr_user2"]
    }
  ],
  playlists: [
    {
      id: "pl_1",
      name: "Late Night Chill",
      description: "Smooth lofi and ambient tunes for coding and relaxing.",
      userId: "usr_admin",
      userName: "Admin Maestro",
      trackIds: ["trk_1", "trk_3", "trk_5"],
      coverUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80",
      isPublic: true,
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
    },
    {
      id: "pl_2",
      name: "Cyberpunk Energy",
      description: "High energy electronic and synthwave for peak performance.",
      userId: "usr_user1",
      userName: "Aria Melody",
      trackIds: ["trk_2", "trk_6"],
      coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80",
      isPublic: true,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  ],
  comments: [
    {
      id: "cmt_1",
      trackId: "trk_1",
      userId: "usr_user1",
      userName: "Aria Melody",
      userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      text: "This track gives me ultimate peaceful vibes. Absolute masterpiece!",
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
      id: "cmt_2",
      trackId: "trk_2",
      userId: "usr_admin",
      userName: "Admin Maestro",
      userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      text: "The bassline on this one is incredible. Great mixing!",
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
    }
  ],
  artists: [
    {
      id: "art_1",
      name: "Neko Beats",
      bio: "Tokyo-based lofi producer crafting cozy rhythms.",
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      genre: "Lo-Fi",
      followersCount: 12500
    },
    {
      id: "art_2",
      name: "Synthwave Pioneers",
      bio: "Retro-futuristic electronic duo reviving 80s synth magic.",
      image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      genre: "Electronic",
      followersCount: 28400
    }
  ]
};

async function seedMongoIfNeeded() {
  try {
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      console.log("Seeding initial data into MongoDB Atlas...");
      await UserModel.insertMany(initialData.users);
      await TrackModel.insertMany(initialData.tracks);
      await PlaylistModel.insertMany(initialData.playlists);
      await CommentModel.insertMany(initialData.comments);
      await ArtistModel.insertMany(initialData.artists);
      console.log("MongoDB Atlas seeding completed!");
    }
  } catch (err) {
    console.error("Error seeding MongoDB:", err);
  }
}

async function loadDb() {
  if (isMongoConnected && mongoose.connection.readyState === 1) {
    try {
      const users = await UserModel.find().select('-_id -__v').lean();
      const tracks = await TrackModel.find().select('-_id -__v').lean();
      const playlists = await PlaylistModel.find().select('-_id -__v').lean();
      const comments = await CommentModel.find().select('-_id -__v').lean();
      const artists = await ArtistModel.find().select('-_id -__v').lean();
      return { users, tracks, playlists, comments, artists };
    } catch (err) {
      console.error("MongoDB load error, falling back to local file:", err);
    }
  }

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return initialData;
  }
}

async function saveDb(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  
  if (isMongoConnected && mongoose.connection.readyState === 1) {
    try {
      // Sync collections to MongoDB Atlas if needed
      await UserModel.deleteMany({});
      if (data.users?.length) await UserModel.insertMany(data.users);

      await TrackModel.deleteMany({});
      if (data.tracks?.length) await TrackModel.insertMany(data.tracks);

      await PlaylistModel.deleteMany({});
      if (data.playlists?.length) await PlaylistModel.insertMany(data.playlists);

      await CommentModel.deleteMany({});
      if (data.comments?.length) await CommentModel.insertMany(data.comments);

      await ArtistModel.deleteMany({});
      if (data.artists?.length) await ArtistModel.insertMany(data.artists);
    } catch (err) {
      console.error("MongoDB sync error during save:", err);
    }
  }
}

// --- Database Status Endpoint ---
app.get("/api/db-status", async (req, res) => {
  const connected = isMongoConnected && mongoose.connection.readyState === 1;
  res.json({
    connected,
    mode: connected ? "MongoDB Atlas" : "Local JSON File Storage",
    uriConfigured: !!process.env.MONGODB_URI,
    databaseName: "melodyhub"
  });
});

// --- Auth Routes ---
app.post("/api/auth/login", async (req, res) => {
  const db = await loadDb();
  const { email, password } = req.body;
  const user = db.users.find((u: any) => u.email === email);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  res.json({ ...user, token: "mock_jwt_token_" + user.id });
});

app.post("/api/auth/register", async (req, res) => {
  const db = await loadDb();
  const { name, email, role } = req.body;
  if (db.users.some((u: any) => u.email === email)) {
    return res.status(400).json({ error: "Email already registered" });
  }
  const newUser = {
    id: "usr_" + Date.now(),
    name: name || "Music Lover",
    email,
    role: role || "user",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
  };
  db.users.push(newUser);
  await saveDb(db);
  res.json({ ...newUser, token: "mock_jwt_token_" + newUser.id });
});

// --- Tracks Routes ---
app.get("/api/tracks", async (req, res) => {
  const db = await loadDb();
  const { search, genre, sort } = req.query;
  let results = [...db.tracks];

  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    results = results.filter(
      (t: any) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q)
    );
  }

  if (genre && genre !== "All" && typeof genre === "string") {
    results = results.filter((t: any) => t.genre.toLowerCase() === genre.toLowerCase());
  }

  if (sort === "popular") {
    results.sort((a: any, b: any) => b.playCount - a.playCount);
  } else if (sort === "likes") {
    results.sort((a: any, b: any) => b.likesCount - a.likesCount);
  } else {
    results.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  res.json(results);
});

app.get("/api/tracks/:id", async (req, res) => {
  const db = await loadDb();
  const track = db.tracks.find((t: any) => t.id === req.params.id);
  if (!track) return res.status(404).json({ error: "Track not found" });
  res.json(track);
});

app.post("/api/tracks", async (req, res) => {
  const db = await loadDb();
  const { title, artist, album, genre, duration, coverUrl, audioUrl } = req.body;
  const newTrack = {
    id: "trk_" + Date.now(),
    title: title || "Untitled Track",
    artist: artist || "Unknown Artist",
    album: album || "Single",
    genre: genre || "Pop",
    duration: Number(duration) || 180,
    coverUrl: coverUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
    audioUrl: audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    playCount: 0,
    likesCount: 0,
    createdAt: new Date().toISOString(),
    likedBy: []
  };
  db.tracks.unshift(newTrack);
  await saveDb(db);
  res.json(newTrack);
});

app.put("/api/tracks/:id", async (req, res) => {
  const db = await loadDb();
  const index = db.tracks.findIndex((t: any) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Track not found" });

  db.tracks[index] = { ...db.tracks[index], ...req.body };
  await saveDb(db);
  res.json(db.tracks[index]);
});

app.delete("/api/tracks/:id", async (req, res) => {
  const db = await loadDb();
  db.tracks = db.tracks.filter((t: any) => t.id !== req.params.id);
  await saveDb(db);
  res.json({ success: true });
});

app.post("/api/tracks/:id/play", async (req, res) => {
  const db = await loadDb();
  const track = db.tracks.find((t: any) => t.id === req.params.id);
  if (track) {
    track.playCount = (track.playCount || 0) + 1;
    await saveDb(db);
  }
  res.json({ success: true, playCount: track ? track.playCount : 0 });
});

app.post("/api/tracks/:id/like", async (req, res) => {
  const db = await loadDb();
  const { userId } = req.body;
  const track = db.tracks.find((t: any) => t.id === req.params.id);
  if (!track) return res.status(404).json({ error: "Track not found" });

  if (!track.likedBy) track.likedBy = [];
  const idx = track.likedBy.indexOf(userId);
  let liked = false;
  if (idx > -1) {
    track.likedBy.splice(idx, 1);
    track.likesCount = Math.max(0, (track.likesCount || 1) - 1);
  } else {
    track.likedBy.push(userId);
    track.likesCount = (track.likesCount || 0) + 1;
    liked = true;
  }
  await saveDb(db);
  res.json({ liked, likesCount: track.likesCount, likedBy: track.likedBy });
});

// --- Playlists Routes ---
app.get("/api/playlists", async (req, res) => {
  const db = await loadDb();
  res.json(db.playlists);
});

app.post("/api/playlists", async (req, res) => {
  const db = await loadDb();
  const { name, description, userId, userName, coverUrl, isPublic } = req.body;
  const newPl = {
    id: "pl_" + Date.now(),
    name: name || "New Playlist",
    description: description || "",
    userId: userId || "usr_user1",
    userName: userName || "Aria Melody",
    trackIds: [],
    coverUrl: coverUrl || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
    isPublic: isPublic !== undefined ? isPublic : true,
    createdAt: new Date().toISOString()
  };
  db.playlists.unshift(newPl);
  await saveDb(db);
  res.json(newPl);
});

app.post("/api/playlists/:id/tracks", async (req, res) => {
  const db = await loadDb();
  const { trackId } = req.body;
  const pl = db.playlists.find((p: any) => p.id === req.params.id);
  if (!pl) return res.status(404).json({ error: "Playlist not found" });

  if (!pl.trackIds.includes(trackId)) {
    pl.trackIds.push(trackId);
    await saveDb(db);
  }
  res.json(pl);
});

app.delete("/api/playlists/:id/tracks/:trackId", async (req, res) => {
  const db = await loadDb();
  const pl = db.playlists.find((p: any) => p.id === req.params.id);
  if (!pl) return res.status(404).json({ error: "Playlist not found" });

  pl.trackIds = pl.trackIds.filter((id: string) => id !== req.params.trackId);
  await saveDb(db);
  res.json(pl);
});

app.delete("/api/playlists/:id", async (req, res) => {
  const db = await loadDb();
  db.playlists = db.playlists.filter((p: any) => p.id !== req.params.id);
  await saveDb(db);
  res.json({ success: true });
});

// --- Comments Routes ---
app.get("/api/tracks/:id/comments", async (req, res) => {
  const db = await loadDb();
  const comments = db.comments.filter((c: any) => c.trackId === req.params.id);
  res.json(comments);
});

app.post("/api/tracks/:id/comments", async (req, res) => {
  const db = await loadDb();
  const { userId, userName, userAvatar, text } = req.body;
  const newComment = {
    id: "cmt_" + Date.now(),
    trackId: req.params.id,
    userId: userId || "usr_user1",
    userName: userName || "Music Fan",
    userAvatar: userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    text,
    createdAt: new Date().toISOString()
  };
  db.comments.unshift(newComment);
  await saveDb(db);
  res.json(newComment);
});

// --- Genres & Artists Routes ---
app.get("/api/genres", async (req, res) => {
  const db = await loadDb();
  const genres = Array.from(new Set(db.tracks.map((t: any) => t.genre)));
  res.json(["All", ...genres]);
});

app.get("/api/artists", async (req, res) => {
  const db = await loadDb();
  res.json(db.artists);
});

// --- Admin Stats ---
app.get("/api/admin/stats", async (req, res) => {
  const db = await loadDb();
  const totalPlays = db.tracks.reduce((acc: number, t: any) => acc + (t.playCount || 0), 0);
  res.json({
    totalPlays,
    totalUsers: db.users.length,
    totalTracks: db.tracks.length,
    totalPlaylists: db.playlists.length,
    recentUploads: db.tracks.slice(0, 5)
  });
});

// --- AI Playlist Generator via Gemini ---
app.post("/api/ai/playlist", async (req, res) => {
  try {
    const { prompt } = req.body;
    const db = await loadDb();
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    const ai = new GoogleGenAI({ apiKey });
    const availableTracks = db.tracks.map((t: any) => ({
      id: t.id,
      title: t.title,
      artist: t.artist,
      genre: t.genre,
      album: t.album
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert AI Music DJ. Based on the user's prompt: "${prompt}", select a curated list of track IDs from the following catalog that match the vibe/mood. Return ONLY a JSON array of track IDs. Catalog: ${JSON.stringify(availableTracks)}`,
      config: {
        responseMimeType: "application/json"
      }
    });

    const trackIds = JSON.parse(response.text || "[]");
    res.json({ trackIds });
  } catch (err: any) {
    console.error("AI playlist error:", err);
    res.status(500).json({ error: err.message || "Failed to generate AI playlist" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MelodyHub Server running on http://localhost:${PORT}`);
  });
}

startServer();

