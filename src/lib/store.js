import { create } from 'zustand';
import { persist } from 'zustand/middleware';


export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      mobile: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setMobile: (mobile) => set({ mobile }),

      setTokens: (accessToken, refreshToken) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', accessToken);
          localStorage.setItem('refresh_token', refreshToken);
        }
        set({ accessToken, refreshToken, isAuthenticated: true });
      },

      setUser: (user) => set({ user }),

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
        set({
          user: null,
          mobile: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      checkAuth: () => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('access_token');
          if (token) {
            set({ isAuthenticated: true, accessToken: token });
            return true;
          }
        }
        return false;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        mobile: state.mobile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Exam Store
export const useExamStore = create((set, get) => ({
  questions: [],
  currentQuestion: 0,
  answers: {},
  timeRemaining: 0,
  examStarted: false,
  examSubmitted: false,

  setExamData: (examData) => set({
  questions: examData.questions || [],
  timeRemaining: (examData.total_time ? examData.total_time * 60 : 5400),
  instruction: examData.instruction || "",
  examStarted: false,
}),


  startExam: () => set({ examStarted: true }),

  getFormattedAnswers: () =>
    get().questions.map((q) => ({
      question_id: q.id,
      selected_option_id: typeof get().answers[q.id] === "undefined" ? null : get().answers[q.id],
    })),


  setAnswer: (questionId, optionId) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: optionId },
    })),

  nextQuestion: () =>
    set((state) => ({
      currentQuestion: Math.min(
        state.currentQuestion + 1,
        state.questions.length - 1
      ),
    })),

  previousQuestion: () =>
    set((state) => ({
      currentQuestion: Math.max(state.currentQuestion - 1, 0),
    })),

  goToQuestion: (index) => set({ currentQuestion: index }),

  decrementTime: () =>
    set((state) => ({
      timeRemaining: Math.max(state.timeRemaining - 1, 0),
    })),

  submitExam: () => set({ examSubmitted: true }),

  resetExam: () =>
    set({
      questions: [],
      currentQuestion: 0,
      answers: {},
      timeRemaining: 0,
      examStarted: false,
      examSubmitted: false,
    }),
}));