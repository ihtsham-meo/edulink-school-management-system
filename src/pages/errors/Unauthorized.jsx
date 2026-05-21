import { useNavigate } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";

function Unauthorized() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-950 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock size={36} className="text-red-500" />
        </div>
        <div className="text-8xl font-bold text-red-500/20 mb-4">403</div>
        <h1 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">
          Access Denied
        </h1>
        <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm mb-8">
          You don't have permission to access this page.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors mx-auto"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>
      </div>
    </div>
  );
}

export default Unauthorized;
