"use client";

import { useQuestions } from '@/hooks/useQuestions';
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode, Key } from 'react';

export default function QuestionsPage() {
  const { questions, isLoading, error, saveQuestions, isSaving } = useQuestions();

  const handleSave = () => {
    const currentQuestions = JSON.parse(localStorage.getItem('questions') || '[]');
    saveQuestions(currentQuestions);  // Save the current questions via the custom hook
  };

  if (isLoading) return <div>Loading questions...</div>;
  if (error) return <div>Error loading questions: {error.message}</div>;

  return (
    <div>
      <h1>Manage Questions</h1>
      <button onClick={handleSave} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Questions'}
      </button>
      <ul>
        {questions.map((q: { question: string }, index: Key | null | undefined) => (
          <li key={index}>{q.question}</li>
        ))}
      </ul>
    </div>
  );
}
