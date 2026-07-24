import React from 'react';
import { Trash2 } from 'lucide-react';
import { Flight } from '../types';

interface FlightTableProps {
  flights: Flight[];
  onUpdate: (id: string, field: keyof Flight, value: string) => void;
  onDelete: (id: string) => void;
}

export function FlightTable({ flights, onUpdate, onDelete }: FlightTableProps) {
  const getRowStatus = (flight: Flight) => {
    const hasDep = !!flight.departureTime;
    const hasArr = !!flight.arrivalTime;

    const isEmpty =
      !flight.aircraft &&
      !flight.tailNumber &&
      !flight.callSign &&
      !flight.crew &&
      !flight.purpose &&
      !flight.departureAerodrome &&
      !flight.arrivalAerodrome &&
      !hasDep &&
      !hasArr;

    if (hasDep && hasArr) return 'completed';
    if (hasDep && !hasArr) return 'inflight';
    if (!isEmpty) return 'waiting';
    return 'empty';
  };

  const getRowClass = (flight: Flight) => {
    const status = getRowStatus(flight);
    switch (status) {
      case 'completed':
        return 'bg-[#00FF09]/10 text-[#1a1a1a]';
      case 'inflight':
        return 'bg-[#1D0070]/5 text-[#1D0070] animate-pulse-subtle';
      case 'waiting':
        return 'bg-[#F7FF00]/20 text-[#1a1a1a]';
      default:
        return 'bg-white text-[#1a1a1a]';
    }
  };

  return (
    <div className="w-full pb-32">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="bg-gray-50/50 border-b border-[#e5e5e5]">
            <th className="w-32 py-3 px-2 text-left text-[11px] font-semibold text-[#666] uppercase tracking-[0.05em]">Hava Gəmisi</th>
            <th className="w-24 py-3 px-2 text-left text-[11px] font-semibold text-[#666] uppercase tracking-[0.05em]">Bort №</th>
            <th className="w-24 py-3 px-2 text-left text-[11px] font-semibold text-[#666] uppercase tracking-[0.05em]">Çağırış</th>
            <th className="w-40 py-3 px-2 text-left text-[11px] font-semibold text-[#666] uppercase tracking-[0.05em]">Ekipaj</th>
            <th className="w-40 py-3 px-2 text-left text-[11px] font-semibold text-[#666] uppercase tracking-[0.05em]">Məqsəd</th>
            <th className="w-24 py-3 px-2 text-left text-[11px] font-semibold text-[#666] uppercase tracking-[0.05em]">Qalxış Aer.</th>
            <th className="w-24 py-3 px-2 text-left text-[11px] font-semibold text-[#666] uppercase tracking-[0.05em]">Enmə Aer.</th>
            <th className="w-24 py-3 px-2 text-left text-[11px] font-semibold text-[#666] uppercase tracking-[0.05em]">Qalxış Vaxtı</th>
            <th className="w-24 py-3 px-2 text-left text-[11px] font-semibold text-[#666] uppercase tracking-[0.05em]">Enmə Vaxtı</th>
            <th className="w-24 py-3 px-2 text-left text-[11px] font-semibold text-[#666] uppercase tracking-[0.05em]">Müddət</th>
            <th className="w-10 py-3 px-2 text-left text-[11px] font-semibold text-[#666] uppercase tracking-[0.05em] print:hidden"></th>
          </tr>
        </thead>
        <tbody>
          {flights.length === 0 ? (
            <tr>
              <td colSpan={11} className="py-12 text-center text-gray-400 text-sm">
                Göstəriləcək məlumat yoxdur. "Yeni Sətir" düyməsinə klikləyərək uçuş əlavə edin.
              </td>
            </tr>
          ) : (
            flights.map((flight) => (
              <tr key={flight.id} className={`${getRowClass(flight)} group border-b border-[#f0f0f0]`}>
                <td className="px-2 py-2 text-[13px]">
                  <input
                    type="text"
                    value={flight.aircraft}
                    onChange={(e) => onUpdate(flight.id, 'aircraft', e.target.value)}
                    placeholder="Hava gəmisi..."
                    className="w-full bg-transparent outline-none placeholder:text-black/30"
                  />
                </td>
                <td className="px-2 py-2 text-[13px]">
                  <input
                    type="text"
                    value={flight.tailNumber}
                    onChange={(e) => onUpdate(flight.id, 'tailNumber', e.target.value)}
                    placeholder="Bort №"
                    className="w-full bg-transparent outline-none placeholder:text-black/30"
                  />
                </td>
                <td className="px-2 py-2 text-[13px]">
                  <input
                    type="text"
                    value={flight.callSign}
                    onChange={(e) => onUpdate(flight.id, 'callSign', e.target.value)}
                    placeholder="Çağırış"
                    className="w-full bg-transparent outline-none placeholder:text-black/30"
                  />
                </td>
                <td className="px-2 py-2 text-[13px]">
                  <input
                    type="text"
                    value={flight.crew}
                    onChange={(e) => onUpdate(flight.id, 'crew', e.target.value)}
                    placeholder="Heyət..."
                    className="w-full bg-transparent outline-none placeholder:text-black/30"
                  />
                </td>
                <td className="px-2 py-2 text-[13px]">
                  <input
                    type="text"
                    value={flight.purpose}
                    onChange={(e) => onUpdate(flight.id, 'purpose', e.target.value)}
                    placeholder="Məqsəd"
                    className="w-full bg-transparent outline-none placeholder:text-black/30"
                  />
                </td>
                <td className="px-2 py-2 text-[13px]">
                  <input
                    type="text"
                    value={flight.departureAerodrome}
                    onChange={(e) => onUpdate(flight.id, 'departureAerodrome', e.target.value)}
                    placeholder="Qalxış"
                    className="w-full bg-transparent outline-none uppercase placeholder:text-black/30"
                  />
                </td>
                <td className="px-2 py-2 text-[13px]">
                  <input
                    type="text"
                    value={flight.arrivalAerodrome}
                    onChange={(e) => onUpdate(flight.id, 'arrivalAerodrome', e.target.value)}
                    placeholder="Enmə"
                    className="w-full bg-transparent outline-none uppercase placeholder:text-black/30"
                  />
                </td>
                <td className="px-2 py-2 text-[13px]">
                  <input
                    type="time"
                    value={flight.departureTime}
                    onChange={(e) => onUpdate(flight.id, 'departureTime', e.target.value)}
                    className="w-full bg-transparent outline-none cursor-pointer font-mono"
                  />
                </td>
                <td className="px-2 py-2 text-[13px]">
                  <input
                    type="time"
                    value={flight.arrivalTime}
                    onChange={(e) => onUpdate(flight.id, 'arrivalTime', e.target.value)}
                    className="w-full bg-transparent outline-none cursor-pointer font-mono"
                  />
                </td>
                <td className="px-2 py-2 text-[13px] font-bold font-mono">
                  {flight.totalFlightTime || '-'}
                </td>
                <td className="px-2 py-2 text-center print:hidden">
                  <button
                    onClick={() => onDelete(flight.id)}
                    className="p-1 text-red-500 hover:bg-red-50 hover:text-red-700 rounded opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                    title="Sətri sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
