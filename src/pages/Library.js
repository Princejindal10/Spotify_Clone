import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Tabs,
  Tab,
  Chip,
  Avatar,
} from '@mui/material';
import {
  PlayArrow,
  Favorite,
  FavoriteBorder,
  MoreVert,
} from '@mui/icons-material';

const Library = ({ playTrack }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePlayTrack = (track) => {
    playTrack({
      id: track.id,
      title: track.title,
      artist: track.artist,
      cover: track.cover,
      duration: track.duration || 180,
    });
  };

  const likedSongs = [
    {
      id: 1,
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      cover: 'https://via.placeholder.com/150x150/1db954/ffffff?text=BL',
      duration: '3:20',
    },
    {
      id: 2,
      title: 'Dance Monkey',
      artist: 'Tones and I',
      cover: 'https://via.placeholder.com/150x150/1ed760/ffffff?text=DM',
      duration: '3:29',
    },
  ];

  const userPlaylists = [
    {
      id: 1,
      title: 'My Favorites',
      tracks: 25,
      cover: 'https://via.placeholder.com/200x200/1db954/ffffff?text=MF',
    },
    {
      id: 2,
      title: 'Road Trip Mix',
      tracks: 18,
      cover: 'https://via.placeholder.com/200x200/1ed760/ffffff?text=RTM',
    },
  ];

  const savedAlbums = [
    {
      id: 1,
      title: 'After Hours',
      artist: 'The Weeknd',
      cover: 'https://via.placeholder.com/200x200/1db954/ffffff?text=AH',
      year: '2020',
    },
    {
      id: 2,
      title: '÷ (Divide)',
      artist: 'Ed Sheeran',
      cover: 'https://via.placeholder.com/200x200/1ed760/ffffff?text=Divide',
      year: '2017',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 3 }}>
        Your Library
      </Typography>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{
          mb: 3,
          '& .MuiTab-root': {
            color: '#b3b3b3',
            textTransform: 'none',
            '&.Mui-selected': {
              color: '#ffffff',
            },
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#1db954',
          },
        }}
      >
        <Tab label="Liked Songs" />
        <Tab label="Playlists" />
        <Tab label="Albums" />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 2 }}>
            Liked Songs ({likedSongs.length})
          </Typography>
          <Grid container spacing={2}>
            {likedSongs.map((song) => (
              <Grid item xs={12} sm={6} md={4} key={song.id}>
                <Card
                  sx={{
                    backgroundColor: '#282828',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#383838',
                      transform: 'translateY(-4px)',
                    },
                  }}
                  onClick={() => handlePlayTrack(song)}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="150"
                      image={song.cover}
                      alt={song.title}
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        backgroundColor: '#1db954',
                        color: '#000000',
                        '&:hover': {
                          backgroundColor: '#1ed760',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <PlayArrow />
                    </IconButton>
                  </Box>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 500 }}>
                      {song.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#b3b3b3' }}>
                      {song.artist}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 2 }}>
            Your Playlists ({userPlaylists.length})
          </Typography>
          <Grid container spacing={2}>
            {userPlaylists.map((playlist) => (
              <Grid item xs={12} sm={6} md={4} key={playlist.id}>
                <Card
                  sx={{
                    backgroundColor: '#282828',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#383838',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={playlist.cover}
                      alt={playlist.title}
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        backgroundColor: '#1db954',
                        color: '#000000',
                        '&:hover': {
                          backgroundColor: '#1ed760',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <PlayArrow />
                    </IconButton>
                  </Box>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 1 }}>
                      {playlist.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                      {playlist.tracks} songs
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 2 }}>
            Saved Albums ({savedAlbums.length})
          </Typography>
          <Grid container spacing={2}>
            {savedAlbums.map((album) => (
              <Grid item xs={12} sm={6} md={4} key={album.id}>
                <Card
                  sx={{
                    backgroundColor: '#282828',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#383838',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={album.cover}
                      alt={album.title}
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        backgroundColor: '#1db954',
                        color: '#000000',
                        '&:hover': {
                          backgroundColor: '#1ed760',
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      <PlayArrow />
                    </IconButton>
                  </Box>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 1 }}>
                      {album.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
                      {album.artist} • {album.year}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default Library; 