/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FlightTable } from './components/FlightTable';
import { useFlights } from './hooks/useFlights';

export default function App() {
  const { flights, addFlight, updateFlight, deleteFlight, isLoaded } = useFlights();

  // Layihə açılanda boşdursa 1 sətir əlavə edək (istəyə bağlı)
  useEffect(() => {
    if (isLoaded && flights.length === 0) {
      addFlight();
    }
  }, [isLoaded, flights.length, addFlight]);

  if (!isLoaded) return null;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#fdfcf9] font-sans text-[#1a1a1a]">
      <Header />
      
      <main className="flex-1 overflow-auto px-6 pt-2">
        <FlightTable 
          flights={flights} 
          onUpdate={updateFlight} 
          onDelete={deleteFlight} 
        />
      </main>

      <Footer flights={flights} onAddFlight={addFlight} />
    </div>
  );
}
