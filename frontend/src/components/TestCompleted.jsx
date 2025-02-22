// frontend/src/components/TestCompleted.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function TestCompleted() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Test Completed</h2>
        <p className="mb-6">HR will get back to you.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default TestCompleted;
