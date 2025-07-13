import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Fade,
  Grow,
} from '@mui/material';
import {
  Search as SearchIcon,
  PlayArrow,
} from '@mui/icons-material';
import { shazamApi, transformTrack, transformAlbum, transformArtist, transformPlaylist, popularSearchTerms } from '../services/api';

const Search = ({ playTrack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [searchResults, setSearchResults] = useState({
    suggestions: [],
    songs: [],
    albums: [],
    artists: [],
    playlists: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Fetch search results using multi search
  const performSearch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Searching for:', searchQuery);
      
      // Fetch actual search results using multi search
      const searchResponse = await shazamApi.search(searchQuery, 20, 0, 'SONGS');
      console.log('Search response:', searchResponse);
      
      let tracks = [], albums = [], artists = [], playlists = [];
      let suggestions = [];
      
      if (searchResponse && searchResponse.tracks && searchResponse.tracks.hits) {
        // Handle Shazam Core API structure: { tracks: { hits: [{ track: {...} }] } }
        tracks = searchResponse.tracks.hits.map(transformTrack).filter(Boolean);
        albums = searchResponse.tracks.hits.map(transformAlbum).filter(Boolean);
        artists = searchResponse.tracks.hits.map(transformArtist).filter(Boolean);
        playlists = searchResponse.tracks.hits.map(transformPlaylist).filter(Boolean);
      } else if (searchResponse && searchResponse.tracks && Array.isArray(searchResponse.tracks)) {
        // Transform the actual search results
        tracks = searchResponse.tracks.map(transformTrack).filter(Boolean);
        albums = searchResponse.tracks.map(transformAlbum).filter(Boolean);
        artists = searchResponse.tracks.map(transformArtist).filter(Boolean);
        playlists = searchResponse.tracks.map(transformPlaylist).filter(Boolean);
      } else if (searchResponse && Array.isArray(searchResponse)) {
        // Direct array response
        tracks = searchResponse.map(transformTrack).filter(Boolean);
        albums = searchResponse.map(transformAlbum).filter(Boolean);
        artists = searchResponse.map(transformArtist).filter(Boolean);
        playlists = searchResponse.map(transformPlaylist).filter(Boolean);
      }
      
      // Also fetch suggestions for better UX
      try {
        const suggestResponse = await shazamApi.searchSuggest(searchQuery);
        if (suggestResponse && suggestResponse.hints) {
          suggestions = suggestResponse.hints.map(hint => hint.term);
        }
      } catch (suggestError) {
        console.log('Suggestions failed, continuing without them');
      }

      setSearchResults({
        suggestions,
        songs: tracks,
        albums: albums,
        artists: artists,
        playlists: playlists,
      });
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch();
      } else {
        setSearchResults({
          suggestions: [],
          songs: [],
          albums: [],
          artists: [],
          playlists: [],
        });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, performSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

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

  const handleSuggestionClick = async (term) => {
    setSearchQuery(term);
    // Optionally, you can immediately fetch tracks for this suggestion
    // or let the debounced effect handle it
  };

  const renderSuggestions = () => (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
        Suggestions
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {searchResults.suggestions.map((term) => (
          <Chip
            key={term}
            label={term}
            onClick={() => handleSuggestionClick(term)}
            sx={{
              backgroundColor: '#404040',
              color: '#ffffff',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#1db954',
                color: '#000000',
              },
              transition: 'all 0.2s ease',
            }}
          />
        ))}
      </Box>
    </Box>
  );

  const renderSongs = () => (
    <Grid container spacing={2}>
      {searchResults.songs.map((song, index) => (
        <Grid item xs={12} sm={6} md={4} key={song.id}>
          <Grow in={true} timeout={200 + index * 50}>
            <Card
              sx={{
                backgroundColor: '#282828',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#383838',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                },
              }}
              onMouseEnter={() => setHoveredCard(song.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handlePlayTrack(song)}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="150"
                  image={song.cover}
                  alt={song.title}
                  onError={handleImageError}
                  sx={{
                    transition: 'transform 0.3s ease',
                    transform: hoveredCard === song.id ? 'scale(1.05)' : 'scale(1)',
                    backgroundColor: '#404040',
                  }}
                />
                
                <Fade in={hoveredCard === song.id} timeout={200}>
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
                <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 500, mb: 1 }}>
                  {song.title}
                </Typography>
                <Typography variant="caption" sx={{ color: '#b3b3b3' }}>
                  {song.artist} • {song.album}
                </Typography>
              </CardContent>
            </Card>
          </Grow>
        </Grid>
      ))}
    </Grid>
  );

  const renderAlbums = () => (
    <Grid container spacing={2}>
      {searchResults.albums.map((album, index) => (
        <Grid item xs={12} sm={6} md={4} key={album.id}>
          <Grow in={true} timeout={200 + index * 50}>
            <Card
              sx={{
                backgroundColor: '#282828',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#383838',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                },
              }}
              onMouseEnter={() => setHoveredCard(album.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={album.cover}
                  alt={album.title}
                  onError={handleImageError}
                  sx={{
                    transition: 'transform 0.3s ease',
                    transform: hoveredCard === album.id ? 'scale(1.05)' : 'scale(1)',
                    backgroundColor: '#404040',
                  }}
                />
                
                <Fade in={hoveredCard === album.id} timeout={200}>
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
                <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 500, mb: 1 }}>
                  {album.title}
                </Typography>
                <Typography variant="caption" sx={{ color: '#b3b3b3' }}>
                  {album.artist} • {album.year}
                </Typography>
              </CardContent>
            </Card>
          </Grow>
        </Grid>
      ))}
    </Grid>
  );

  const renderArtists = () => (
    <Grid container spacing={2}>
      {searchResults.artists.map((artist, index) => (
        <Grid item xs={12} sm={6} md={4} key={artist.id}>
          <Grow in={true} timeout={200 + index * 50}>
            <Card
              sx={{
                backgroundColor: '#282828',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#383838',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                },
              }}
              onMouseEnter={() => setHoveredCard(artist.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={artist.image}
                  alt={artist.name}
                  onError={handleImageError}
                  sx={{
                    transition: 'transform 0.3s ease',
                    transform: hoveredCard === artist.id ? 'scale(1.05)' : 'scale(1)',
                    backgroundColor: '#404040',
                  }}
                />
                
                <Fade in={hoveredCard === artist.id} timeout={200}>
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
                <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 500, mb: 1 }}>
                  {artist.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#b3b3b3' }}>
                  {artist.genres?.join(', ') || 'Unknown Genre'}
                </Typography>
              </CardContent>
            </Card>
          </Grow>
        </Grid>
      ))}
    </Grid>
  );

  const renderPlaylists = () => (
    <Grid container spacing={2}>
      {searchResults.playlists.map((playlist, index) => (
        <Grid item xs={12} sm={6} md={4} key={playlist.id}>
          <Grow in={true} timeout={200 + index * 50}>
            <Card
              sx={{
                backgroundColor: '#282828',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#383838',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                },
              }}
              onMouseEnter={() => setHoveredCard(playlist.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={playlist.cover}
                  alt={playlist.title}
                  onError={handleImageError}
                  sx={{
                    transition: 'transform 0.3s ease',
                    transform: hoveredCard === playlist.id ? 'scale(1.05)' : 'scale(1)',
                    backgroundColor: '#404040',
                  }}
                />
                
                <Fade in={hoveredCard === playlist.id} timeout={200}>
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
                <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 500, mb: 1 }}>
                  {playlist.title}
                </Typography>
                <Typography variant="caption" sx={{ color: '#b3b3b3' }}>
                  {playlist.creator} • {playlist.tracks} tracks
                </Typography>
              </CardContent>
            </Card>
          </Grow>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: '#121212' }}>
      <Typography variant="h4" sx={{ color: '#ffffff', mb: 3, fontWeight: 'bold' }}>
        Search
      </Typography>
      
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search for songs, artists, albums..."
        value={searchQuery}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#b3b3b3' }} />
            </InputAdornment>
          ),
          sx: {
            backgroundColor: '#282828',
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
            '& input': {
              color: '#ffffff',
            },
            '& input::placeholder': {
              color: '#b3b3b3',
              opacity: 1,
            },
          },
        }}
        sx={{ mb: 3 }}
      />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress sx={{ color: '#1db954' }} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3, backgroundColor: '#2d1b1b', color: '#f44336' }}>
          {error}
        </Alert>
      )}

      {searchQuery.trim() && searchResults.suggestions.length > 0 && searchResults.songs.length === 0 && renderSuggestions()}

      {searchQuery.trim() && (
        <>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              mb: 3,
              '& .MuiTab-root': {
                color: '#b3b3b3',
                '&.Mui-selected': {
                  color: '#1db954',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#1db954',
              },
            }}
          >
            <Tab label={`Songs (${searchResults.songs.length})`} />
          </Tabs>

          <Box>
            {activeTab === 0 && searchResults.songs.length > 0 && renderSongs()}
            {activeTab === 1 && searchResults.albums.length > 0 && renderAlbums()}
            {activeTab === 2 && searchResults.artists.length > 0 && renderArtists()}
            {activeTab === 3 && searchResults.playlists.length > 0 && renderPlaylists()}
          </Box>

          {!loading && searchResults.songs.length === 0 && searchResults.albums.length === 0 && 
           searchResults.artists.length === 0 && searchResults.playlists.length === 0 && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="h6" sx={{ color: '#b3b3b3' }}>
                No results found for "{searchQuery}"
              </Typography>
              <Typography variant="body2" sx={{ color: '#808080', mt: 1 }}>
                Try searching for something else or check the suggestions above
              </Typography>
            </Box>
          )}
          
          {!loading && (searchResults.songs.length > 0 || searchResults.albums.length > 0 || 
           searchResults.artists.length > 0 || searchResults.playlists.length > 0) && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#b3b3b3', mb: 2 }}>
                Found {searchResults.songs.length + searchResults.albums.length + 
                       searchResults.artists.length + searchResults.playlists.length} results
              </Typography>
            </Box>
          )}
        </>
      )}

      {!searchQuery.trim() && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ color: '#ffffff', mb: 2 }}>
            Popular Searches
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {popularSearchTerms.map((term) => (
              <Chip
                key={term}
                label={term}
                onClick={() => setSearchQuery(term)}
                sx={{
                  backgroundColor: '#404040',
                  color: '#ffffff',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#1db954',
                    color: '#000000',
                  },
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Search; 