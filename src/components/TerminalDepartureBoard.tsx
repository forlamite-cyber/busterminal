import React from 'react';
import { Calendar, Clock, MapPin, Bus, ShieldCheck, AlertCircle } from 'lucide-react';

interface BusData {
  id: string;
  busNumber: string;
  operator: string;
  route: string;
  origin: string;
  destination: string;
  driverName: string;
  driverPhone: string;
  status: string;
  passengers: number;
  capacity: number;
  departureTime: string;
  eta: string;
}

interface TerminalDepartureBoardProps {
  buses: BusData[];
  terminals: Array<{ id: string; name: string; location: string; activeBuses: number; dailyDepartures: number }>;
}

export const TerminalDepartureBoard: React.FC<TerminalDepartureBoardProps> = ({ buses, terminals }) => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-emerald-400" />
            <span>Karachi Terminals Live Departure Board</span>
          </h2>
          <p className="text-sm text-slate-400">Real-time schedule of intercity departures from Karachi to all over Pakistan.</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-xl text-emerald-300 text-xs font-semibold flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Live Board Active • Updated {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Terminals Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {terminals.map(term => (
          <div key={term.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg">
            <h3 className="font-bold text-white text-sm truncate">{term.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{term.location}</p>
            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-semibold">{term.activeBuses} Active Buses</span>
              <span className="text-slate-400">{term.dailyDepartures} Daily</span>
            </div>
          </div>
        ))}
      </div>

      {/* Departure Schedule Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-950/60">
          <h3 className="font-bold text-white text-base">Upcoming & Departing Buses from Karachi</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase bg-slate-950/30 font-semibold tracking-wider">
                <th className="p-4">Time</th>
                <th className="p-4">Bus / Operator</th>
                <th className="p-4">Destination</th>
                <th className="p-4">Origin Terminal</th>
                <th className="p-4">Gate & Status</th>
                <th className="p-4">Manifest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-sm">
              {buses.map((bus, idx) => (
                <tr key={bus.id} className="hover:bg-slate-800/50 transition-all">
                  <td className="p-4 font-mono font-bold text-emerald-400 text-base">
                    {bus.departureTime}
                  </td>

                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs bg-slate-800 text-white px-2 py-0.5 rounded font-bold">
                        {bus.busNumber}
                      </span>
                      <span className="font-semibold text-white">{bus.operator}</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-emerald-300">{bus.destination}</div>
                    <div className="text-xs text-slate-400">{bus.route}</div>
                  </td>

                  <td className="p-4">
                    <div className="text-xs text-slate-300">{bus.origin}</div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded font-mono">
                        Gate #0{(idx % 4) + 1}
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        bus.status === 'In Transit' ? 'bg-emerald-500/20 text-emerald-300' :
                        bus.status === 'Boarding' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>
                        {bus.status}
                      </span>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-semibold text-white">{bus.passengers} / {bus.capacity} Seats</div>
                    <div className="text-xs text-slate-400">100% Booked</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
