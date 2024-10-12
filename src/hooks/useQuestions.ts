import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Function to fetch questions from the API
const fetchQuestionsFromApi = async () => {
  const response = await fetch('/api/questions');
  const data = await response.json();

  if (data.questions) {
    localStorage.setItem('questions', JSON.stringify(data.questions));
    return data.questions;
  }
  return [];
};

// Function to save questions to the API
const saveQuestionsToApi = async (questions: any[]) => {
  const response = await fetch('/api/questions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ questions }),
  });
  if (!response.ok) {
    throw new Error('Failed to save questions');
  }
};

// Custom hook to fetch and save questions
export function useQuestions() {
  const queryClient = useQueryClient();

  // Fetch questions using useQuery
  const { data: questions = [], isLoading, error } = useQuery({
    queryKey: ['questions'],
    queryFn: fetchQuestionsFromApi,
  });

  // Create a mutation for saving questions
  const mutation = useMutation({
    mutationFn: saveQuestionsToApi,
    onSuccess: () => {
      // Invalidate and refetch questions after a successful mutation
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });

  // Return data, loading states, and the save function
  return {
    questions,
    isLoading,
    isSaving: mutation.isPending,
    error,
    saveQuestions: (questions: any[]) => mutation.mutate(questions),
  };
}
