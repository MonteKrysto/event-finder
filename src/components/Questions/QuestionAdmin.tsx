import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createQuestionConfigService } from '@/services/questionConfigService';
import { Modal } from '@/components/Modal';
import { QuestionItem } from './QuestionItem';  // Import the draggable QuestionItem component

interface Question {
  id: number;
  question: string;
  type: 'text' | 'multiple-choice';
  options?: string[];
}

const QuestionAdmin = () => {
  const questionService = createQuestionConfigService();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editQuestionId, setEditQuestionId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors }, setError } = useForm();
  const watchQuestionType = watch('type', 'text');

  useEffect(() => {
    setQuestions(questionService.getQuestions());
  }, [questionService]);
  

  // const openEditModal = (question: Question) => {
  //   setEditQuestionId(question.id);
  //   setValue('question', question.question);
  //   setValue('type', question.type);
  //   setValue('options', question.options?.join(', ') || '');
  //   setIsModalOpen(true);  // Open the modal for editing
  // };
  const openEditModal = (question: Question) => {
    setEditQuestionId(question.id);  // You can still set the edit ID in state if needed
    reset({
      question: question.question,
      type: question.type,
      options: question.options?.join(', ') || ''
    });
    setIsModalOpen(true);  // Open the modal
  };

  const onSubmit = (data: any) => {
    const options = watchQuestionType === 'multiple-choice' ? data.options.split(',').map((opt: string) => opt.trim()) : [];
  
    // Check if there's a duplicate question with the same name
    const isDuplicate = questions.some(q => q.question.toLowerCase() === data.question.toLowerCase() && q.id !== editQuestionId);
  
    if (isDuplicate) {
      // If duplicate, show an error
      setError('question', { type: 'duplicate', message: 'This question already exists.' });
      return;
    }
  
    if (editQuestionId) {
      // If editing, update the question
      questionService.editQuestion(editQuestionId, { question: data.question, type: watchQuestionType, options });
      setEditQuestionId(null);  // Clear edit mode
    } else {
      // If adding a new question, generate a new one with an id
      const newQuestion = {
        id: Date.now(),  // Generate a unique id
        question: data.question,
        type: watchQuestionType,
        options,
      };
  
      questionService.addQuestion(newQuestion);
  
      // Append the new question to the list
      setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
    }
  
    // Reset the form fields on success
    reset({
      question: '',
      type: 'text',
      options: ''
    });
  
    setIsModalOpen(false);  // Close the modal on success, if modal was used
  };
  
  
  const handleDeleteQuestion = (id: number) => {
    questionService.deleteQuestion(id);
    setQuestions(questionService.getQuestions());
  };

  const moveQuestion = (fromIndex: number, toIndex: number) => {
    const updatedQuestions = [...questions];
    const [movedQuestion] = updatedQuestions.splice(fromIndex, 1);
    updatedQuestions.splice(toIndex, 0, movedQuestion);
    setQuestions(updatedQuestions);

    // Update the state machine with the new order
    questionService.reorderQuestions(fromIndex, toIndex);
  };

  const validateOptions = (value: string) => {
    const regex = /^[^,\s]+(,\s*[^,\s]+)*$/;
    return regex.test(value) || 'Options must be valid comma-separated values';
  };

  return (
    <div>
      <h1>Admin Panel - Configure Questions</h1>

      {/* Form for adding or editing questions */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <div className="mb-2">
          <input
            {...register('question', { required: 'Question is required' })}
            type="text"
            placeholder="Enter question"
            className="border p-2 mr-2"
          />
          {errors.question && <p className="text-red-500">{errors.question.message as string}</p>}
        </div>

        <div className="mb-2">
          <select
            {...register('type')}
            className="border p-2 mr-2"
          >
            <option value="text">Text</option>
            <option value="multiple-choice">Multiple Choice</option>
          </select>
        </div>

        {watchQuestionType === 'multiple-choice' && (
          <div className="mb-2">
            <input
              {...register('options', {
                required: 'Options are required for multiple choice',
                validate: validateOptions
              })}
              type="text"
              placeholder="Enter options (comma-separated)"
              className="border p-2 mr-2"
            />
            {errors.options && <p className="text-red-500">{errors.options.message as string}</p>}
          </div>
        )}

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Question
        </button>
      </form>

      {/* List of current questions */}
      <h2>Questions</h2>
      <ul>
        {questions.map((question, index) => (
          <QuestionItem
            key={index}
            index={index}
            question={question}
            moveQuestion={moveQuestion}
            openEditModal={openEditModal}
            handleDeleteQuestion={handleDeleteQuestion}
          />
        ))}
      </ul>

      {/* Modal for editing question */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>Edit Question</Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-2">
              <input
                {...register('question', { required: 'Question is required' })}
                type="text"
                placeholder="Enter question"
                className="border p-2 mr-2"
              />
              {errors.question && <p className="text-red-500">{errors.question.message as string}</p>}
            </div>

            <div className="mb-2">
              <select
                {...register('type')}
                className="border p-2 mr-2"
              >
                <option value="text">Text</option>
                <option value="multiple-choice">Multiple Choice</option>
              </select>
            </div>

            {watchQuestionType === 'multiple-choice' && (
              <div className="mb-2">
                <input
                  {...register('options', {
                    required: 'Options are required for multiple choice',
                    validate: validateOptions
                  })}
                  type="text"
                  placeholder="Enter options (comma-separated)"
                  className="border p-2 mr-2"
                />
                {errors.options && <p className="text-red-500">{errors.options.message as string}</p>}
              </div>
            )}

            <Modal.Footer>
              <button type="submit" className="bg-green-500 text-white p-2 rounded">
                Save Changes
              </button>
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white p-2 rounded ml-2">
                Cancel
              </button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export { QuestionAdmin };