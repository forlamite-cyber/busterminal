import React from 'react';
import { BarChart3, TrendingUp, Users, ShieldCheck, Fuel, Clock, Bus } from 'lucide-react';

interface BusData {
  id: string;
  operator: string;
  passengers: number;
  capacity: number;
  speed: number;
  fuelLevel: number;
  status: string;
}

interface AnalyticsViewProps {
  buses: BusData[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ buses }) => {
  const totalBuses = buses.length;
  const totalPassengers = buses.reduce((acc, b) => acc + b.passengers, 0);
  const totalCapacity = buses.reduce((acc, b) => acc + b.capacity, 0);
  const avgSpeed = Math.round(buses.reduce((acc, b) => acc + b.speed, 0) / (totalBuses || 1));
  const avgFuel = Math.round(buses.reduce((acc, b) => acc + b.fuelLevel, 0) / (totalBuses || 1));

  const operators = ['Faisal Movers', 'Daewoo Express', 'Niazi Express', 'Q-Connect Luxury', 'Al-Madina Travels', 'Swat Coach & Bus'];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-emerald-400" />
          <span>Karachi Terminal Fleet Analytics & Reports</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">Real-time occupancy rates, operator performance, fuel analytics, and transit punctuality.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Total Fleet Active</span>
            <Bus className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{totalBuses} Buses</div>
          <p className="text-xs text-emerald-400 mt-2">100% GPS Connected</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Passengers in Transit</span>
            <Users className="w-5 h-5 text-teal-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{totalPassengers} / {totalCapacity}</div>
          <p className="text-xs text-teal-400 mt-2">{Math.round((totalPassengers / totalCapacity) * 100)}% Seat Occupancy</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Average Fleet Speed</span>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{avgSpeed} km/h</div>
          <p className="text-xs text-slate-400 mt-2">Motorway Speed Regulation Safe</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Average Fuel Level</span>
            <Fuel className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{avgFuel}%</div>
          <p className="text-xs text-amber-400 mt-2">Optimal Long-Distance Range</p>
        </div>
      </div>

      {/* Operator Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Operator Fleet Share & Performance</h3>
        
        <div className="space-y-4">
          {operators.map((op, idx) => {
            const count = buses.filter(b => b.operator === op).length;
            const percentage = Math.round((count / (buses.length || 1)) * 100);
            return (
              <div key={op} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-white">{op}</span>
                  <span className="text-slate-400">{count} Active Buses ({percentage}%)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-600 to-teal-400 h-full rounded-full"
                    style={{ width: `${Math.max(percentage, 10)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
