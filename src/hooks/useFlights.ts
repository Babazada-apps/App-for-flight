import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Flight } from '../types';
import { calculateFlightTime, generateId } from '../utils';

export function useFlights(token: string, onLogout: () => void) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Initialize Socket
    const newSocket = io({
      auth: { token }
    });

    newSocket.on('connect', () => {
      setError('');
      // Request initial flights
      newSocket.emit('getFlights', (data: Flight[]) => {
        setFlights(data);
        setIsLoaded(true);
      });
    });

    newSocket.on('connect_error', (err) => {
      if (err.message === 'Authentication error') {
        onLogout();
      } else {
        setError('Bağlantı xətası: ' + err.message);
      }
    });

    newSocket.on('flightsUpdated', (updatedFlights: Flight[]) => {
      setFlights(updatedFlights);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token, onLogout]);

  const addFlight = useCallback(() => {
    if (!socket) return;
    const newFlight: Flight = {
      id: generateId(),
      aircraft: '',
      tailNumber: '',
      callSign: '',
      crew: '',
      purpose: '',
      departureAerodrome: '',
      arrivalAerodrome: '',
      departureTime: '',
      arrivalTime: '',
      totalFlightTime: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    // Optymistik UI update (optional, but since we broadcast we might just emit)
    // To avoid lag, we could update local state first, but simple emit is safer for LAN
    socket.emit('addFlight', newFlight);
  }, [socket]);

  const updateFlight = useCallback((id: string, field: keyof Flight, value: string) => {
    if (!socket) return;

    // Find the flight to calculate total time locally before sending
    const flight = flights.find(f => f.id === id);
    if (!flight) return;

    let totalFlightTime = flight.totalFlightTime;
    
    if (field === 'departureTime' || field === 'arrivalTime') {
      const dep = field === 'departureTime' ? value : flight.departureTime;
      const arr = field === 'arrivalTime' ? value : flight.arrivalTime;
      totalFlightTime = calculateFlightTime(dep, arr);
    }

    socket.emit('updateFlight', {
      id,
      field,
      value,
      totalFlightTime,
      updatedAt: Date.now()
    });
  }, [flights, socket]);

  const deleteFlight = useCallback((id: string) => {
    if (!socket) return;
    socket.emit('deleteFlight', id);
  }, [socket]);

  return { flights, addFlight, updateFlight, deleteFlight, isLoaded, error };
}
