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
      
      <main className="flex-1 overflow-auto px-6 pt-4">
        <div className="flex items-center gap-6 mb-4 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#00c907] shadow-[0_0_8px_#00c907]"></div>
            <span>Tamamlanıb</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#2a00a1] shadow-[0_0_8px_#2a00a1] animate-pulse-subtle"></div>
            <span>Uçuşda</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#e6b800] shadow-[0_0_8px_#e6b800]"></div>
            <span>Gözləyir</span>
          </div>
        </div>
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
