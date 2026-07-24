/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FlightTable } from './components/FlightTable';
import { useFlights } from './hooks/useFlights';
import { Login } from './components/Login';

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('atlas_token'));
  
  const handleLogin = (newToken: string) => {
    localStorage.setItem('atlas_token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('atlas_token');
    setToken(null);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return <MainApp token={token} onLogout={handleLogout} />;
}

function MainApp({ token, onLogout }: { token: string, onLogout: () => void }) {
  const { flights, addFlight, updateFlight, deleteFlight, isLoaded, error } = useFlights(token, onLogout);

  // Layihə açılanda boşdursa 1 sətir əlavə edək
  useEffect(() => {
    if (isLoaded && flights.length === 0) {
      addFlight();
    }
  }, [isLoaded, flights.length, addFlight]);

  if (!isLoaded) return <div className="h-screen flex items-center justify-center bg-[#fdfcf9]">Yüklənir...</div>;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#fdfcf9] font-sans text-[#1a1a1a]">
      <Header onLogout={onLogout} />
      
      {error && (
        <div className="bg-red-500 text-white text-center py-2 text-sm">
          {error}
        </div>
      )}

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
