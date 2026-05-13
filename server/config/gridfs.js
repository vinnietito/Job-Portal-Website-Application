import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

let gfsBucket = null;

export function initGridFS(connection) {
  gfsBucket = new GridFSBucket(connection.db, { bucketName: 'resumes' });
}

export function getGridFSBucket() {
  if (!gfsBucket) throw new Error('GridFSBucket not initialized');
  return gfsBucket;
}
