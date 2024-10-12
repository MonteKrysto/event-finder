// import { createActor } from 'xstate';
// import { questionConfigMachine } from '@/machines/questionConfigMachine';

// // Define the Question type
// export interface Question {
//   id: number;
//   question: string;
//   type: 'text' | 'multiple-choice';
//   options?: string[];
// }

// interface QuestionConfigService {
//   addQuestion(question: Omit<Question, 'id'>): void;
//   editQuestion(id: number, question: Partial<Question>): void;
//   deleteQuestion(id: number): void;
//   reorderQuestions(questions: Question[]): void;
//   getQuestions(): Question[];
// }

// export function createQuestionConfigService(): QuestionConfigService {
//   const actor = createActor(questionConfigMachine, {}).start();

//   return {
//     // addQuestion: (question) => actor.send({ type: 'ADD_QUESTION', question }),
//     addQuestion(question: Omit<Question, 'id'>): string | null {
//       // Dispatch the event to the state machine
//       actor.send({ type: 'ADD_QUESTION', question });
      
//       // Use getSnapshot() to get the updated state after the event is processed
//       const snapshot = actor.getSnapshot();
      
//       // Retrieve the error message or null from the state machine's context
//       return snapshot.context.errorMessage;
//     },    
//     editQuestion: (id, question) => actor.send({ type: 'EDIT_QUESTION', id, question }),
//     deleteQuestion: (id) => actor.send({ type: 'DELETE_QUESTION', id }),
//     reorderQuestions: (questions: Question[]) => actor.send({ type: 'REORDER_QUESTIONS', questions }),
//     getQuestions: () => actor.getSnapshot().context.questions,
//   };
// }

import { createActor } from 'xstate';
import { questionConfigMachine } from '@/machines/questionConfigMachine';

// Define the Question type
export interface Question {
  id: number;
  question: string;
  type: 'text' | 'multiple-choice';
  options?: string[];
}

interface QuestionConfigService {
  addQuestion(question: Omit<Question, 'id'>): void;
  editQuestion(id: number, question: Partial<Question>): void;
  deleteQuestion(id: number): void;
  reorderQuestions(fromIndex: number, toIndex: number): void;  // Update to use indices
  getQuestions(): Question[];
}

export function createQuestionConfigService(): QuestionConfigService {
  const actor = createActor(questionConfigMachine, {}).start();
  console.log(actor.getSnapshot());

  return {
    addQuestion(question: Omit<Question, 'id'>): string | null {
      // Dispatch the event to the state machine
      actor.send({ type: 'ADD_QUESTION', question });
      
      // Use getSnapshot() to get the updated state after the event is processed
      const snapshot = actor.getSnapshot();
      
      // Retrieve the error message or null from the state machine's context
      return snapshot.context.errorMessage;
    },    
    editQuestion: (id, question) => actor.send({ type: 'EDIT_QUESTION', id, question }),
    deleteQuestion: (id) => actor.send({ type: 'DELETE_QUESTION', id }),
    
    // Updated reorderQuestions method using fromIndex and toIndex
    reorderQuestions(fromIndex: number, toIndex: number): void {
      actor.send({ type: 'REORDER_QUESTIONS', fromIndex, toIndex });
    },
    
    getQuestions: () => actor.getSnapshot().context.questions,
  };
}
