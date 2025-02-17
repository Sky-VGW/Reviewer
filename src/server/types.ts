export interface AppleReviewEntry {
  id: { label: string };
  content: { label: string };
  author: { name: { label: string } };
  'im:rating': { label: string };
  updated: { label: string };
}

export interface AppleApiResponse {
  feed: {
    entry: AppleReviewEntry[];
  };
}

export interface AppStoreReview {
  id: string;
  content: string;
  author: string;
  score: number;
  timestamp: string;
  appId: string;
}

export interface ReviewsDb {
  reviews: AppStoreReview[];
}

export interface AppConfig {
  id: string;
  name: string;
  lastPolled?: string;
}

export interface AppsDb {
  apps: AppConfig[];
}