import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket(onPaymentUpdate: (data: unknown) => void) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:5000'); // Adjust for your backend URL
    socketRef.current.on('payment_update', onPaymentUpdate);
    return () => {
      socketRef.current?.disconnect();
    };
  }, [onPaymentUpdate]);
} 