import React, { useState } from 'react';
import { Bus, Plus, Search, Phone, MapPin, Users, Gauge, Edit3, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface BusData {
  id: string;
  busNumber: string;
  operator: string;
  route: string;
  origin: string;
  destination: string;
  driverName: string;
  driverPhone: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  status: string;
  passengers: number;
  capacity: number;
  departureTime: string;
  eta: string;
  fuelLevel: number;
  temperature: number;
  lastUpdated: string;
}

interface FleetManagerProps {
  buses: BusData[];
  onAddBus: (newBus: Partial<BusData>) => void;
}

export const FleetManager: React.FC<FleetManagerProps> = ({ buses, onAddBus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for new bus
  const [formData, setFormData] = useState({
    id: `BUS-${Math.floor(100 + Math.random() * 900)}`,
    busNumber: 'KHI-' + Math.floor(1000 + Math.random() * 9000),
    operator: 'Faisal Movers',
    route: 'Karachi to Lahore',
    origin: 'Karachi Sohrab Goth Terminal',
    destination: 'Lahore Badami Bagh',
    driverName: 'Muhammad Ali',
    driverPhone: '+92 300 9876543',
    passengers: 35,
    capacity: 45,
    departureTime: '09:00 AM',
    eta: '10:00 PM'
  });

  const filteredBuses = buses.filter(b => {
    if (selectedOperator !== 'ALL' && b.operator !== selectedOperator) return false;
    if (searchTerm && !b.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) && !b.driverName.toLowerCase().includes(searchTerm.toLowerCase()) && !b.route.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddBus({
      ...formData,
      lat: 24.9384,
      lng: 67.1122,
      speed: 0,
      heading: 0,
      status: 'Boarding',
      fuelLevel: 100,
      temperature: 24,
      lastUpdated: new Date().toISOString()
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
            <Bus className="w-6 h-6 text-emerald-400" />
            <span>Karachi Terminal Fleet Management</span>
          </h2>
          <p className="text-sm text-slate-400">Manage all registered intercity buses, operators, routes, and drivers.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-2.5 rounded-xl flex items-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Register New Bus / Route</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by bus number, driver name, or route..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <select
            value={selectedOperator}
            onChange={(e) => setSelectedOperator(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Transport Operators</option>
            <option value="Faisal Movers">Faisal Movers</option>
            <option value="Daewoo Express">Daewoo Express</option>
            <option value="Niazi Express">Niazi Express</option>
            <option value="Q-Connect Luxury">Q-Connect Luxury</option>
            <option value="Al-Madina Travels">Al-Madina Travels</option>
            <option value="Swat Coach & Bus">Swat Coach & Bus</option>
          </select>
        </div>
      </div>

      {/* Fleet Grid / Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase bg-slate-950/60 font-semibold tracking-wider">
                <th className="p-4">Bus / Operator</th>
                <th className="p-4">Route & Terminal</th>
                <th className="p-4">Driver Details</th>
                <th className="p-4">Status & Speed</th>
                <th className="p-4">Passengers</th>
                <th className="p-4">Departure & ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-sm">
              {filteredBuses.map(bus => (
                <tr key={bus.id} className="hover:bg-slate-800/50 transition-all">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                        🚌
                      </div>
                      <div>
                        <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded text-xs">
                          {bus.busNumber}
                        </span>
                        <div className="text-xs font-semibold text-emerald-300 mt-0.5">{bus.operator}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-medium text-white">{bus.route}</div>
                    <div className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{bus.origin}</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="font-semibold text-slate-200">{bus.driverName}</div>
                    <a href={`tel:${bus.driverPhone}`} className="text-xs text-emerald-400 flex items-center space-x-1 hover:underline mt-0.5">
                      <Phone className="w-3 h-3" />
                      <span>{bus.driverPhone}</span>
                    </a>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center space-x-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                        bus.status === 'In Transit' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        bus.status === 'Departed' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        <span>{bus.status}</span>
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
                      <Gauge className="w-3 h-3 text-teal-400" />
                      <span>{bus.speed} km/h</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="font-bold text-white">{bus.passengers} / {bus.capacity}</span>
                    </div>
                    <div className="w-24 bg-slate-800 rounded-full h-1.5 mt-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${(bus.passengers / bus.capacity) * 100}%` }}
                      />
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="text-xs text-slate-300">Dep: <span className="text-white font-medium">{bus.departureTime}</span></div>
                    <div className="text-xs text-emerald-400 font-semibold mt-0.5">ETA: {bus.eta}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Bus Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-white mb-4">Register New Bus / Route</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Bus Registration #</label>
                  <input
                    type="text"
                    required
                    value={formData.busNumber}
                    onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Operator / Company</label>
                  <select
                    value={formData.operator}
                    onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Faisal Movers">Faisal Movers</option>
                    <option value="Daewoo Express">Daewoo Express</option>
                    <option value="Niazi Express">Niazi Express</option>
                    <option value="Q-Connect Luxury">Q-Connect Luxury</option>
                    <option value="Al-Madina Travels">Al-Madina Travels</option>
                    <option value="Swat Coach & Bus">Swat Coach & Bus</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Route Title</label>
                <input
                  type="text"
                  required
                  value={formData.route}
                  onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g., Karachi to Lahore via M-5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Origin Terminal</label>
                  <input
                    type="text"
                    required
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Destination City</label>
                  <input
                    type="text"
                    required
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Driver Name</label>
                  <input
                    type="text"
                    required
                    value={formData.driverName}
                    onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Driver Phone #</label>
                  <input
                    type="text"
                    required
                    value={formData.driverPhone}
                    onChange={(e) => setFormData({ ...formData, driverPhone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-600/30 transition-all"
                >
                  Save & Register Bus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
