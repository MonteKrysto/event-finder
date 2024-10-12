// src/contexts/QuestionContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Question {
  id: number;
  question: string;
  type: string;
  options: string[];
}

interface QuestionContextType {
  questions: Question[];
  addQuestion: (newQuestion: Question) => void;
  editQuestion: (updatedQuestion: Question) => void;
  deleteQuestion: (id: number) => void;
}

const QuestionContext = createContext<QuestionContextType | undefined>(undefined);

export function useQuestions() {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error('useQuestions must be used within a QuestionProvider');
  }
  return context;
}

export function QuestionProvider({ children }: { children: ReactNode }) {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const savedQuestions = localStorage.getItem('questions');
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('questions', JSON.stringify(questions));
  }, [questions]);

  const addQuestion = (newQuestion: Question) => {
    setQuestions([...questions, newQuestion]);
  };

  const editQuestion = (updatedQuestion: Question) => {
    setQuestions(questions.map(q => (q.id === updatedQuestion.id ? updatedQuestion : q)));
  };

  const deleteQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <QuestionContext.Provider value={{ questions, addQuestion, editQuestion, deleteQuestion }}>
      {children}
    </QuestionContext.Provider>
  );
}
