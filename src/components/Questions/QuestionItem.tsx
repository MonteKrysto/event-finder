import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { Question } from '@/services/questionConfigService';

interface QuestionItemProps {
  question: Question;
  index: number;
  moveQuestion: (fromIndex: number, toIndex: number) => void;
  openEditModal: (question: Question) => void;  // Prop to open the modal for editing
  handleDeleteQuestion: (id: number) => void;   // Prop to delete the question
}

const QuestionItem: React.FC<QuestionItemProps> = ({ question, index, moveQuestion, openEditModal, handleDeleteQuestion }) => {
  const ref = useRef<HTMLLIElement>(null);

  const [, drop] = useDrop({
    accept: 'QUESTION',
    hover(item: { index: number }) {
      if (item.index !== index) {
        moveQuestion(item.index, index);
        item.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'QUESTION',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <li
      ref={ref}
      className={`mb-2 p-2 bg-white border ${isDragging ? 'opacity-50' : ''}`}
    >
      <div>
        {question.question} ({question.type})
        {/* Button to open modal for editing */}
        <button onClick={() => openEditModal(question)} className="bg-yellow-500 text-white p-2 rounded ml-2">
          Edit
        </button>
        {/* Button to delete the question */}
        <button onClick={() => handleDeleteQuestion(question.id)} className="bg-red-500 text-white p-2 rounded ml-2">
          Delete
        </button>
      </div>
    </li>
  );
};

export { QuestionItem };
