import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface PaymentContextType {
  refreshDashboard: () => void;
  subscribeToPaymentEvents: (callback: () => void) => () => void;
  notifyPaymentSuccess: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

const PAYMENT_EVENT_KEY = 'paymesa_payment_event';

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [subscribers, setSubscribers] = useState<(() => void)[]>([]);

  // Check for payment events on mount and when storage changes
  useEffect(() => {
    const checkForPaymentEvents = () => {
      try {
        const eventData = localStorage.getItem(PAYMENT_EVENT_KEY);
        if (eventData) {
          const event = JSON.parse(eventData);
          const now = Date.now();
          // Only process events that are less than 5 seconds old
          if (now - event.timestamp < 5000) {
            console.log('[PaymentContext] Found recent payment event, notifying subscribers');
            notifySubscribers();
            // Clear the event after processing
            localStorage.removeItem(PAYMENT_EVENT_KEY);
          }
        }
      } catch (error) {
        console.error('[PaymentContext] Error checking for payment events:', error);
      }
    };

    // Check on mount
    checkForPaymentEvents();

    // Listen for storage changes (when other tabs/windows trigger events)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === PAYMENT_EVENT_KEY && e.newValue) {
        console.log('[PaymentContext] Storage change detected, checking for payment events');
        checkForPaymentEvents();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const notifySubscribers = () => {
    console.log('[PaymentContext] Notifying subscribers, count:', subscribers.length);
    subscribers.forEach((callback, index) => {
      try {
        console.log(`[PaymentContext] Notifying subscriber ${index + 1}`);
        callback();
      } catch (error) {
        console.error('[PaymentContext] Error in payment event callback:', error);
      }
    });
  };

  // Memoize subscribeToPaymentEvents to prevent infinite update loops
  const subscribeToPaymentEvents = useCallback((callback: () => void) => {
    setSubscribers(prev => [...prev, callback]);
    // Return unsubscribe function
    return () => {
      setSubscribers(prev => prev.filter(sub => sub !== callback));
    };
  }, []);

  const notifyPaymentSuccess = () => {
    console.log('[PaymentContext] Payment success notified, storing event and refreshing dashboard...');
    
    // Store the payment event in localStorage with timestamp
    try {
      const eventData = {
        timestamp: Date.now(),
        type: 'payment_success'
      };
      localStorage.setItem(PAYMENT_EVENT_KEY, JSON.stringify(eventData));
      console.log('[PaymentContext] Payment event stored in localStorage');
    } catch (error) {
      console.error('[PaymentContext] Error storing payment event:', error);
    }
    
    // Also notify current subscribers immediately
    notifySubscribers();
  };

  const refreshDashboard = () => {
    notifyPaymentSuccess();
  };

  return (
    <PaymentContext.Provider value={{
      refreshDashboard,
      subscribeToPaymentEvents,
      notifyPaymentSuccess
    }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePaymentContext() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePaymentContext must be used within a PaymentProvider');
  }
  return context;
} 