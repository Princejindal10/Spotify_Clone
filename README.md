# Spotify 2.0 Clone

A modern, feature-rich music streaming application built with React.js and Material-UI, inspired by Spotify's design and functionality.

## 🎵 Features

### Core Features
- **Music Player**: Full-featured music player with play/pause, skip, shuffle, repeat controls
- **Playlists**: Create, manage, and play music playlists
- **Search Functionality**: Search for songs, albums, artists, and playlists
- **Album Support**: Browse and play complete albums
- **Artist Pages**: Detailed artist profiles with popular tracks and albums
- **Genre Browsing**: Explore music by different genres

### Enhanced Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Theme**: Beautiful dark theme with Spotify-inspired color scheme
- **Smooth Animations**: Hover effects and transitions for better user experience
- **Volume Control**: Adjustable volume with visual feedback
- **Progress Tracking**: Real-time playback progress with seek functionality
- **Queue Management**: Add tracks to queue and manage playback order
- **Like/Favorite**: Like songs and manage favorites
- **User Library**: Personal library with liked songs, playlists, and saved albums

### UI/UX Features
- **Modern Interface**: Clean, intuitive design with Material-UI components
- **Hover Effects**: Interactive elements with smooth hover animations
- **Custom Scrollbars**: Styled scrollbars matching the theme
- **Loading States**: Smooth loading transitions
- **Accessibility**: Keyboard navigation and screen reader support

## 🛠️ Technology Stack

- **Frontend**: React.js 18
- **UI Framework**: Material-UI (MUI) v5
- **Routing**: React Router DOM v6
- **Styling**: Emotion (CSS-in-JS)
- **Icons**: Material Icons
- **Build Tool**: Create React App

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Sidebar.js      # Navigation sidebar
│   ├── Header.js       # Top navigation header
│   └── MusicPlayer.js  # Music player controls
├── pages/              # Application pages
│   ├── Home.js         # Home dashboard
│   ├── Search.js       # Search functionality
│   ├── Library.js      # User library
│   ├── Playlist.js     # Playlist details
│   ├── Album.js        # Album details
│   └── Artist.js       # Artist profile
├── App.js              # Main application component
├── index.js            # Application entry point
└── index.css           # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd spotify-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (not recommended)

## 🎨 Design System

### Color Palette
- **Primary Green**: `#1db954` (Spotify Green)
- **Secondary Green**: `#1ed760` (Hover Green)
- **Background**: `#121212` (Dark Background)
- **Surface**: `#282828` (Card Background)
- **Text Primary**: `#ffffff` (White Text)
- **Text Secondary**: `#b3b3b3` (Gray Text)

### Typography
- **Font Family**: Roboto (Google Fonts)
- **Weights**: 300, 400, 500, 700
- **Responsive**: Scales appropriately across devices

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with sidebar navigation
- **Tablet**: Adaptive layout with collapsible sidebar
- **Mobile**: Mobile-first design with touch-friendly controls

## 🔧 Customization

### Adding New Features
1. Create new components in the `components/` directory
2. Add new pages in the `pages/` directory
3. Update routing in `App.js`
4. Add any new dependencies to `package.json`

### Styling Customization
- Modify theme colors in `App.js` (darkTheme object)
- Update global styles in `src/index.css`
- Customize component styles using Material-UI's `sx` prop

## 🎯 Key Features Implementation

### Music Player
- Real-time progress tracking
- Volume control with slider
- Playback controls (play/pause, skip, shuffle, repeat)
- Queue management
- Like/favorite functionality

### Search & Discovery
- Multi-category search (songs, albums, artists, playlists)
- Filter by genre
- Search suggestions
- Recent searches

### Library Management
- Liked songs collection
- User-created playlists
- Saved albums
- Recently played tracks

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy automatically on push to main branch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Spotify's design and functionality
- Built with Material-UI for consistent, beautiful components
- Uses React Router for seamless navigation
- Icons provided by Material Icons

## 📞 Support

For support, email support@spotifyclone.com or create an issue in the repository.

---

**Note**: This is a demo application for educational purposes. It does not include actual music streaming functionality and uses placeholder data. 