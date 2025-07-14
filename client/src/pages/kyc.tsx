import {useAuth} from '@/contexts/AuthContext';
import {useLocation} from 'wouter';
import {useToast} from '@/hooks/use-toast';
import {useEffect} from 'react';

export default function KycPage() {
  const { submitKyc } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Auto-submit KYC and redirect to dashboard
  useEffect(() => {
    const autoSubmitKyc = async () => {
      try {
        await submitKyc({
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          phone: '',
          address: '',
          idType: '',
          idNumber: '',
          idDocument: null,
          proofOfAddress: null,
        });
        
        setLocation('/dashboard');
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: 'Error',
          description: 'Failed to process your request. Please try again.',
          variant: 'destructive',
        });
      }
    };

    autoSubmitKyc();
  }, [submitKyc, setLocation, toast]);

  return null;
}
