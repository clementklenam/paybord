import { useState, useEffect, ReactNode, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import BusinessService from '@/services/business.service';
import { BusinessRegistrationForm } from './BusinessRegistrationForm';

// Use a module-level variable to track if we've already checked business registration
// This prevents repeated checks across component remounts
let hasCheckedBusinessGlobally = false;

interface BusinessRegistrationCheckProps {
  children: ReactNode;
}

export function BusinessRegistrationCheck({ children }: BusinessRegistrationCheckProps) {
  const { user } = useAuth();
  const [hasRegisteredBusiness, setHasRegisteredBusiness] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const checkAttempted = useRef(false);

  // We're using the module-level variable hasCheckedBusinessGlobally instead of a static property
  
  useEffect(() => {
    // Skip check if already attempted in this component instance or globally
    if (checkAttempted.current || hasCheckedBusinessGlobally) {
      // If we've already checked globally but don't have state set in this instance,
      // get the cached result
      if (hasCheckedBusinessGlobally && hasRegisteredBusiness === null) {
        const businessService = new BusinessService();
        // This will use the cache without making an API call
        businessService.hasRegisteredBusiness().then(exists => {
          setHasRegisteredBusiness(exists);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
      return;
    }
    
    const checkBusinessRegistration = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Mark as checked both locally and globally
        checkAttempted.current = true;
        hasCheckedBusinessGlobally = true;
        
        const businessService = new BusinessService();
        const hasRegistered = await businessService.hasRegisteredBusiness();
        setHasRegisteredBusiness(hasRegistered);
      } catch (error) {
        // If any error occurs, assume no business is registered
        setHasRegisteredBusiness(false);
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to prevent immediate API call
    const timer = setTimeout(() => {
      checkBusinessRegistration();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [user, hasRegisteredBusiness]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If the user hasn't registered a business, show the registration form
  if (hasRegisteredBusiness === false) {
    return (
      <div className="w-full py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Business Registration Required</h2>
              <p className="mt-2 text-gray-600">
                Before you can start accepting payments, you need to register your business.
              </p>
            </div>
            <BusinessRegistrationForm />
          </div>
        </div>
      </div>
    );
  }

  // If the user has registered a business, show the children
  return <>{children}</>;
}
