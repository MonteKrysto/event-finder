import { createActor } from "xstate";
import { createQuestionFlowMachine } from "@/machines/questionFlowMachine"; // XState machine

interface QuestionFlowService {
  start(): void;
  answer(): void;
  skip(): void;
  getState(): string;
  getCurrentQuestion(): string | null;
}

const createQuestionFlowService = (initialQuestions: any[]): QuestionFlowService => {
  const actor = createActor(createQuestionFlowMachine(initialQuestions), {} /* Options argument */).start();

  return {
    start: () => actor.send({ type: 'START' }),
    answer: () => actor.send({ type: 'ANSWER' }),
    skip: () => actor.send({ type: 'SKIP' }),
    getState: () => actor.getSnapshot().value as string,  // Use getSnapshot() to get the state
    getCurrentQuestion: () => actor.getSnapshot().context.currentQuestion?.question || null,
  };
}

export { createQuestionFlowService };