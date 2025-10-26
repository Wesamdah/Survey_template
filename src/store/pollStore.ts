import { create } from "zustand";

export interface AnswerQuestion {
  id: number;
  questionId: number;
  text: string;
  points: number;
}

export interface Question {
  id: number;
  text: string;
  pollId: number;
  answers: Array<AnswerQuestion>;
}

export interface Poll {
  id: number;
  title: string;
  description: string;
  questions: Array<Question>;
  createdAt: string;
}

interface PollStore {
  polls: Array<Poll>;
  selectedPoll: Poll | null;
  setPolls: (polls: Array<Poll>) => void;
  setSelectedPoll: (pollId: number) => void;
}

export const usePollStore = create<PollStore>((set, get) => ({
  polls: [],
  selectedPoll: null,
  setPolls: (polls) => set({ polls }),

  setSelectedPoll: (pollId) => {
    const found = get().polls.find((poll) => poll.id === pollId) || null;
    set({ selectedPoll: found });
  },
}));

interface AnswersPayload {
  questionId: number;
  answerId: number;
}

interface UserAnswers {
  answers: Array<AnswersPayload> | null;
  setAnswers: (answers: Array<AnswersPayload>) => void;
}

export const useAnswersStore = create<UserAnswers>((set) => ({
  answers: [],
  setAnswers: (answers) => set({ answers }),
}));
