'use client';

import { useState } from 'react';

export default function SimpleLogin() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Simple Login Test</h1>
        <p className="text-gray-600 mb-4">This is a simple test page</p>
        <button 
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Count: {count}
        </button>
        <p className="mt-4 text-sm text-gray-500">If this page stays visible, the issue is with the login form</p>
      </div>
    </div>
  );
} 