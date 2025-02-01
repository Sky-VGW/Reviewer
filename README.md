# Reviewer - An App Store Review Tracker

A React/TypeScript application that fetches and displays App Store reviews for specified iOS applications.

## Features
- Fetches reviews from Apple's RSS feed
- Stores reviews locally in JSON format
- Auto-refreshes reviews every 5 minutes
- Displays reviews with star ratings and timestamps
- Filters reviews from the last 30 days

## Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

## Project Structure
```
reviewer/
├── dist/               # Compiled files (git-ignored)
├── mockDb/            # Local JSON storage
│   ├── apps.json      # App configurations
│   └── reviews.json   # Stored reviews
├── src/
│   ├── client/        # Frontend React code
│   │   ├── components/
│   │   └── tests/
│   └── server/        # Backend Express code
│       ├── services/
│       └── utils/
├── package.json
└── tsconfig.json
```

## Installation & Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd reviewer
```

2. Install dependencies:
```bash
npm install
```

3. Configure your app (optional, example app included):
Edit `mockDb/apps.json` to include your App Store app information:
```json
{
  "apps": [
    {
      "id": "YOUR_APP_ID",
      "name": "Your App Name",
      "rssFeedUrl": "https://itunes.apple.com/us/rss/customerreviews/id=YOUR_APP_ID/sortBy=mostRecent/page=1/json"
    }
  ]
}
```

## Development

1. Start the development server:
```bash
npm run dev:server
```

2. In a separate terminal, start the client:
```bash
npm run dev:client
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## Building for Production

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Testing

Run the test suite:
```bash
npm test
```

## Notes
- The app polls for new reviews every 15 minutes
- The frontend refreshes its display every 5 minutes
- Reviews older than 30 days are automatically filtered out
- The `mockDb` directory stores reviews locally in JSON format
- The `dist` directory is git-ignored and will be created during build
