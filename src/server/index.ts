import express, { Request, Response } from 'express';
import path from 'path';
import { getRecentReviews, pollReviews } from './services/reviewService.js';
import { readAppsDb, __dirname } from './utils/dbUtils.js'; // __dirname points to the utils folder with this import, where it is defined

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../../../dist')));
//serve frontend build at root
app.get('/', (req: Request, res: Response) => {
  return res.sendFile(path.join(__dirname, '../../../dist/index.html'));
});

// Get reviews for all apps or specific app (currently set up for one app)
app.get('/api/reviews/:appId?', async (req: Request, res: Response): Promise<any> => {
  try {
    const { appId } = req.params;
    const reviews = await getRecentReviews(appId);
    return res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Start polling for each app
const startPolling = async () => {
  // access apps to poll from db
  const appsData = await readAppsDb();
  const { apps } = appsData;
  
  // Poll each app every 15 minutes
  apps.forEach(app => {
    setInterval(() => pollReviews(app), 15 * 60 * 1000);
    // Initial poll
    pollReviews(app);
  });
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  startPolling();
}); 