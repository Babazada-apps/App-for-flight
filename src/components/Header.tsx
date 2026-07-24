import React, { useEffect, useState } from 'react';
import { Plane } from 'lucide-react';

export function Header() {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      
      const day = now.getDate().toString().padStart(2, '0');
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const year = now.getFullYear();
      setDateStr(`${day}-${month}-${year}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-20 px-8 flex items-center justify-between border-b border-[#e5e5e5] bg-[#fdfcf9] shrink-0">
      <div className="flex items-center gap-3">
        <div className="bg-[#1a1a1a] p-2 rounded-lg">
          <Plane className="w-6 h-6 text-[#fdfcf9] rotate-45" />
        </div>
        <h1 className="text-2xl font-bold tracking-tighter text-[#1a1a1a]">ATLAS uçuşlara nəzarət sistemi</h1>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium text-gray-500 uppercase">Bakı, Azərbaycan</div>
        <div className="text-lg font-mono font-bold text-[#1a1a1a]">{dateStr} | {timeStr}</div>
      </div>
    </header>
  );
}
