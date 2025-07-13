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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  PlayArrow,
} from '@mui/icons-material';
import { shazamApi, transformTrack, fallbackData } from '../services/api';

const WorldCharts = ({ playTrack }) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('US');

  // Country options for the dropdown
  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'JP', name: 'Japan' },
    { code: 'KR', name: 'South Korea' },
    { code: 'BR', name: 'Brazil' },
    { code: 'MX', name: 'Mexico' },
    { code: 'IN', name: 'India' },
    { code: 'RU', name: 'Russia' },
    { code: 'CN', name: 'China' },
    { code: 'DZ', name: 'Algeria' },
    { code: 'EG', name: 'Egypt' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'NG', name: 'Nigeria' },
    { code: 'KE', name: 'Kenya' },
  ];

  // Fetch world charts data
  useEffect(() => {
    const fetchWorldCharts = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching Best Tracks for country:', selectedCountry);
        
        // Try multiple endpoints to get the best data
        let chartsResponse;
        
        // First try the country charts endpoint (usually more reliable)
        try {
          chartsResponse = await shazamApi.getCountryCharts(selectedCountry);
          console.log('Country charts response:', chartsResponse);
        } catch (error) {
          console.log('Country charts failed, trying world charts...');
          try {
            // If that fails, try the world charts endpoint
            chartsResponse = await shazamApi.getWorldwideCharts(selectedCountry);
            console.log('World charts response:', chartsResponse);
          } catch (worldError) {
            console.log('Both endpoints failed, using fallback data');
            throw worldError;
          }
        }
        
        console.log('Full API response:', chartsResponse);
        console.log('Response type:', typeof chartsResponse);
        console.log('Response keys:', Object.keys(chartsResponse || {}));
        
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
        } else if (chartsResponse && chartsResponse.data && Array.isArray(chartsResponse.data)) {
          tracksArray = chartsResponse.data;
          console.log('Found tracks in chartsResponse.data');
        } else if (chartsResponse && chartsResponse.charts && Array.isArray(chartsResponse.charts)) {
          tracksArray = chartsResponse.charts;
          console.log('Found tracks in chartsResponse.charts');
        } else if (chartsResponse && chartsResponse.items && Array.isArray(chartsResponse.items)) {
          tracksArray = chartsResponse.items;
          console.log('Found tracks in chartsResponse.items');
        }
        
        console.log('Tracks array found:', tracksArray.length);
        if (tracksArray.length > 0) {
          console.log('First track structure:', tracksArray[0]);
        }
        
        if (tracksArray.length > 0) {
          const transformedTracks = tracksArray
            .slice(0, 20) // Take first 20 tracks
            .map(track => transformTrack(track))
            .filter(track => track !== null);
          
          console.log('Transformed tracks:', transformedTracks);
          
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
        console.error('Error fetching Apple Music charts:', err);
        console.error('Error details:', err.response?.data || err.message);
        setError(`Failed to load Apple Music charts: ${err.message}. Using fallback content.`);
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

    fetchWorldCharts();
  }, [selectedCountry]);

  const handlePlayTrack = (track) => {
    if (!track.preview_url) {
      // Show a notification or alert that this track doesn't have audio
      alert('This track is not available for preview. Apple Music previews are only available for some tracks.');
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

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
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
          Loading Music charts...
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

      {/* Header Section */}
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
          <Typography variant="h6" sx={{ color: '#b3b3b3', fontWeight: 400, mb: 3 }}>
            Discover the hottest music from Top Tracks
          </Typography>
          
          {/* Country Selector */}
          <FormControl sx={{ minWidth: 200, backgroundColor: '#282828', borderRadius: 1 }}>
            <InputLabel sx={{ color: '#b3b3b3' }}>Select Country</InputLabel>
            <Select
              value={selectedCountry}
              onChange={handleCountryChange}
              sx={{
                color: '#ffffff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#404040',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1db954',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1db954',
                },
                '& .MuiSvgIcon-root': {
                  color: '#b3b3b3',
                },
              }}
            >
              {countries.map((country) => (
                <MenuItem key={country.code} value={country.code} sx={{ color: '#ffffff' }}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
                      {track.artist} • {track.album}
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
                        #{index + 1} in charts
                      </Typography>
                      {!track.preview_url && (
                        <Chip
                          label="No Preview"
                          size="small"
                          sx={{
                            backgroundColor: '#ff6b6b',
                            color: '#ffffff',
                            fontWeight: 500,
                            fontSize: '0.6rem',
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

export default WorldCharts; 