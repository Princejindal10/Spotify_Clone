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

const Album = ({ playTrack }) => {
  const { id } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock album data
  const album = {
    id: id,
    title: 'After Hours',
    artist: 'The Weeknd',
    cover: 'https://via.placeholder.com/300x300/1db954/ffffff?text=After+Hours',
    year: '2020',
    genre: 'R&B',
    tracks: 14,
    duration: '56:19',
  };

  const tracks = [
    {
      id: 1,
      title: 'Alone Again',
      duration: '4:10',
      cover: 'https://via.placeholder.com/50x50/1db954/ffffff?text=AA',
    },
    {
      id: 2,
      title: 'Too Late',
      duration: '3:59',
      cover: 'https://via.placeholder.com/50x50/1ed760/ffffff?text=TL',
    },
    {
      id: 3,
      title: 'Hardest To Love',
      duration: '3:31',
      cover: 'https://via.placeholder.com/50x50/1db954/ffffff?text=HTL',
    },
    {
      id: 4,
      title: 'Scared To Live',
      duration: '3:11',
      cover: 'https://via.placeholder.com/50x50/1ed760/ffffff?text=STL',
    },
    {
      id: 5,
      title: 'Snowchild',
      duration: '4:07',
      cover: 'https://via.placeholder.com/50x50/1db954/ffffff?text=SC',
    },
    {
      id: 6,
      title: 'Escape From LA',
      duration: '5:55',
      cover: 'https://via.placeholder.com/50x50/1ed760/ffffff?text=EFLA',
    },
    {
      id: 7,
      title: 'Heartless',
      duration: '3:18',
      cover: 'https://via.placeholder.com/50x50/1db954/ffffff?text=H',
    },
    {
      id: 8,
      title: 'Faith',
      duration: '4:43',
      cover: 'https://via.placeholder.com/50x50/1ed760/ffffff?text=F',
    },
    {
      id: 9,
      title: 'Blinding Lights',
      duration: '3:20',
      cover: 'https://via.placeholder.com/50x50/1db954/ffffff?text=BL',
    },
    {
      id: 10,
      title: 'In Your Eyes',
      duration: '3:57',
      cover: 'https://via.placeholder.com/50x50/1ed760/ffffff?text=IYE',
    },
  ];

  const handlePlayTrack = (track) => {
    playTrack({
      id: track.id,
      title: track.title,
      artist: album.artist,
      cover: track.cover,
      duration: track.duration || 180,
    });
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Album Header */}
      <Box sx={{ display: 'flex', mb: 4, gap: 3 }}>
        <CardMedia
          component="img"
          sx={{ width: 300, height: 300, borderRadius: 2 }}
          image={album.cover}
          alt={album.title}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <Chip
            label={album.genre}
            size="small"
            sx={{
              backgroundColor: '#8d67ab',
              color: '#ffffff',
              fontWeight: 500,
              mb: 1,
              alignSelf: 'flex-start',
            }}
          />
          <Typography variant="h3" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 1 }}>
            {album.title}
          </Typography>
          <Typography variant="h5" sx={{ color: '#b3b3b3', mb: 2 }}>
            {album.artist}
          </Typography>
          <Typography variant="body2" sx={{ color: '#b3b3b3', mb: 2 }}>
            {album.year} • {album.tracks} songs, {album.duration}
          </Typography>
          
          {/* Album Controls */}
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
                        {album.artist}
                      </Typography>
                    </Box>
                  </Box>
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

export default Album; 