import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  Fade,
  Grow,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  PlayArrow,
} from '@mui/icons-material';
import { shazamApi, transformTrack, fallbackData } from '../services/api';

const Home = ({ playTrack }) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from RapidAPI
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching top tracks from Shazam...');
        
        // Fetch top charts from Shazam
        const chartsResponse = await shazamApi.getWorldwideCharts('US');
        console.log('Raw charts response:', chartsResponse); // Debug log
        
        // Handle Shazam Core API response structure
        let tracksArray = [];
        
        if (chartsResponse && chartsResponse.tracks && chartsResponse.tracks.hits) {
          // Shazam Core API structure: { tracks: { hits: [{ track: {...} }] } }
          tracksArray = chartsResponse.tracks.hits;
          console.log('Found tracks in chartsResponse.tracks.hits (Shazam Core format)');
        } else if (chartsResponse && Array.isArray(chartsResponse)) {
          // Direct array of tracks (Apple Music format)
          tracksArray = chartsResponse;
          console.log('Found tracks in chartsResponse (direct array - Apple Music format)');
        } else if (chartsResponse && chartsResponse.tracks && Array.isArray(chartsResponse.tracks)) {
          tracksArray = chartsResponse.tracks;
          console.log('Found tracks in chartsResponse.tracks');
        }
        
        console.log('Tracks array found:', tracksArray.length);
        
        if (tracksArray.length > 0) {
          // Transform tracks to display format
          const transformedTracks = tracksArray
            .slice(0, 12) // Take first 12 tracks
            .map(track => transformTrack(track))
            .filter(track => track !== null); // Filter out null tracks
          console.log('Transformed tracks (filtered):', transformedTracks); // Debug log
          
          if (transformedTracks.length > 0) {
            setTracks(transformedTracks);
          } else {
            console.log('No valid tracks after transformation, using fallback data');
            setTracks(fallbackData.albums.map(album => ({
              id: album.id,
              title: album.title,
              artist: album.artist,
              cover: album.cover,
              duration: 180,
              album: album.title,
            })));
          }
        } else {
          console.log('No tracks found in response, using fallback data');
          console.log('Response structure:', chartsResponse);
          setTracks(fallbackData.albums.map(album => ({
            id: album.id,
            title: album.title,
            artist: album.artist,
            cover: album.cover,
            duration: 180,
            album: album.title,
          })));
        }

      } catch (err) {
        console.error('Error fetching charts:', err);
        setError(`Failed to load tracks: ${err.message}. Using fallback content.`);
        // Use fallback data on error
        setTracks(fallbackData.albums.map(album => ({
          id: album.id,
          title: album.title,
          artist: album.artist,
          cover: album.cover,
          duration: 180,
          album: album.title,
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePlayTrack = (track) => {
    if (!track.preview_url) {
      // Show a notification or alert that this track doesn't have audio
      alert('This track is not available for preview. Preview is only available for some tracks.');
      return;
    }
    
    playTrack({
      id: track.id,
      title: track.title,
      artist: track.artist,
      cover: track.cover,
      duration: track.duration || 180,
      preview_url: track.preview_url,
    });
  };

  const handleImageError = (event) => {
    // Fallback to a music-themed image if the original fails
    event.target.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center';
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={60} sx={{ color: '#1db954' }} />
        <Typography variant="h6" sx={{ color: '#b3b3b3' }}>
          Loading top tracks...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, pb: 12 }}>
      {/* Error Alert */}
      {error && (
        <Fade in={true} timeout={500}>
          <Alert 
            severity="warning" 
            sx={{ mb: 3, backgroundColor: 'rgba(255, 193, 7, 0.1)', color: '#ffc107' }}
          >
            {error}
          </Alert>
        </Fade>
      )}

      {/* Welcome Section */}
      <Fade in={true} timeout={800}>
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              color: '#ffffff', 
              fontWeight: 'bold', 
              mb: 1,
              background: 'linear-gradient(45deg, #1db954, #1ed760)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Top Tracks
          </Typography>
          <Typography variant="h6" sx={{ color: '#b3b3b3', fontWeight: 400 }}>
            Discover the hottest music from around the world
          </Typography>
        </Box>
      </Fade>

      {/* Tracks Grid */}
      <Fade in={true} timeout={1200}>
        <Grid container spacing={3}>
          {tracks.map((track, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={track.id}>
              <Grow in={true} timeout={1400 + index * 100}>
                <Card
                  sx={{
                    backgroundColor: '#282828',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    height: '100%',
                    '&:hover': {
                      backgroundColor: '#383838',
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                  onMouseEnter={() => setHoveredCard(track.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => handlePlayTrack(track)}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="250"
                      image={track.cover}
                      alt={track.title}
                      onError={handleImageError}
                      sx={{
                        transition: 'transform 0.3s ease',
                        transform: hoveredCard === track.id ? 'scale(1.05)' : 'scale(1)',
                        backgroundColor: '#404040',
                      }}
                    />
                    
                    {/* Play Button Overlay */}
                    <Fade in={hoveredCard === track.id} timeout={200}>
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          right: 8,
                          display: 'flex',
                          gap: 1,
                        }}
                      >
                        <IconButton
                          sx={{
                            backgroundColor: '#1db954',
                            color: '#000000',
                            '&:hover': {
                              backgroundColor: '#1ed760',
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <PlayArrow />
                        </IconButton>
                      </Box>
                    </Fade>
                  </Box>
                  
                  <CardContent sx={{ p: 2 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#ffffff', 
                        fontWeight: 'bold', 
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {track.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#b3b3b3', 
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {track.artist} • {track.year}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label="Track"
                        size="small"
                        sx={{
                          backgroundColor: '#8d67ab',
                          color: '#ffffff',
                          fontWeight: 500,
                          textTransform: 'capitalize',
                        }}
                      />
                      <Typography variant="caption" sx={{ color: '#b3b3b3' }}>
                        {track.duration ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}` : '3:00'}
                      </Typography>
                      {track.preview_url && (
                        <Chip
                          label="Preview"
                          size="small"
                          sx={{
                            backgroundColor: '#1db954',
                            color: '#ffffff',
                            fontWeight: 500,
                          }}
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Fade>
    </Box>
  );
};

export default Home; 