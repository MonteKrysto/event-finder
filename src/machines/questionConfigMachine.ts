// import { setup } from 'xstate';

// interface Question {
//   id: number;
//   question: string;
//   type: 'text' | 'multiple-choice';
//   options?: string[];
// }

// interface QuestionConfigContext {
//   questions: Question[];
//   errorMessage: string | null;
// }

// type QuestionConfigEvents =
//   | { type: 'ADD_QUESTION'; question: Omit<Question, 'id'> }
//   | { type: 'EDIT_QUESTION'; id: number; question: Partial<Question> }
//   | { type: 'DELETE_QUESTION'; id: number }
//   | { type: 'REORDER_QUESTIONS'; questions: Question[] }  // Define 'questions' for REORDER_QUESTIONS
//   | { type: 'RESET_ERROR' };

// export const questionConfigMachine = setup({
//   types: {
//     context: {} as QuestionConfigContext,
//     events: {} as QuestionConfigEvents,
//   },
//   actions: {
//     addQuestion: ({ context, event }) => {
//       if (event.type === 'ADD_QUESTION') {
//         const duplicate = context.questions.some(q => q.question.toLowerCase() === event.question.question.toLowerCase());
//         if (duplicate) {
//           context.errorMessage = 'This question already exists.';
//           return 'This question already exists.'; // Return the error message
//         } else {
//           context.questions.push({
//             id: Date.now(),
//             ...event.question,
//           });
//           context.errorMessage = null;
//           return null; // Return null on success
//         }
//       }
//     },    
//     editQuestion: ({ context, event }) => {
//       if (event.type === 'EDIT_QUESTION') {
//         const index = context.questions.findIndex((q) => q.id === event.id);
//         if (index !== -1) {
//           context.questions[index] = { ...context.questions[index], ...event.question };
//           context.errorMessage = null;
//         }
//       }
//     },
//     deleteQuestion: ({ context, event }) => {
//       if (event.type === 'DELETE_QUESTION') {
//         context.questions = context.questions.filter((q) => q.id !== event.id);
//       }
//     },
//     reorderQuestions: ({ context, event }) => {
//       if (event.type === 'REORDER_QUESTIONS') {
//         context.questions = event.questions;  // Now event.questions exists
//       }
//     },
//     resetError: ({ context }) => {
//       context.errorMessage = null;
//     }
//   }
// }).createMachine({
//   initial: 'idle',
//   context: {
//     questions: [],
//     errorMessage: null,
//   },
//   states: {
//     idle: {
//       on: {
//         ADD_QUESTION: { actions: 'addQuestion' },
//         EDIT_QUESTION: { actions: 'editQuestion' },
//         DELETE_QUESTION: { actions: 'deleteQuestion' },
//         REORDER_QUESTIONS: { actions: 'reorderQuestions' },  // REORDER_QUESTIONS uses the correct action
//         RESET_ERROR: { actions: 'resetError' }
//       }
//     }
//   }
// });

import { setup } from 'xstate';

interface Question {
  id: number;
  question: string;
  type: 'text' | 'multiple-choice';
  options?: string[];
}

interface QuestionConfigContext {
  questions: Question[];
  errorMessage: string | null;
}

type QuestionConfigEvents =
  | { type: 'ADD_QUESTION'; question: Omit<Question, 'id'> }
  | { type: 'EDIT_QUESTION'; id: number; question: Partial<Question> }
  | { type: 'DELETE_QUESTION'; id: number }
  | { type: 'REORDER_QUESTIONS'; fromIndex: number; toIndex: number }  // Update for reordering using indexes
  | { type: 'RESET_ERROR' };

export const questionConfigMachine = setup({
  types: {
    context: {} as QuestionConfigContext,
    events: {} as QuestionConfigEvents,
  },
  actions: {
    addQuestion: ({ context, event }) => {
      if (event.type === 'ADD_QUESTION') {
        const duplicate = context.questions.some(q => q.question.toLowerCase() === event.question.question.toLowerCase());
        if (duplicate) {
          context.errorMessage = 'This question already exists.';
          return 'This question already exists.'; // Return the error message
        } else {
          context.questions.push({
            id: Date.now(),
            ...event.question,
          });
          context.errorMessage = null;
          return null; // Return null on success
        }
      }
    },    
    editQuestion: ({ context, event }) => {
      if (event.type === 'EDIT_QUESTION') {
        const index = context.questions.findIndex((q) => q.id === event.id);
        if (index !== -1) {
          context.questions[index] = { ...context.questions[index], ...event.question };
          context.errorMessage = null;
        }
      }
    },
    deleteQuestion: ({ context, event }) => {
      if (event.type === 'DELETE_QUESTION') {
        context.questions = context.questions.filter((q) => q.id !== event.id);
      }
    },
    reorderQuestions: ({ context, event }) => {
      if (event.type === 'REORDER_QUESTIONS') {
        const updatedQuestions = [...context.questions];
        const [movedQuestion] = updatedQuestions.splice(event.fromIndex, 1); // Remove the question from its old position
        updatedQuestions.splice(event.toIndex, 0, movedQuestion); // Insert the question at the new position
        context.questions = updatedQuestions;  // Update the context with the reordered questions
      }
    },
    resetError: ({ context }) => {
      context.errorMessage = null;
    }
  }
}).createMachine({
  initial: 'idle',
  context: {
    questions: [],
    errorMessage: null,
  },
  states: {
    idle: {
      on: {
        ADD_QUESTION: { actions: 'addQuestion' },
        EDIT_QUESTION: { actions: 'editQuestion' },
        DELETE_QUESTION: { actions: 'deleteQuestion' },
        REORDER_QUESTIONS: { actions: 'reorderQuestions' },  // Reorder questions with index positions
        RESET_ERROR: { actions: 'resetError' }
      }
    }
  }
});
