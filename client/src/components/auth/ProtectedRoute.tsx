import {useAuth} from "@/contexts/AuthContext";
import {useLocation} from "wouter";
import {useEffect} from "react";
import {BusinessRegistrationCheck} from "@/components/business/BusinessRegistrationCheck";

interface ProtectedRouteProps {
  children: React.ReactNode;
  skipBusinessCheck?: boolean;
}

export function ProtectedRoute({ children, skipBusinessCheck = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check if there's a token in localStorage
    const token = localStorage.getItem('token');
    
    // If no token and not loading, redirect to signin
    if (!token && !loading) {
      setLocation("/signin");
    }
  }, [user, loading, setLocation]);

  // No loading state - redirect immediately if no token
  if (!localStorage.getItem('token') && !loading) {
    setLocation("/signin");
    return null;
  }

  // If user is authenticated but we need to check business registration
  if (user && !skipBusinessCheck) {
    return (
      <BusinessRegistrationCheck>
        {children}
      </BusinessRegistrationCheck>
    );
  }
  
  // Only render children if user is authenticated (and we're skipping business check)
  return user ? <>{children}</> : null;
}
