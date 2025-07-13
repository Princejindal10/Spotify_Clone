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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Favorite,
  FavoriteBorder,
  MoreVert,
  Shuffle,
  Repeat,
} from '@mui/icons-material';

const Playlist = ({ playTrack }) => {
  const { id } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock playlist data
  const playlist = {
    id: id,
    title: 'Today\'s Top Hits',
    description: 'The hottest tracks right now.',
    cover: 'https://via.placeholder.com/300x300/1db954/ffffff?text=Top+Hits',
    creator: 'Spotify',
    tracks: 50,
    duration: '2h 15m',
    genre: 'Pop',
  };

  const tracks = [
    {
      id: 1,
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      duration: '3:20',
      cover: 'https://via.placeholder.com/50x50/1db954/ffffff?text=BL',
    },
    {
      id: 2,
      title: 'Dance Monkey',
      artist: 'Tones and I',
      album: 'The Kids Are Coming',
      duration: '3:29',
      cover: 'https://via.placeholder.com/50x50/1ed760/ffffff?text=DM',
    },
    {
      id: 3,
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      album: '÷ (Divide)',
      duration: '3:53',
      cover: 'https://via.placeholder.com/50x50/1db954/ffffff?text=SOY',
    },
    {
      id: 4,
      title: 'Uptown Funk',
      artist: 'Mark Ronson ft. Bruno Mars',
      album: 'Uptown Special',
      duration: '4:29',
      cover: 'https://via.placeholder.com/50x50/1ed760/ffffff?text=UF',
    },
  ];

  const handlePlayTrack = (track) => {
    playTrack({
      id: track.id,
      title: track.title,
      artist: track.artist,
      cover: track.cover,
      duration: track.duration || 180,
    });
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Playlist Header */}
      <Box sx={{ display: 'flex', mb: 4, gap: 3 }}>
        <CardMedia
          component="img"
          sx={{ width: 300, height: 300, borderRadius: 2 }}
          image={playlist.cover}
          alt={playlist.title}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <Chip
            label={playlist.genre}
            size="small"
            sx={{
              backgroundColor: '#1db954',
              color: '#ffffff',
              fontWeight: 500,
              mb: 1,
              alignSelf: 'flex-start',
            }}
          />
          <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 1 }}>
            {playlist.title}
          </Typography>
          <Typography variant="body1" sx={{ color: '#b3b3b3', mb: 2 }}>
            {playlist.description}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
              {playlist.creator.charAt(0)}
            </Avatar>
            <Typography variant="body2" sx={{ color: '#b3b3b3' }}>
              {playlist.creator} • {playlist.tracks} songs, {playlist.duration}
            </Typography>
          </Box>
          
          {/* Playlist Controls */}
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
            <IconButton sx={{ color: '#b3b3b3' }}>
              <FavoriteBorder />
            </IconButton>
            <IconButton sx={{ color: '#b3b3b3' }}>
              <MoreVert />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Tracks Table */}
      <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#b3b3b3', borderBottom: '1px solid #282828' }}>#</TableCell>
              <TableCell sx={{ color: '#b3b3b3', borderBottom: '1px solid #282828' }}>Title</TableCell>
              <TableCell sx={{ color: '#b3b3b3', borderBottom: '1px solid #282828' }}>Album</TableCell>
              <TableCell sx={{ color: '#b3b3b3', borderBottom: '1px solid #282828' }}>Duration</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tracks.map((track, index) => (
              <TableRow
                key={track.id}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
                onClick={() => handlePlayTrack(track)}
              >
                <TableCell sx={{ color: '#b3b3b3', borderBottom: '1px solid #282828' }}>
                  {index + 1}
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid #282828' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={track.cover}
                      sx={{ width: 40, height: 40 }}
                    >
                      {track.title.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 500 }}>
                        {track.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#b3b3b3' }}>
                        {track.artist}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: '#b3b3b3', borderBottom: '1px solid #282828' }}>
                  {track.album}
                </TableCell>
                <TableCell sx={{ color: '#b3b3b3', borderBottom: '1px solid #282828' }}>
                  {track.duration}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Playlist; 