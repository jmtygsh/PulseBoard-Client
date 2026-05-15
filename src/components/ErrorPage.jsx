export default function ErrorPage({ error, resetErrorBoundary }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white p-4">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Oops! Something went wrong.</h1>
      <p className="text-neutral-400 mb-6 text-lg">
        {error?.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={() => {
          resetErrorBoundary();
          window.location.href = '/';
        }}
        className="px-6 py-2 bg-white text-black rounded-md font-medium hover:bg-neutral-200 transition-colors"
      >
        Go Back Home
      </button>
    </div>
  );
}
