import { Flight } from './types';

export function calculateFlightTime(departure: string, arrival: string): string {
  if (!departure || !arrival) return '';
  
  const [depH, depM] = departure.split(':').map(Number);
  const [arrH, arrM] = arrival.split(':').map(Number);

  let depTotal = depH * 60 + depM;
  let arrTotal = arrH * 60 + arrM;

  // Əgər eniş vaxtı qalxış vaxtından kiçikdirsə, növbəti günə keçmiş hesab edirik
  if (arrTotal < depTotal) {
    arrTotal += 24 * 60;
  }

  const diff = arrTotal - depTotal;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function sumFlightTimes(flights: Flight[]): string {
  let totalMinutes = 0;
  
  for (const f of flights) {
    // Yalnız tamamlanmış uçuşları hesablayırıq
    if (f.departureTime && f.arrivalTime && f.totalFlightTime) {
      const parts = f.totalFlightTime.split(':');
      if (parts.length === 2) {
        const [h, m] = parts.map(Number);
        totalMinutes += (h * 60) + m;
      }
    }
  }
  
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function getCompletedFlightsCount(flights: Flight[]): number {
  return flights.filter(f => f.departureTime && f.arrivalTime).length;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}
