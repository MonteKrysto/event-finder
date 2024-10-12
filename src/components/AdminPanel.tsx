import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Component for each question in the list
const QuestionItem = ({ question, index, moveQuestion }) => {
  const [, ref] = useDrag({
    type: 'QUESTION',
    item: { index }
  });

  const [, drop] = useDrop({
    accept: 'QUESTION',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveQuestion(draggedItem.index, index);
        draggedItem.index = index;
      }
    }
  });

  return (
    <div ref={(node) => ref(drop(node))} className="p-2 border mb-2">
      {question.question}
    </div>
  );
};

// Admin Panel for reordering questions
export default function AdminPanel({ initialQuestions, onOrderChange }) {
  const [questions, setQuestions] = useState(initialQuestions);

  // Function to handle reordering
  const moveQuestion = (fromIndex, toIndex) => {
    const updatedQuestions = [...questions];
    const [movedQuestion] = updatedQuestions.splice(fromIndex, 1);
    updatedQuestions.splice(toIndex, 0, movedQuestion);
    setQuestions(updatedQuestions);
    onOrderChange(updatedQuestions); // Send updated order to parent component
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h2 className="text-xl font-bold mb-4">Reorder Questions</h2>
        {questions.map((question, index) => (
          <QuestionItem
            key={question.id}
            index={index}
            question={question}
            moveQuestion={moveQuestion}
          />
        ))}
      </div>
    </DndProvider>
  );
}
