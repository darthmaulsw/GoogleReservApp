export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Page</h1>
        <p className="text-gray-600">This is a test page to check if routing works.</p>
        <a href="/login" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          Go to Login
        </a>
      </div>
    </div>
  );
} 