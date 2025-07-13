import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

// Components
import Sidebar from './components/Sidebar';
import MusicPlayer from './components/MusicPlayer';
import Header from './components/Header';

// Pages
import Home from './pages/Home';
import Search from './pages/Search';
import WorldCharts from './pages/WorldCharts';
import Playlist from './pages/Playlist';
import Album from './pages/Album';
import Artist from './pages/Artist';

// Create dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1db954',
    },
    secondary: {
      main: '#1ed760',
    },
    background: {
      default: '#121212',
      paper: '#282828',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 20,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#282828',
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [volume, setVolume] = useState(50);
  const [playHistory, setPlayHistory] = useState([]);

  // Enhanced play track function
  const playTrack = useCallback((track) => {
    // Add to play history
    setPlayHistory(prev => {
      const filtered = prev.filter(t => t.id !== track.id);
      return [track, ...filtered.slice(0, 19)]; // Keep last 20 tracks
    });

    // Update current track
    setCurrentTrack({
      ...track,
      duration: track.duration || 180, // Ensure duration is set
    });
    
    // Start playing
    setIsPlaying(true);
  }, []);

  // Enhanced play/pause toggle
  const togglePlayPause = useCallback(() => {
    if (currentTrack) {
      setIsPlaying(!isPlaying);
    }
  }, [currentTrack, isPlaying]);

  // Add track to queue
  const addToQueue = useCallback((track) => {
    setQueue(prev => [...prev, track]);
  }, []);

  // Remove track from queue
  const removeFromQueue = useCallback((trackId) => {
    setQueue(prev => prev.filter(track => track.id !== trackId));
  }, []);

  // Clear queue
  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  // Skip to next track
  const skipToNext = useCallback(() => {
    if (queue.length > 0) {
      const nextTrack = queue[0];
      const remainingQueue = queue.slice(1);
      setQueue(remainingQueue);
      playTrack(nextTrack);
    } else {
      // If no queue, stop playing
      setIsPlaying(false);
      setCurrentTrack(null);
    }
  }, [queue, playTrack]);

  // Skip to previous track
  const skipToPrevious = useCallback(() => {
    if (playHistory.length > 1) {
      const previousTrack = playHistory[1];
      setPlayHistory(prev => prev.slice(1));
      playTrack(previousTrack);
    }
  }, [playHistory, playTrack]);



  // Play playlist
  const playPlaylist = useCallback((playlist, tracks) => {
    if (tracks && tracks.length > 0) {
      // Play first track
      playTrack(tracks[0]);
      // Add remaining tracks to queue
      setQueue(tracks.slice(1));
    }
  }, [playTrack]);

  // Play album
  const playAlbum = useCallback((album, tracks) => {
    if (tracks && tracks.length > 0) {
      // Play first track
      playTrack(tracks[0]);
      // Add remaining tracks to queue
      setQueue(tracks.slice(1));
    }
  }, [playTrack]);

  // Shuffle play
  const shufflePlay = useCallback((tracks) => {
    if (tracks && tracks.length > 0) {
      const shuffled = [...tracks].sort(() => Math.random() - 0.5);
      playTrack(shuffled[0]);
      setQueue(shuffled.slice(1));
    }
  }, [playTrack]);

  // Auto-advance to next track when current track ends
  useEffect(() => {
    if (currentTrack && !isPlaying && queue.length > 0) {
      // Simulate track ending and auto-advance
      const timer = setTimeout(() => {
        skipToNext();
      }, 2000); // Wait 2 seconds before auto-advancing

      return () => clearTimeout(timer);
    }
  }, [currentTrack, isPlaying, queue, skipToNext]);



  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
          <Sidebar />
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <Header />
            <Box sx={{ flex: 1, overflow: 'auto', padding: 2 }}>
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <Home 
                      playTrack={playTrack}
                    />
                  } 
                />
                <Route 
                  path="/search" 
                  element={
                    <Search 
                      playTrack={playTrack}
                    />
                  } 
                />
                <Route 
                  path="/world-charts" 
                  element={
                    <WorldCharts 
                      playTrack={playTrack}
                    />
                  } 
                />

                <Route 
                  path="/playlist/:id" 
                  element={
                    <Playlist 
                      playTrack={playTrack}
                      playPlaylist={playPlaylist}
                      shufflePlay={shufflePlay}
                    />
                  } 
                />
                <Route 
                  path="/album/:id" 
                  element={
                    <Album 
                      playTrack={playTrack}
                      playAlbum={playAlbum}
                      shufflePlay={shufflePlay}
                    />
                  } 
                />
                <Route 
                  path="/artist/:id" 
                  element={
                    <Artist 
                      playTrack={playTrack}
                    />
                  } 
                />
              </Routes>
            </Box>
            {currentTrack && (
              <MusicPlayer
                track={currentTrack}
                isPlaying={isPlaying}
                onPlayPause={togglePlayPause}
                onSkipNext={skipToNext}
                onSkipPrevious={skipToPrevious}
                volume={volume}
                onVolumeChange={setVolume}
                queue={queue}
                onAddToQueue={addToQueue}
                onRemoveFromQueue={removeFromQueue}
                onClearQueue={clearQueue}
                playHistory={playHistory}
              />
            )}
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 