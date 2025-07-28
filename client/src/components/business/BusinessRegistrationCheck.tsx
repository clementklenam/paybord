import {useState, useEffect, ReactNode, useRef} from 'react';
import {useAuth} from '@/contexts/AuthContext';
import BusinessService from '@/services/business.service';
import {useLocation} from 'wouter';
import {Button} from '@/components/ui/button';
import {Building2} from 'lucide-react';

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
  const [, setLocation] = useLocation();

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If the user hasn't registered a business, show a redirect page
  if (hasRegisteredBusiness === false) {
    return (
      <div className="w-full py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-lg shadow-md p-6 border border-border">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-card-foreground">Business Registration Required</h2>
              <p className="mt-2 text-muted-foreground">
                Before you can start accepting payments, you need to register your business.
              </p>
            </div>
            <div className="text-center">
              <Button 
                onClick={() => setLocation('/business/register')}
                className="bg-primary text-primary-foreground hover:bg-accent font-bold shadow-md"
              >
                Register Your Business
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If the user has registered a business, show the children
  return <>{children}</>;
}
