/**
 * Types and interfaces for the Alkane Chemistry Classroom Game Suite
 * Designed for Romanian High School (Líceum) Chemistry Lessons
 */

export type GameId = 'treasure-hunt' | 'chemical-domino' | 'lab-mystery' | 'error-hunter' | 'refinery-mission';

export interface GameMetadata {
  id: GameId;
  title: string;
  gameType: string;
  pdfTitle: string;
  lessonNumber: number;
  durationMinutes: number;
  shortDescription: string;
  learningFocus: string[];
  themeColor: string;
  badgeBg: string;
  badgeBorder: string;
}

export interface GameResult {
  gameId: GameId;
  gameTitle: string;
  pdfTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  elapsedSeconds: number;
  completedAt: string;
  strengths: string[];
  reviewAreas: string[];
  teacherRecommendation: string;
}
