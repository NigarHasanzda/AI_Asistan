// --- TYPES ---
 export interface MockInterviewResponse {
  id: number;
  score?: number;
  feedback?: string;
  [key: string]: any;
}


export interface MyInterviewsParams {
  page?: number;
  pageSize?: number;
}

export interface Question {
  order: number;
  questionText: string;
  answerText?: string | null;
  score?: number;
  feedback?: string | null;
}

export interface Interview {
  id: number;
  mode?: string;
  level?: string;
  role?: string;
  questions?: Question[];
  isCompleted?: boolean;
  totalScore?: number;
}