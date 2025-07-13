import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  Avatar,
  Button,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Favorite,
  FavoriteBorder,
  MoreVert,
  Shuffle,
  Repeat,
  PersonAdd,
} from '@mui/icons-material';

const Artist = ({ playTrack }) => {
  const { id } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock artist data
  const artist = {
    id: id,
    name: 'The Weeknd',
    image: 'https://via.placeholder.com/300x300/1db954/ffffff?text=TW',
    followers: '45.2M',
    monthlyListeners: '82.1M',
    genre: 'R&B',
    bio: 'Abel Makkonen Tesfaye, known professionally as The Weeknd, is a Canadian singer, songwriter, and record producer.',
  };

  const popularTracks = [
    {
      id: 1,
      title: 'Blinding Lights',
      album: 'After Hours',
      duration: '3:20',
      cover: 'https://via.placeholder.com/150x150/1db954/ffffff?text=BL',
    },
    {
      id: 2,
      title: 'Starboy',
      album: 'Starboy',
      duration: '3:50',
      cover: 'https://via.placeholder.com/150x150/1ed760/ffffff?text=S',
    },
    {
      id: 3,
      title: 'The Hills',
      album: 'Beauty Behind the Madness',
      duration: '3:41',
      cover: 'https://via.placeholder.com/150x150/1db954/ffffff?text=TH',
    },
    {
      id: 4,
      title: 'Can\'t Feel My Face',
      album: 'Beauty Behind the Madness',
      duration: '3:33',
      cover: 'https://via.placeholder.com/150x150/1ed760/ffffff?text=CFMF',
    },
  ];

  const albums = [
    {
      id: 1,
      title: 'After Hours',
      year: '2020',
      cover: 'https://via.placeholder.com/200x200/1db954/ffffff?text=AH',
      tracks: 14,
    },
    {
      id: 2,
      title: 'Starboy',
      year: '2016',
      cover: 'https://via.placeholder.com/200x200/1ed760/ffffff?text=S',
      tracks: 18,
    },
    {
      id: 3,
      title: 'Beauty Behind the Madness',
      year: '2015',
      cover: 'https://via.placeholder.com/200x200/1db954/ffffff?text=BBTM',
      tracks: 14,
    },
    {
      id: 4,
      title: 'Kiss Land',
      year: '2013',
      cover: 'https://via.placeholder.com/200x200/1ed760/ffffff?text=KL',
      tracks: 10,
    },
  ];

  const handlePlayTrack = (track) => {
    playTrack({
      id: track.id,
      title: track.title,
      artist: artist.name,
      cover: track.cover,
      duration: track.duration || 180,
    });
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Artist Header */}
      <Box sx={{ display: 'flex', mb: 4, gap: 3 }}>
        <Avatar
          src={artist.image}
          sx={{ width: 300, height: 300, borderRadius: 2 }}
        >
          {artist.name.charAt(0)}
        </Avatar>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <Chip
            label={artist.genre}
            size="small"
            sx={{
              backgroundColor: '#8d67ab',
              color: '#ffffff',
              fontWeight: 500,
              mb: 1,
              alignSelf: 'flex-start',
            }}
          />
          <Typography variant="h2" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 1 }}>
            {artist.name}
          </Typography>
          <Typography variant="body1" sx={{ color: '#b3b3b3', mb: 2 }}>
            {artist.followers} followers • {artist.monthlyListeners} monthly listeners
          </Typography>
          <Typography variant="body2" sx={{ color: '#b3b3b3', mb: 3, maxWidth: 600 }}>
            {artist.bio}
          </Typography>
          
          {/* Artist Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={handlePlayPause}
              sx={{
                backgroundColor: '#1db954',
                color: '#000000',
                width: 56,
                height: 56,
                '&:hover': {
                  backgroundColor: '#1ed760',
                  transform: 'scale(1.05)',
                },
              }}
            >
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
            <IconButton sx={{ color: '#b3b3b3' }}>
              <Shuffle />
            </IconButton>
            <IconButton sx={{ color: '#b3b3b3' }}>
              <Repeat />
            </IconButton>
            <Button
              variant={isFollowing ? "outlined" : "contained"}
              startIcon={isFollowing ? null : <PersonAdd />}
              onClick={handleFollow}
              sx={{
                backgroundColor: isFollowing ? 'transparent' : '#1db954',
                color: isFollowing ? '#1db954' : '#000000',
                borderColor: '#1db954',
                textTransform: 'none',
                borderRadius: 20,
                px: 3,
                '&:hover': {
                  backgroundColor: isFollowing ? 'rgba(29, 185, 84, 0.1)' : '#1ed760',
                },
              }}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
            <IconButton sx={{ color: '#b3b3b3' }}>
              <MoreVert />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Popular Tracks */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 2 }}>
          Popular
        </Typography>
        <Grid container spacing={2}>
          {popularTracks.map((track) => (
            <Grid item xs={12} sm={6} md={3} key={track.id}>
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
                onClick={() => handlePlayTrack(track)}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="150"
                    image={track.cover}
                    alt={track.title}
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
                  <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 500, mb: 1 }}>
                    {track.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#b3b3b3' }}>
                    {track.album} • {track.duration}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Albums */}
      <Box>
        <Typography variant="h5" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 2 }}>
          Albums
        </Typography>
        <Grid container spacing={2}>
          {albums.map((album) => (
            <Grid item xs={12} sm={6} md={3} key={album.id}>
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
                    {album.year} • {album.tracks} songs
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Artist; 