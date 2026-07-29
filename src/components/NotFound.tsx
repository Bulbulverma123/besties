
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>

      <h2 className="text-2xl mb-2">Page Not Found</h2>

      <p className="text-gray-400 mb-6 text-center max-w-md">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>

      <Link
        to="/"
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-full transition-colors duration-300"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;