import { useState, useEffect, useCallback } from 'react';
import { Flight } from '../types';
import { calculateFlightTime, generateId } from '../utils';

// Firebase quraşdırması ləğv edildiyi üçün, localStorage istifadə edirik
const STORAGE_KEY = 'aviation_flights_data';

export function useFlights() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFlights(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse flights from localStorage');
      }
    }
    setIsLoaded(true);
  }, []);

  const saveFlights = useCallback((newFlights: Flight[]) => {
    setFlights(newFlights);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFlights));
  }, []);

  const addFlight = useCallback(() => {
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
    saveFlights([...flights, newFlight]);
  }, [flights, saveFlights]);

  const updateFlight = useCallback((id: string, field: keyof Flight, value: string) => {
    saveFlights(
      flights.map(flight => {
        if (flight.id !== id) return flight;
        
        const updatedFlight = { ...flight, [field]: value, updatedAt: Date.now() };
        
        // Avtomatik uçuş vaxtı hesablanması
        if (field === 'departureTime' || field === 'arrivalTime') {
          updatedFlight.totalFlightTime = calculateFlightTime(
            updatedFlight.departureTime, 
            updatedFlight.arrivalTime
          );
        }
        
        return updatedFlight;
      })
    );
  }, [flights, saveFlights]);

  const deleteFlight = useCallback((id: string) => {
    saveFlights(flights.filter(f => f.id !== id));
  }, [flights, saveFlights]);

  return { flights, addFlight, updateFlight, deleteFlight, isLoaded };
}
