const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Firebase Admin SDK
// For a production deployment, use default credentials or a service account key
if (process.env.FIREBASE_PROJECT_ID) {
  try {
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
    console.log('Firebase Admin initialized successfully.');
  } catch (error) {
    console.error('Firebase Admin initialization error', error.stack);
  }
} else {
  console.warn('WARNING: FIREBASE_PROJECT_ID is not set. Firebase Admin Auth/Firestore will be mocked.');
}

const db = process.env.FIREBASE_PROJECT_ID ? admin.firestore() : null;
const auth = process.env.FIREBASE_PROJECT_ID ? admin.auth() : null;

module.exports = { admin, db, auth };
