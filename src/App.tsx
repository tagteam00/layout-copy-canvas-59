
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState, ErrorBoundary, Suspense } from "react";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/layout/PageTransition";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Onboarding from "./pages/auth/Onboarding";
import TagTeamHub from "./pages/TagTeamHub";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import Settings from "./pages/Settings";
import WelcomeScreen from "./components/onboarding/WelcomeScreen";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Improve performance by preventing unnecessary refetches
      retry: 1, // Limit retries to improve performance
    }
  }
});

// Custom error boundary fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-4">We encountered an error while loading the application.</p>
        <pre className="bg-gray-100 p-3 rounded mb-4 text-xs overflow-auto max-h-40">
          {error.message}
        </pre>
        <button
          onClick={resetErrorBoundary}
          className="w-full bg-[#827AFF] text-white py-2 px-4 rounded hover:bg-[#6c64e8] transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse text-center">
      <div className="w-16 h-16 rounded-full mx-auto bg-[#827AFF]/30 mb-4"></div>
      <p className="text-gray-600">Loading application...</p>
    </div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading, hasCompletedOnboarding, authError } = useAuth();
  const [showFallback, setShowFallback] = useState(false);
  
  // Add a safety timeout to handle edge cases where loading gets stuck
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.warn("ProtectedRoute: Force completing after timeout");
        setShowFallback(true);
      }
    }, 8000); // 8 second safety timeout
    
    return () => clearTimeout(timer);
  }, [loading]);
  
  if (loading && !showFallback) {
    return <LoadingFallback />;
  }

  if (authError) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-4">
        <p className="text-red-500 mb-4">{authError}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-[#827AFF] text-white px-4 py-2 rounded"
        >
          Refresh
        </button>
      </div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  // Redirect to onboarding if the user hasn't completed it yet
  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

// Onboarding route - accessible only to authenticated users who haven't completed onboarding
const OnboardingRoute = ({ children }) => {
  const { user, loading, hasCompletedOnboarding, authError } = useAuth();
  const [showFallback, setShowFallback] = useState(false);
  
  // Add a safety timeout to handle edge cases where loading gets stuck
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.warn("OnboardingRoute: Force completing after timeout");
        setShowFallback(true);
      }
    }, 8000); // 8 second safety timeout
    
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading && !showFallback) {
    return <LoadingFallback />;
  }

  if (authError) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-4">
        <p className="text-red-500 mb-4">{authError}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-[#827AFF] text-white px-4 py-2 rounded"
        >
          Refresh
        </button>
      </div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  
  // If the user has already completed onboarding, redirect to home
  if (hasCompletedOnboarding) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

// Public route - redirects to home if already authenticated
const PublicRoute = ({ children }) => {
  const { user, loading, hasCompletedOnboarding, authError } = useAuth();
  const [showFallback, setShowFallback] = useState(false);
  
  // Add a safety timeout to handle edge cases where loading gets stuck
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.warn("PublicRoute: Force completing after timeout");
        setShowFallback(true);
      }
    }, 8000); // 8 second safety timeout
    
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading && !showFallback) {
    return <LoadingFallback />;
  }

  if (authError) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-4">
        <p className="text-red-500 mb-4">{authError}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-[#827AFF] text-white px-4 py-2 rounded"
        >
          Refresh
        </button>
      </div>
    </div>;
  }

  // If user exists and has completed onboarding, redirect to home
  if (user && hasCompletedOnboarding) {
    return <Navigate to="/home" replace />;
  }
  
  // If user exists but hasn't completed onboarding, redirect to onboarding
  if (user && !hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Public routes - redirect to home if already authenticated */}
        <Route path="/" element={
          <PublicRoute>
            <PageTransition>
              <WelcomeScreen />
            </PageTransition>
          </PublicRoute>
        } />
        <Route path="/signin" element={
          <PublicRoute>
            <PageTransition>
              <SignIn />
            </PageTransition>
          </PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute>
            <PageTransition>
              <SignUp />
            </PageTransition>
          </PublicRoute>
        } />
        
        {/* Onboarding route - for authenticated users who haven't completed onboarding */}
        <Route path="/onboarding" element={
          <OnboardingRoute>
            <PageTransition>
              <Onboarding />
            </PageTransition>
          </OnboardingRoute>
        } />

        {/* Protected routes - require authentication and completed onboarding */}
        <Route path="/home" element={
          <ProtectedRoute>
            <PageTransition>
              <Index />
            </PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/tagteam" element={
          <ProtectedRoute>
            <PageTransition>
              <TagTeamHub />
            </PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <PageTransition>
              <ProfilePage />
            </PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/notifications" element={
          <ProtectedRoute>
            <PageTransition>
              <NotificationsPage />
            </PageTransition>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <PageTransition>
              <Settings />
            </PageTransition>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

// Fix the ErrorBoundary import
class CustomErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App Error Boundary caught an error:", error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} resetErrorBoundary={this.resetErrorBoundary} />;
    }

    return this.props.children;
  }
}

const App = () => {
  const [appInitialized, setAppInitialized] = useState(false);
  
  useEffect(() => {
    // Force app to show something after a timeout, as ultimate fallback
    const timer = setTimeout(() => {
      setAppInitialized(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!appInitialized) {
    return <LoadingFallback />;
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <CustomErrorBoundary>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Suspense fallback={<LoadingFallback />}>
              <BrowserRouter>
                <AnimatedRoutes />
              </BrowserRouter>
            </Suspense>
          </TooltipProvider>
        </AuthProvider>
      </CustomErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;
