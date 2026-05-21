import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-accent/20 mb-4">404</div>
        <h1 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
          Page not found
        </h1>
        <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary text-sm font-medium rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Home size={16} />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
