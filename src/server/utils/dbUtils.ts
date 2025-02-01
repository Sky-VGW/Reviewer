import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { ReviewsDb, AppsDb } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const REVIEWS_DB_PATH = path.join(__dirname, '../../../mockDb/reviews.json');
const APPS_DB_PATH = path.join(__dirname, '../../../mockDb/apps.json');

// IO functions to read databases
export const readReviewsDb = async (): Promise<ReviewsDb> => {
  const data = await fs.readFile(REVIEWS_DB_PATH, 'utf-8');
  return JSON.parse(data);
};

export const readAppsDb = async (): Promise<AppsDb> => {
  const data = await fs.readFile(APPS_DB_PATH, 'utf-8');
  return JSON.parse(data);
};

// IO functions to write to databases
export const writeReviewsDb = async (data: ReviewsDb): Promise<void> => {
  await fs.writeFile(REVIEWS_DB_PATH, JSON.stringify(data, null, 2));
};

export const writeAppsDb = async (data: AppsDb): Promise<void> => {
  await fs.writeFile(APPS_DB_PATH, JSON.stringify(data, null, 2));
};