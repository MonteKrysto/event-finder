import { useForm, Controller } from 'react-hook-form';
import { useQuestions } from '@/contexts/QuestionContext';

interface Question {
  id: number;
  question: string;
  type: string;
  options: string[];
}

// Define the QuestionForm props type
interface QuestionFormProps {
  question?: Question;
  setEditingQuestion: (question: Question | null) => void;
}

export default function QuestionForm({ question, setEditingQuestion }: QuestionFormProps) {
  const { addQuestion, editQuestion } = useQuestions();

  // Set up useForm hook
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    defaultValues: {
      question: question ? question.question : '',
      type: question ? question.type : 'text',
      options: question ? question.options.join(', ') : '',
    }
  });

  // Watch the value of the "type" field to conditionally show options input
  const questionType = watch('type');

  // Handle form submission
  const onSubmit = (data: { question: string; type: string; options?: string }) => {
    const updatedQuestion = {
      id: question ? question.id : Date.now(),
      question: data.question,
      type: data.type,
      options: data.type === 'multiple-choice' ? data.options?.split(',').map(opt => opt.trim()) : [],
    };

    if (question) {
      editQuestion(updatedQuestion);  // Update existing question
      setEditingQuestion(null);       // Close the modal
    } else {
      addQuestion(updatedQuestion);   // Add new question
    }

    reset();  // Reset form after submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
      <div className="mb-2">
        <label className="block font-bold">Question</label>
        <input
          {...register('question', { required: 'Question is required' })}
          className="border p-2 w-full"
          placeholder="Enter the question text"
        />
        {errors.question?.message && (
          <p className="text-red-500">{errors.question.message as string}</p>
        )}
      </div>

      <div className="mb-2">
        <label className="block font-bold">Type</label>
        <select
          {...register('type')}
          className="border p-2 w-full"
        >
          <option value="text">Text</option>
          <option value="multiple-choice">Multiple Choice</option>
        </select>
      </div>

      {/* Dynamically show the options input field based on the selected question type */}
      {questionType === 'multiple-choice' && (
        <div className="mb-2">
          <label className="block font-bold">Options (Comma-separated)</label>
          <input
            {...register('options', {
              required: 'Options are required for multiple choice',
              validate: {
                isCommaSeparated: (value) => {
                  // Split by comma and trim each option
                  const optionsArray = value.split(',').map(opt => opt.trim());

                  // Check if any option contains spaces or is empty
                  const invalidOption = optionsArray.some(opt => /\s/.test(opt) || opt === '');

                  return !invalidOption && optionsArray.length >= 2
                    || 'Please enter at least two valid, non-empty options separated by commas. No spaces allowed between options.';
                }
              }
            })}
            className="border p-2 w-full"
            placeholder="Enter options (e.g., Option1,Option2)"
          />
          {errors.options?.message && (
            <p className="text-red-500">{errors.options.message as string}</p>
          )}
        </div>
      )}

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        {question ? 'Update Question' : 'Add Question'}
      </button>
    </form>
  );
}
