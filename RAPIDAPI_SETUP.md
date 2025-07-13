# RapidAPI Setup Guide for Shazam Core API

This guide will help you set up the Shazam Core API through RapidAPI to power your Spotify clone app.

## Step 1: Create a RapidAPI Account

1. Go to [RapidAPI](https://rapidapi.com/) and sign up for a free account
2. Verify your email address

## Step 2: Subscribe to Shazam Core API

1. Visit the [Shazam Core API page](https://rapidapi.com/ytdlfree/api/shazam-core/)
2. Click "Subscribe to Test"
3. Choose the "Basic" plan (free tier)
4. Complete the subscription process

## Step 3: Get Your API Key

1. After subscribing, go to your [RapidAPI Dashboard](https://rapidapi.com/hub)
2. Click on "My Apps" in the left sidebar
3. Create a new app or select an existing one
4. Copy your API key from the "X-RapidAPI-Key" field

## Step 4: Configure Your App

### Option A: Environment Variable (Recommended)

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add your API key:

```env
REACT_APP_RAPIDAPI_KEY=your_rapidapi_key_here
```

3. Replace `your_rapidapi_key_here` with your actual RapidAPI key
4. Restart your development server

### Option B: Direct Configuration

If you prefer to set the API key directly in the code:

1. Open `src/services/api.js`
2. Find this line:
```javascript
const RAPIDAPI_KEY = process.env.REACT_APP_RAPIDAPI_KEY || '97662a06demshca44d10c6fcc87bp19f112jsn1eecb4148ef9';
```
3. Replace the fallback key with your actual API key

## Step 5: Test the API

The app is now configured to use Shazam Core API. You can test it by:

1. Running your React app: `npm start`
2. Navigate to the Search page
3. Try searching for popular artists like "The Weeknd", "Taylor Swift", etc.
4. Check the Home page to see top charts from around the world

## Available API Endpoints

The app uses the following Shazam Core API endpoints:

- **Search Suggestions**: `/v1/search/suggest` - Get search suggestions
- **Multi Search**: `/v1/search/multi` - Search for tracks, artists, albums
- **Track Details**: `/v1/tracks/details` - Get detailed track information
- **Top Charts**: `/v1/charts/country` - Get top charts by country
- **Worldwide Charts**: `/v1/charts/world` - Get worldwide top charts
- **Artist Details**: `/v1/artists/details` - Get artist information
- **Artist Top Tracks**: `/v1/artists/toptracks` - Get artist's top tracks
- **Related Tracks**: `/v1/tracks/related` - Get related tracks
- **Genre Charts**: `/v1/charts/genre-world` - Get charts by genre

## API Response Structure

Shazam Core API returns data in a different format than Spotify. The app includes transformation functions to convert Shazam data to a consistent format:

- **Tracks**: Contains title, subtitle (artist), images, duration, etc.
- **Artists**: Contains name, images, genres, etc.
- **Charts**: Contains arrays of track objects

## Troubleshooting

### Common Issues:

1. **"API call failed" errors**: Check your API key and subscription status
2. **No search results**: Verify your RapidAPI subscription is active
3. **Rate limiting**: The free tier has limits; consider upgrading if needed

### Debug Information:

The app includes console logging to help debug API issues. Check your browser's developer console for:
- API request URLs
- Response data structure
- Error messages

## Rate Limits

The free tier of Shazam Core API includes:
- 100 requests per month
- Basic endpoints access

For production use, consider upgrading to a paid plan for higher limits and additional features.

## Security Notes

- Never commit your API key to version control
- Use environment variables for production deployments
- Monitor your API usage to avoid unexpected charges

## Support

If you encounter issues:
1. Check the [Shazam Core API documentation](https://rapidapi.com/ytdlfree/api/shazam-core/)
2. Review your RapidAPI subscription status
3. Check the browser console for error messages
4. Verify your API key is correctly configured

---

**Note**: This app now uses Shazam Core API instead of Spotify API, providing access to a vast database of music information, charts, and search capabilities. 