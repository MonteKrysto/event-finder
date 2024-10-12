import { useQuestions } from '@/contexts/QuestionContext';
import { useState } from 'react';
import QuestionForm from './QuestionForm';
import { Modal } from '../Modal';

export default function QuestionList() {
  const { questions, deleteQuestion } = useQuestions();
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);

  const handleEdit = (question) => {
    setEditingQuestion(question);
  };

  const handleDelete = (id: number) => {
    setQuestionToDelete(id);
  };

  const confirmDelete = () => {
    if (questionToDelete !== null) {
      deleteQuestion(questionToDelete);
      setQuestionToDelete(null);
    }
  };

  const cancelDelete = () => {
    setQuestionToDelete(null);
  };

  const cancelEdit = () => {
    setEditingQuestion(null);  // Close the modal when cancelling the edit
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Questions</h2>
      <ul>
        {questions.map((q) => (
          <li key={q.id} className="mb-4 flex justify-between items-center">
            <div>
              <span className="font-bold">{q.question}</span> ({q.type}){' '}
              {q.options.length > 0 && <span>- Options: {q.options.join(', ')}</span>}
            </div>
            <div>
              <button onClick={() => handleEdit(q)} className="bg-yellow-500 text-white py-2 px-4 rounded mr-2">
                Edit
              </button>
              <button onClick={() => handleDelete(q.id)} className="bg-red-500 text-white py-2 px-4 rounded">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal for Deleting a Question */}
      {questionToDelete !== null && (
        <Modal>
          <Modal.Header>Confirm Deletion</Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this question?</p>
          </Modal.Body>
          <Modal.Footer onConfirm={confirmDelete} onCancel={cancelDelete} />
        </Modal>
      )}

      {/* Modal for Editing a Question */}
      {editingQuestion && (
        <Modal>
          <Modal.Header>Edit Question</Modal.Header>
          <Modal.Body>
            <QuestionForm question={editingQuestion} setEditingQuestion={setEditingQuestion} />
          </Modal.Body>
          <Modal.Footer onCancel={cancelEdit}>
            <button onClick={cancelEdit} className="bg-gray-500 text-white py-2 px-4 rounded mr-2">
              Cancel
            </button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
