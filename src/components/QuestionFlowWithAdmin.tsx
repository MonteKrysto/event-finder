import { useState, useEffect } from 'react';
import { createQuestionFlowService } from '@/services/questionFlowService'; // Service that abstracts the state machine

export default function QuestionFlowWithAdmin() {
  const initialQuestions = [
    { id: 1, question: 'What is your favorite color?', type: 'text', options: [] },
    { id: 2, question: 'Select your age range', type: 'multiple-choice', options: ['Under 18', '18-25', '26-35', '35+'] },
    { id: 3, question: 'What is your favorite hobby?', type: 'text', options: [] },
  ];

  const [questionFlow, setQuestionFlow] = useState(() => createQuestionFlowService(initialQuestions));
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [state, setState] = useState<string>('idle');

  useEffect(() => {
    setCurrentQuestion(questionFlow.getCurrentQuestion());
    setState(questionFlow.getState());
  }, [questionFlow]);

  const handleStart = () => {
    questionFlow.start();
    setCurrentQuestion(questionFlow.getCurrentQuestion());
    setState(questionFlow.getState());
  };

  const handleAnswer = () => {
    questionFlow.answer();
    setCurrentQuestion(questionFlow.getCurrentQuestion());
    setState(questionFlow.getState());
  };

  const handleSkip = () => {
    questionFlow.skip();
    setCurrentQuestion(questionFlow.getCurrentQuestion());
    setState(questionFlow.getState());
  };

  return (
    <div>
      {state === 'idle' && (
        <div>
          <h1>Welcome to the question flow!</h1>
          <button onClick={handleStart} className="bg-blue-500 text-white p-2 rounded">
            Start
          </button>
        </div>
      )}

      {state === 'answering' && currentQuestion && (
        <div>
          <h2>{currentQuestion}</h2>
          <input type="text" className="border p-2" placeholder="Enter your answer" />
          <button onClick={handleAnswer} className="bg-green-500 text-white p-2 rounded">
            Answer
          </button>
          <button onClick={handleSkip} className="bg-gray-500 text-white p-2 rounded ml-2">
            Skip
          </button>
        </div>
      )}

      {state === 'completed' && (
        <div>
          <h1>Thank you for completing the questionnaire!</h1>
        </div>
      )}
    </div>
  );
}
