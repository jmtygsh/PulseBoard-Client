import { useRouteError } from 'react-router-dom';

export default function ErrorPage({ error: propsError, resetErrorBoundary }) {
  // If caught by React Router, useRouteError will return the error.
  // If caught by react-error-boundary, propsError will be populated.
  const routeError = useRouteError();
  const error = propsError || routeError;
  
  // React router specifically throws an object with statusText/status for 404s
  const is404 = routeError?.status === 404;
  const errorMessage = is404 
    ? "The page you are looking for does not exist." 
    : error?.message || routeError?.statusText || "An unexpected error occurred.";

  const handleReset = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    }
    window.location.href = '/';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white p-4">
      <h1 className="text-4xl font-bold text-orange-500 mb-4">
        {is404 ? "404 - Not Found" : "Oops! Something went wrong."}
      </h1>
      <p className="text-neutral-400 mb-6 text-lg text-center max-w-md">
        {errorMessage}
      </p>
      <button
        onClick={handleReset}
        className="px-6 py-2 bg-white text-black rounded-md font-medium hover:bg-neutral-200 transition-colors"
      >
        Go Back Home
      </button>
    </div>
  );
}
