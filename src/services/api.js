// Shazam Core API Configuration
const RAPIDAPI_KEY = process.env.REACT_APP_RAPIDAPI_KEY || 'b17f87d167msh01fb8277587285ap1f6f5djsne303fcd7e03d';
const RAPIDAPI_HOST = 'shazam-core.p.rapidapi.com';

const BASE_URL = 'https://shazam-core.p.rapidapi.com';

const headers = {
  'X-RapidAPI-Key': RAPIDAPI_KEY,
  'X-RapidAPI-Host': RAPIDAPI_HOST,
};

// Helper function to make API calls
const makeApiCall = async (endpoint, params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const url = `${BASE_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;
    
    console.log('Making API call to:', url);
    console.log('With headers:', headers);
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('API response data:', data);
    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Shazam Core API Functions
export const shazamApi = {
  // Search for tracks with suggestions
  searchSuggest: async (query) => {
    return makeApiCall('/v1/search/suggest', {
      query: query,
    });
  },

  // Search for tracks using multi search
  search: async (query, limit = 20, offset = 0, searchType = 'SONGS') => {
    return makeApiCall('/v1/search/multi', {
      query: query,
      offset: offset.toString(),
      search_type: searchType,
    });
  },

  // Get track details
  getTrack: async (id) => {
    return makeApiCall(`/v1/tracks/details`, {
      track_id: id,
    });
  },

  // Get track lyrics
  getLyrics: async (id) => {
    return makeApiCall(`/v1/tracks/details`, {
      track_id: id,
    });
  },

  // Get top charts by country
  getTopCharts: async (countryCode = 'US') => {
    return makeApiCall('/v1/charts/country', {
      country_code: countryCode,
    });
  },

  // Get top charts worldwide
  getWorldwideCharts: async (countryCode = 'US') => {
    return makeApiCall('/v1/charts/world', {
      country_code: countryCode,
    });
  },

  // Get top charts by country (alternative endpoint)
  getCountryCharts: async (countryCode = 'US') => {
    return makeApiCall('/v1/charts/country', {
      country_code: countryCode,
    });
  },

  // Get artist details
  getArtist: async (id) => {
    return makeApiCall(`/v1/artists/details`, {
      artist_id: id,
    });
  },

  // Get artist top tracks
  getArtistTopTracks: async (id) => {
    return makeApiCall(`/v1/artists/toptracks`, {
      artist_id: id,
    });
  },

  // Get related tracks
  getRelatedTracks: async (id) => {
    return makeApiCall(`/v1/tracks/related`, {
      track_id: id,
    });
  },

  // Get genre charts
  getGenreCharts: async (genre = 'pop') => {
    return makeApiCall('/v1/charts/genre-world', {
      genre: genre,
    });
  },
};

// Data transformation helpers for Apple Music API data
export const transformTrack = (track) => {
  if (!track) return null;
  
  console.log('Transforming track:', track);
  
  // Handle Apple Music API structure
  if (track.attributes) {
    const attrs = track.attributes;
    return {
      id: track.id || Math.random().toString(36).substr(2, 9),
      title: attrs.name || 'Unknown Track',
      artist: attrs.artistName || 'Unknown Artist',
      album: attrs.albumName || 'Unknown Album',
      cover: attrs.artwork?.url || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center',
      duration: attrs.durationInMillis ? Math.floor(attrs.durationInMillis / 1000) : 180,
      preview_url: attrs.previews?.[0]?.url || null,
      external_url: attrs.url || null,
      popularity: 0, // Apple Music doesn't provide popularity in this endpoint
      explicit: attrs.contentRating === 'explicit',
      genre: attrs.genreNames?.[0] || 'Unknown',
      year: attrs.releaseDate ? new Date(attrs.releaseDate).getFullYear() : new Date().getFullYear(),
    };
  }
  
  // Handle Shazam Core API structure (tracks.hits[].track)
  if (track.track) {
    const trackData = track.track;
    const title = trackData.title || 'Unknown Track';
    const artist = trackData.subtitle || 'Unknown Artist';
    const cover = trackData.images?.coverart || trackData.images?.background || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center';
    
    // Find preview URL from hub actions
    let preview_url = null;
    if (trackData.hub?.actions) {
      const previewAction = trackData.hub.actions.find(action => action.type === 'uri');
      if (previewAction) {
        preview_url = previewAction.uri;
      }
    }
    
    return {
      id: trackData.key || Math.random().toString(36).substr(2, 9),
      title: title,
      artist: artist,
      album: 'Unknown Album', // Shazam doesn't provide album info in this structure
      cover: cover,
      duration: 180, // Default duration since Shazam doesn't provide it
      preview_url: preview_url,
      external_url: trackData.url || null,
      popularity: 0,
      explicit: trackData.hub?.explicit || false,
      genre: 'Unknown',
      year: new Date().getFullYear(),
    };
  }
  
  // Fallback for other API structures (Shazam, etc.)
  const title = track.title || track.heading?.title || track.name || track.song || 'Unknown Track';
  const artist = track.subtitle || track.heading?.subtitle || track.artist || track.artist_name || 'Unknown Artist';
  const album = track.sections?.[0]?.metadata?.[0]?.text || track.album || track.album_name || 'Unknown Album';
  const cover = track.images?.coverart || track.images?.background || track.cover || track.artwork || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center';
  
  return {
    id: track.key || track.id || track.track_id || Math.random().toString(36).substr(2, 9),
    title: title,
    artist: artist,
    album: album,
    cover: cover,
    duration: track.duration || track.length || 180,
    preview_url: track.hub?.actions?.[0]?.uri || track.preview_url || null,
    external_url: track.url || track.external_url || null,
    popularity: track.stats?.plays || track.popularity || 0,
    explicit: false,
    genre: track.genres?.primary || track.genre || 'Unknown',
    year: track.sections?.[0]?.metadata?.[1]?.text || track.year || new Date().getFullYear(),
  };
};

export const transformAlbum = (track) => {
  if (!track) return null;
  
  // Handle Shazam Core API structure (tracks.hits[].track)
  if (track.track) {
    const trackData = track.track;
    return {
      id: trackData.key || Math.random().toString(36).substr(2, 9),
      title: trackData.title || 'Unknown Album',
      artist: trackData.subtitle || 'Unknown Artist',
      cover: trackData.images?.coverart || trackData.images?.background || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center',
      year: new Date().getFullYear(),
      tracks: 1, // Shazam doesn't provide album track count
      external_url: trackData.url || null,
      album_type: 'album',
      is_playable: true,
      tracks_list: [trackData],
    };
  }
  
  return {
    id: track.key || track.id || Math.random().toString(36).substr(2, 9),
    title: track.sections?.[0]?.metadata?.[0]?.text || track.title || 'Unknown Album',
    artist: track.subtitle || track.heading?.subtitle || 'Unknown Artist',
    cover: track.images?.coverart || track.images?.background || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center',
    year: track.sections?.[0]?.metadata?.[1]?.text || new Date().getFullYear(),
    tracks: 1, // Shazam doesn't provide album track count
    external_url: track.url || null,
    album_type: 'album',
    is_playable: true,
    tracks_list: [track],
  };
};

export const transformArtist = (track) => {
  if (!track) return null;
  
  // Handle Shazam Core API structure (tracks.hits[].track)
  if (track.track) {
    const trackData = track.track;
    return {
      id: trackData.artists?.[0]?.id || trackData.key || Math.random().toString(36).substr(2, 9),
      name: trackData.subtitle || 'Unknown Artist',
      image: trackData.images?.coverart || trackData.images?.background || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center',
      followers: '0',
      popularity: 0,
      genres: ['Unknown'],
      external_url: trackData.url || null,
    };
  }
  
  return {
    id: track.artists?.[0]?.id || track.key || Math.random().toString(36).substr(2, 9),
    name: track.subtitle || track.heading?.subtitle || 'Unknown Artist',
    image: track.images?.coverart || track.images?.background || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center',
    followers: '0',
    popularity: track.stats?.plays || 0,
    genres: [track.genres?.primary || 'Unknown'],
    external_url: track.url || null,
  };
};

export const transformPlaylist = (track) => {
  if (!track) return null;
  
  // Handle Shazam Core API structure (tracks.hits[].track)
  if (track.track) {
    const trackData = track.track;
    return {
      id: trackData.key || Math.random().toString(36).substr(2, 9),
      title: trackData.title || 'Unknown Playlist',
      description: trackData.subtitle || '',
      cover: trackData.images?.coverart || trackData.images?.background || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center',
      creator: trackData.subtitle || 'Unknown',
      tracks: 1,
      external_url: trackData.url || null,
    };
  }
  
  return {
    id: track.key || track.id || Math.random().toString(36).substr(2, 9),
    title: track.title || track.heading?.title || 'Unknown Playlist',
    description: track.subtitle || track.heading?.subtitle || '',
    cover: track.images?.coverart || track.images?.background || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center',
    creator: track.subtitle || 'Unknown',
    tracks: 1,
    external_url: track.url || null,
  };
};

// Popular search terms for suggestions
export const popularSearchTerms = [
  'The Weeknd',
  'Taylor Swift',
  'Drake',
  'Ed Sheeran',
  'Adele',
  'Dua Lipa',
  'Justin Bieber',
  'Lady Gaga',
  'Rihanna',
  'Post Malone',
  'Billie Eilish',
  'Ariana Grande',
  'Bad Bunny',
  'Kendrick Lamar',
  'Travis Scott'
];

// Fallback data for when API is not available
export const fallbackData = {
  albums: [
    {
      id: '1',
      title: 'After Hours',
      artist: 'The Weeknd',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center',
      year: 2020,
      tracks: 14,
    },
    {
      id: '2',
      title: 'Future Nostalgia',
      artist: 'Dua Lipa',
      cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&crop=center',
      year: 2020,
      tracks: 11,
    },
    {
      id: '3',
      title: 'Folklore',
      artist: 'Taylor Swift',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center',
      year: 2020,
      tracks: 16,
    },
    {
      id: '4',
      title: 'Chromatica',
      artist: 'Lady Gaga',
      cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&crop=center',
      year: 2020,
      tracks: 16,
    },
    {
      id: '5',
      title: 'Planet Her',
      artist: 'Doja Cat',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center',
      year: 2021,
      tracks: 14,
    },
    {
      id: '6',
      title: '÷ (Divide)',
      artist: 'Ed Sheeran',
      cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&crop=center',
      year: 2017,
      tracks: 12,
    },
    {
      id: '7',
      title: '25',
      artist: 'Adele',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center',
      year: 2015,
      tracks: 11,
    },
    {
      id: '8',
      title: '1989',
      artist: 'Taylor Swift',
      cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&crop=center',
      year: 2014,
      tracks: 13,
    },
    {
      id: '9',
      title: 'Purpose',
      artist: 'Justin Bieber',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center',
      year: 2015,
      tracks: 13,
    },
    {
      id: '10',
      title: 'Starboy',
      artist: 'The Weeknd',
      cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&crop=center',
      year: 2016,
      tracks: 18,
    },
    {
      id: '11',
      title: 'Lover',
      artist: 'Taylor Swift',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center',
      year: 2019,
      tracks: 18,
    },
    {
      id: '12',
      title: '21',
      artist: 'Adele',
      cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&crop=center',
      year: 2011,
      tracks: 11,
    },
  ],
  recentlyPlayed: [
    {
      id: '1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&crop=center',
      duration: 200,
    },
    {
      id: '2',
      title: 'Dance Monkey',
      artist: 'Tones and I',
      album: 'The Kids Are Coming',
      cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop&crop=center',
      duration: 209,
    },
  ],
  genres: [
    { id: 'pop', name: 'Pop', color: '#1db954', icon: '🎵' },
    { id: 'rock', name: 'Rock', color: '#e91429', icon: '🎸' },
    { id: 'hip-hop', name: 'Hip Hop', color: '#ba5d07', icon: '🎤' },
    { id: 'electronic', name: 'Electronic', color: '#056952', icon: '🎧' },
    { id: 'jazz', name: 'Jazz', color: '#8d67ab', icon: '🎷' },
    { id: 'classical', name: 'Classical', color: '#e8115b', icon: '🎻' },
    { id: 'country', name: 'Country', color: '#509bf5', icon: '🤠' },
    { id: 'r-n-b', name: 'R&B', color: '#ff6437', icon: '🎹' },
  ],
};

export default shazamApi; 