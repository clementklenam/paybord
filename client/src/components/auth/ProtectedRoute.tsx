import {useAuth} from "@/contexts/AuthContext";
import {useLocation} from "wouter";
import {useEffect, useState} from "react";
import {Loader2} from "lucide-react";
import {BusinessRegistrationCheck} from "@/components/business/BusinessRegistrationCheck";

interface ProtectedRouteProps {
  children: React.ReactNode;
  skipBusinessCheck?: boolean;
}

export function ProtectedRoute({ children, skipBusinessCheck = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if there's a token in localStorage
    const token = localStorage.getItem('token');
    
    // If no token and not loading, redirect to signin
    if (!token && !loading) {
      setLocation("/signin");
    }
    
    // If we have completed the auth check
    if (!loading) {
      setIsChecking(false);
    }
  }, [user, loading, setLocation]);

  // Show loading spinner while checking authentication
  if (isChecking || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-500">Verifying your credentials...</p>
      </div>
    );
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
