import React from 'react';
import { FileOutput, Plus } from 'lucide-react';
import { Flight } from '../types';
import { getCompletedFlightsCount, sumFlightTimes } from '../utils';

interface FooterProps {
  flights: Flight[];
  onAddFlight: () => void;
}

export function Footer({ flights, onAddFlight }: FooterProps) {
  const completedCount = getCompletedFlightsCount(flights);
  const totalTimeStr = sumFlightTimes(flights);

  const handlePrint = () => {
    window.print();
  };

  return (
    <footer className="h-20 px-8 flex items-center justify-between bg-[#fdfcf9] border-t border-[#e5e5e5] shrink-0">
      <div className="flex gap-8">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-gray-500 font-bold">Ümumi Uçuş Sayı</span>
          <span className="text-xl font-mono font-bold text-[#1a1a1a]">{completedCount}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-gray-500 font-bold">Ümumi Uçuş Vaxtı</span>
          <span className="text-xl font-mono font-bold text-[#1a1a1a]">{totalTimeStr || '00:00'} SAAT</span>
        </div>
      </div>
      
      <div className="flex gap-4 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 border border-[#1a1a1a] rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm text-[#1a1a1a]"
        >
          <FileOutput className="w-4 h-4" />
          <span>İxrac (PDF)</span>
        </button>
        <button
          onClick={onAddFlight}
          className="flex items-center gap-2 px-6 py-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-black transition-colors font-medium text-sm shadow-lg shadow-black/10"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Sətir</span>
        </button>
      </div>
    </footer>
  );
}
