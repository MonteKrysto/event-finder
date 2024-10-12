import { setup } from 'xstate';

// Define types for context and events
interface QuestionContext {
  questions: { id: number; question: string; type: string; options?: string[] }[];
  currentIndex: number;
  currentQuestion: { id: number; question: string; type: string; options?: string[] } | null;
}

type QuestionEvents =
  | { type: 'START' }
  | { type: 'ANSWER' }
  | { type: 'SKIP' };

// Set up the machine with types
export const createQuestionFlowMachine = (initialQuestions: any[]) => setup({
  types: {
    context: {} as QuestionContext,
    events: {} as QuestionEvents,
  },
  actions: {
    setCurrentQuestion: ({ context }) => {
      context.currentQuestion = context.questions[context.currentIndex]; // Access context properly
    },
    goToNextQuestion: ({ context }) => {
      context.currentIndex += 1;
      context.currentQuestion = context.questions[context.currentIndex];
    }
  },
  guards: {  // Replace `cond` with `guards`
    hasMoreQuestions: ({ context }) => context.currentIndex < context.questions.length - 1
  }
}).createMachine({
  initial: 'idle',
  context: {
    questions: initialQuestions, // Pass initialQuestions here
    currentIndex: 0,
    currentQuestion: null,
  },
  states: {
    idle: {
      on: {
        START: 'answering',
      },
    },
    answering: {
      entry: 'setCurrentQuestion',
      on: {
        ANSWER: [
          {
            guard: 'hasMoreQuestions',  // Replace `cond` with `guard`
            actions: 'goToNextQuestion',
            target: 'answering',
          },
          {
            target: 'completed',
          },
        ],
        SKIP: [
          {
            guard: 'hasMoreQuestions',  // Replace `cond` with `guard`
            actions: 'goToNextQuestion',
            target: 'answering',
          },
          {
            target: 'completed',
          },
        ],
      },
    },
    completed: {
      type: 'final',
    },
  },
});
