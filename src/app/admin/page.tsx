"use client";

// import AdminPanel from '@/components/AdminPanel';

// export default function AdminPage() {
//   return <AdminPanel />;
// }

// src/pages/admin/page.tsx

import React from 'react';
import { QuestionAdmin } from '@/components/Questions/QuestionAdmin';  // Import the QuestionAdmin component
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const AdminPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel - Manage Questions</h1>
      <DndProvider backend={HTML5Backend}>
        <QuestionAdmin />
      </DndProvider>
    </div>
  );
};

export default AdminPage;

