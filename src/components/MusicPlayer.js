import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Typography,
  Slider,
  Stack,
  Avatar,
  Tooltip,
  LinearProgress,
  Fade,
  Grow,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  SkipPrevious,
  SkipNext,
  Shuffle,
  Repeat,
  VolumeUp,
  VolumeDown,
  VolumeOff,
  QueueMusic,
  Devices,
} from '@mui/icons-material';

const MusicPlayer = ({
  track,
  isPlaying,
  onPlayPause,
  onSkipNext,
  onSkipPrevious,
  volume,
  onVolumeChange,
  queue,
  onAddToQueue,
  onRemoveFromQueue,
  onClearQueue,
  playHistory,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVolume, setShowVolume] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none'); // none, one, all
  const [shuffleOn, setShuffleOn] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const audioRef = useRef(new Audio());

  // Audio playback logic
  useEffect(() => {
    const audio = audioRef.current;
    
    if (track && track.preview_url) {
      audio.src = track.preview_url;
      audio.volume = volume / 100;
      
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });
      
      audio.addEventListener('timeupdate', () => {
        if (!isDragging) {
          setCurrentTime(audio.currentTime);
        }
      });
      
      audio.addEventListener('ended', () => {
        setCurrentTime(0);
        onPlayPause(); // Stop playing
      });
      
      audio.addEventListener('error', () => {
        console.error('Audio playback error');
      });
      
      return () => {
        audio.removeEventListener('loadedmetadata', () => {});
        audio.removeEventListener('timeupdate', () => {});
        audio.removeEventListener('ended', () => {});
        audio.removeEventListener('error', () => {});
      };
    }
  }, [track, volume, isDragging, onPlayPause]);

  // Handle play/pause
  useEffect(() => {
    const audio = audioRef.current;
    
    if (isPlaying && track?.preview_url) {
      audio.play().catch(error => {
        console.error('Failed to play audio:', error);
        onPlayPause(); // Stop playing on error
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, track, onPlayPause]);

  // Handle volume changes
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume / 100;
  }, [volume]);

  // Set duration when track changes
  useEffect(() => {
    if (track) {
      setDuration(track.duration || 180);
      setCurrentTime(0);
    }
  }, [track]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (event, newValue) => {
    const audio = audioRef.current;
    setCurrentTime(newValue);
    if (audio && !isNaN(audio.duration)) {
      audio.currentTime = newValue;
    }
  };

  const handleProgressMouseDown = () => {
    setIsDragging(true);
  };

  const handleProgressMouseUp = () => {
    setIsDragging(false);
  };

  const handleVolumeChange = (event, newValue) => {
    onVolumeChange(newValue);
  };

  const handleRepeatClick = () => {
    setRepeatMode(prev => {
      if (prev === 'none') return 'one';
      if (prev === 'one') return 'all';
      return 'none';
    });
  };

  const handleShuffleClick = () => {
    setShuffleOn(!shuffleOn);
  };

  const getRepeatIcon = () => {
    if (repeatMode === 'one') return <Repeat sx={{ fontSize: 16 }} />;
    if (repeatMode === 'all') return <Repeat sx={{ fontSize: 20 }} />;
    return <Repeat />;
  };

  const getRepeatColor = () => {
    if (repeatMode === 'none') return '#b3b3b3';
    return '#1db954';
  };

  const getShuffleColor = () => {
    return shuffleOn ? '#1db954' : '#b3b3b3';
  };

  if (!track) return null;

  return (
    <Fade in={true} timeout={500}>
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 100,
          backgroundColor: 'rgba(24, 24, 24, 0.98)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 0,
          zIndex: 1000,
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)',
        }}
        elevation={0}
      >
        {/* Progress Bar */}
        <Box sx={{ position: 'relative', width: '100%', height: 4 }}>
          <LinearProgress
            variant="determinate"
            value={(currentTime / duration) * 100}
            sx={{
              height: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#1db954',
                transition: 'transform 0.1s linear',
              },
            }}
          />
        </Box>

        <Box sx={{ p: 2, height: 'calc(100% - 4px)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
            {/* Left Section - Track Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
              <Grow in={true} timeout={600}>
                <Avatar
                  src={track.cover}
                  sx={{
                    width: 56,
                    height: 56,
                    mr: 2,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {track.title?.charAt(0)}
                </Avatar>
              </Grow>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    lineHeight: 1.2,
                    mb: 0.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    },
                  }}
                >
                  {track.title}
                  {!track.preview_url && (
                    <Typography
                      component="span"
                      sx={{
                        color: '#ff6b6b',
                        fontSize: '0.7rem',
                        ml: 1,
                        fontStyle: 'italic',
                      }}
                    >
                      (Preview only)
                    </Typography>
                  )}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#b3b3b3',
                    fontSize: '0.75rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      color: '#ffffff',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    },
                  }}
                >
                  {track.artist}
                </Typography>
              </Box>

            </Box>

            {/* Center Section - Playback Controls */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <Tooltip title={shuffleOn ? "Disable shuffle" : "Enable shuffle"}>
                  <IconButton
                    onClick={handleShuffleClick}
                    sx={{
                      color: getShuffleColor(),
                      '&:hover': {
                        color: shuffleOn ? '#1ed760' : '#ffffff',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Shuffle />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Previous">
                  <IconButton
                    onClick={onSkipPrevious}
                    disabled={!playHistory || playHistory.length <= 1}
                    sx={{
                      color: playHistory && playHistory.length > 1 ? '#b3b3b3' : '#535353',
                      '&:hover': {
                        color: playHistory && playHistory.length > 1 ? '#ffffff' : '#535353',
                        transform: playHistory && playHistory.length > 1 ? 'scale(1.1)' : 'scale(1)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <SkipPrevious />
                  </IconButton>
                </Tooltip>
                
                <Grow in={true} timeout={400}>
                  <IconButton
                    onClick={onPlayPause}
                    sx={{
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      width: 48,
                      height: 48,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                      '&:hover': {
                        backgroundColor: '#f2f2f2',
                        transform: 'scale(1.05)',
                        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {isPlaying ? <Pause /> : <PlayArrow />}
                  </IconButton>
                </Grow>
                
                <Tooltip title="Next">
                  <IconButton
                    onClick={onSkipNext}
                    disabled={!queue || queue.length === 0}
                    sx={{
                      color: queue && queue.length > 0 ? '#b3b3b3' : '#535353',
                      '&:hover': {
                        color: queue && queue.length > 0 ? '#ffffff' : '#535353',
                        transform: queue && queue.length > 0 ? 'scale(1.1)' : 'scale(1)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <SkipNext />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title={`Repeat ${repeatMode === 'one' ? '(one)' : repeatMode === 'all' ? '(all)' : '(off)'}`}>
                  <IconButton
                    onClick={handleRepeatClick}
                    sx={{
                      color: getRepeatColor(),
                      '&:hover': {
                        color: repeatMode === 'none' ? '#ffffff' : '#1ed760',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {getRepeatIcon()}
                  </IconButton>
                </Tooltip>
              </Stack>
              
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: 400 }}>
                <Typography variant="caption" sx={{ color: '#b3b3b3', mr: 1, fontSize: '0.75rem' }}>
                  {formatTime(currentTime)}
                </Typography>
                <Slider
                  value={currentTime}
                  max={duration}
                  onChange={handleProgressChange}
                  onMouseDown={handleProgressMouseDown}
                  onMouseUp={handleProgressMouseUp}
                  sx={{
                    color: '#1db954',
                    height: 4,
                    '& .MuiSlider-thumb': {
                      width: 12,
                      height: 12,
                      backgroundColor: '#1db954',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                      '&:hover': {
                        boxShadow: '0 0 0 8px rgba(29, 185, 84, 0.16)',
                        transform: 'scale(1.2)',
                      },
                      '&.Mui-active': {
                        boxShadow: '0 0 0 12px rgba(29, 185, 84, 0.16)',
                      },
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: '#1db954',
                      height: 4,
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      height: 4,
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: '#b3b3b3', ml: 1, fontSize: '0.75rem' }}>
                  {formatTime(duration)}
                </Typography>
              </Box>
            </Box>

            {/* Right Section - Volume and Additional Controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'flex-end', gap: 1 }}>
              <Tooltip title="Queue">
                <IconButton
                  sx={{
                    color: '#b3b3b3',
                    '&:hover': {
                      color: '#ffffff',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <QueueMusic />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Connect to a device">
                <IconButton
                  sx={{
                    color: '#b3b3b3',
                    '&:hover': {
                      color: '#ffffff',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Devices />
                </IconButton>
              </Tooltip>
              
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: 120,
                  position: 'relative',
                }}
                onMouseEnter={() => setShowVolume(true)}
                onMouseLeave={() => setShowVolume(false)}
              >
                <Tooltip title={volume === 0 ? "Unmute" : "Mute"}>
                  <IconButton
                    onClick={() => onVolumeChange(volume === 0 ? 50 : 0)}
                    sx={{
                      color: '#b3b3b3',
                      '&:hover': {
                        color: '#ffffff',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {volume === 0 ? <VolumeOff /> : volume < 50 ? <VolumeDown /> : <VolumeUp />}
                  </IconButton>
                </Tooltip>
                
                <Fade in={showVolume} timeout={200}>
                  <Slider
                    value={volume}
                    onChange={handleVolumeChange}
                    orientation="horizontal"
                    sx={{
                      color: '#1db954',
                      height: 4,
                      '& .MuiSlider-thumb': {
                        width: 12,
                        height: 12,
                        backgroundColor: '#1db954',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                        '&:hover': {
                          boxShadow: '0 0 0 8px rgba(29, 185, 84, 0.16)',
                        },
                      },
                      '& .MuiSlider-track': {
                        backgroundColor: '#1db954',
                      },
                      '& .MuiSlider-rail': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  />
                </Fade>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Fade>
  );
};

export default MusicPlayer; 