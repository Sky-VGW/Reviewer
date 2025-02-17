
import type { AppStoreReview, AppConfig, AppleReviewEntry, AppleApiResponse } from '../types.js';
import { readReviewsDb, readAppsDb, writeReviewsDb, writeAppsDb } from '../utils/dbUtils.js';

// type guard to check if entry is from Apple API
const isAppleReview = (entry: AppleReviewEntry | AppStoreReview): entry is AppleReviewEntry => {
  return 'label' in (entry.id as any);
};

// helper function to parse review data
const parseReview = (entry: AppleReviewEntry, appId: string): AppStoreReview => {
  if (!entry) {
    throw new Error('Entry is invalid');
  }
  // if entry is from Apple API, parse it
  if (isAppleReview(entry)) {
    return {
      id: entry.id.label,
      content: entry.content.label,
      author: entry.author.name.label,
      score: parseInt(entry['im:rating'].label),
      timestamp: entry.updated.label,
      appId
    };
  }
  // if not Apple review, it's already in AppStoreReview format
  return entry;
};

// helper function to filter and sort reviews
const filterAndSortReviews = (reviews: AppStoreReview[]): AppStoreReview[] => {
  const dateLimit = new Date();
  //offset is 30 days due to infrequent reviews
  const hoursOffset = 730;
  dateLimit.setHours(dateLimit.getHours() - hoursOffset);
  
  return reviews
    .filter(r => new Date(r.timestamp) > dateLimit)
    .sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
};

// IO function to fetch reviews from Apple API
const fetchReviews = async (appId: string): Promise<AppleApiResponse> => {
  try {
    const rssFeedUrl = `https://itunes.apple.com/us/rss/customerreviews/id=${appId}/sortBy=mostRecent/page=1/json`;
    const response = await fetch(rssFeedUrl);

    if (!response.ok) {
      throw new Error(`App Store API returned ${response.status} for app ${appId}`);
    }

    const rawApiReviews: AppleApiResponse = await response.json();
    // if API data is in expected format return it, otherwise normalize it
    return rawApiReviews?.feed?.entry?.length
    ? rawApiReviews
    : {
      feed: {
        entry: []
      }
    };
  } catch (error) {
    throw new Error(`Failed to fetch reviews from Apple API: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Main service functions
export const getRecentReviews = async (appId?: string | undefined): Promise<AppStoreReview[]> => {
  const db = await readReviewsDb();
  const allReviews = db.reviews;
  
  // if appId is provided, filter reviews by appId
  const selectedReviews = appId 
  ? allReviews.filter((review: AppStoreReview) => review.appId === appId)
  : allReviews;
  
  const filteredReviews = filterAndSortReviews(selectedReviews);
  return filteredReviews;
};

export const pollReviews = async (appConfig: AppConfig): Promise<void> => {
  try {
    const data = await fetchReviews(appConfig.id);
    // get entries from Apple API response
    const entries = data.feed.entry;
    // parse entries into AppStoreReview format
    const newReviews = entries.map(entry => parseReview(entry, appConfig.id));
    // read existing reviews from db
    const reviewsDb = await readReviewsDb();
    // get existing review ids
    const existingIds = new Set(reviewsDb.reviews.map(r => r.id));
    // filter out existing reviews
    const uniqueNewReviews = newReviews.filter(review => !existingIds.has(review.id));
    // write new reviews to db if any
    if (uniqueNewReviews.length > 0) {
      await writeReviewsDb({
        reviews: [...reviewsDb.reviews, ...uniqueNewReviews]
      });
    }
    // update lastPolled timestamp for the app
    const appsDb = await readAppsDb();
    await writeAppsDb({
      apps: appsDb.apps.map(app => 
        app.id === appConfig.id 
        ? { ...app, lastPolled: new Date().toISOString() }
        : app
      )
    });
  } catch (error) {
    console.error(`Error polling reviews for app ${appConfig.id}:`, error)
  }
};