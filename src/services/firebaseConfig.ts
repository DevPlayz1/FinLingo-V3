/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * FinLingo Firebase Integration Architecture
 * 
 * This module specifies the contract and connection points for plugging in
 * real Firebase Authentication and Cloud Firestore.
 * 
 * Current Status: DEMO MODE (Local Storage Mock Active)
 * 
 * To activate live Firebase:
 * 1. Provision Firestore and Auth via Firebase Setup.
 * 2. Fill in firebaseConfig below or load from environment variables.
 * 3. Swap the calls in `dataService.ts` to query collection('users') and collection('quizzes').
 */

export interface FirebaseConnectionStatus {
  isConfigured: boolean;
  authProvider: 'demo-local' | 'firebase-auth';
  databaseProvider: 'demo-localstorage' | 'cloud-firestore';
  firestoreCollections: {
    users: string;
    tracks: string;
    lessons: string;
    quizResults: string;
    spacedRepetition: string;
    leaderboard: string;
  };
}

export const FIREBASE_STATUS: FirebaseConnectionStatus = {
  isConfigured: false,
  authProvider: 'demo-local',
  databaseProvider: 'demo-localstorage',
  firestoreCollections: {
    users: 'users',
    tracks: 'learning_tracks',
    lessons: 'lessons',
    quizResults: 'quiz_results',
    spacedRepetition: 'spaced_repetition_queue',
    leaderboard: 'leaderboards'
  }
};

/**
 * Expected Firestore Data Schema Documentation for production:
 * 
 * /users/{userId} -> UserProfile
 * /users/{userId}/spaced_repetition/{itemId} -> SpacedRepetitionItem
 * /users/{userId}/quiz_history/{attemptId} -> QuizAttempt
 * /tracks/{trackId} -> LearningTrack
 * /tracks/{trackId}/lessons/{lessonId} -> Lesson
 * /tracks/{trackId}/lessons/{lessonId}/questions/{questionId} -> QuizQuestion
 * /leaderboards/weekly -> Array of top 50 student records
 */
