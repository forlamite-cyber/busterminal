import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Bus as BusIcon, Navigation, Phone, Gauge, Users, Clock, AlertTriangle, ShieldCheck, Play, RefreshCw, Send } from 'lucide-react';

interface Bus {
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

interface LiveMapProps {
  buses: Bus[];
  selectedTerminal: string;
  onSelectBus: (bus: Bus) => void;
  onRefresh: () => void;
  onSimulateMove: (busId: string) => void;
}

export const LiveMap: React.FC<LiveMapProps> = ({
  buses,
  selectedTerminal,
  onSelectBus,
  onRefresh,
  onSimulateMove
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const [activeBus, setActiveBus] = useState<Bus | null>(null);
  const [filterOperator, setFilterOperator] = useState<string>('ALL');
  const [isSimulatingAll, setIsSimulatingAll] = useState(false);

  // Filter buses based on terminal and operator
  const filteredBuses = buses.filter(b => {
    if (filterOperator !== 'ALL' && b.operator !== filterOperator) return false;
    return true;
  });

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize Leaflet map centered on Pakistan (Karachi-Lahore highway corridor)
      const map = L.map(mapRef.current, {
        center: [27.5, 68.5], // Central Sindh / Motorway corridor
        zoom: 6,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Dark Matter or OpenStreetMap Carto tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when filteredBuses change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    filteredBuses.forEach(bus => {
      const isTransit = bus.status === 'In Transit' || bus.status === 'Departed';
      const colorClass = isTransit ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white';

      const customIcon = L.divIcon({
        className: 'custom-bus-marker',
        html: `
          <div style="background: ${isTransit ? '#059669' : '#d97706'}; color: white; border: 2px solid white; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-weight: bold; font-size: 12px; cursor: pointer;">
            🚌
          </div>
          <div style="background: rgba(15, 23, 42, 0.9); color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; white-space: nowrap; text-align: center; margin-top: 2px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            ${bus.busNumber} (${bus.speed} km/h)
          </div>
        `,
        iconSize: [36, 50],
        iconAnchor: [18, 18]
      });

      const marker = L.marker([bus.lat, bus.lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setActiveBus(bus);
        onSelectBus(bus);
        map.setView([bus.lat, bus.lng], 9, { animate: true });
      });

      markersRef.current[bus.id] = marker;
    });

  }, [filteredBuses]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
      
      {/* Sidebar List of Active Buses */}
      <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col shadow-xl overflow-hidden">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="font-bold text-white text-lg flex items-center space-x-2">
              <BusIcon className="w-5 h-5 text-emerald-400" />
              <span>Fleet Tracking</span>
            </h2>
            <p className="text-xs text-slate-400">Karachi Terminal Active Buses</p>
          </div>
          <button
            onClick={onRefresh}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg transition-all"
            title="Refresh GPS"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Operator Filter */}
        <div className="my-3">
          <label className="text-xs text-slate-400 block mb-1">Filter Operator</label>
          <select
            value={filterOperator}
            onChange={(e) => setFilterOperator(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Operators (Faisal, Daewoo, etc.)</option>
            <option value="Faisal Movers">Faisal Movers</option>
            <option value="Daewoo Express">Daewoo Express</option>
            <option value="Niazi Express">Niazi Express</option>
            <option value="Q-Connect Luxury">Q-Connect Luxury</option>
            <option value="Al-Madina Travels">Al-Madina Travels</option>
            <option value="Swat Coach & Bus">Swat Coach & Bus</option>
          </select>
        </div>

        {/* Bus Cards List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
          {filteredBuses.map(bus => {
            const isSelected = activeBus?.id === bus.id;
            return (
              <div
                key={bus.id}
                onClick={() => {
                  setActiveBus(bus);
                  onSelectBus(bus);
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.setView([bus.lat, bus.lng], 9, { animate: true });
                  }
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold bg-slate-700 px-2 py-0.5 rounded text-emerald-300">
                      {bus.busNumber}
                    </span>
                    <span className="text-xs font-semibold text-white">{bus.operator}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    bus.status === 'In Transit' ? 'bg-emerald-500/20 text-emerald-300' :
                    bus.status === 'Departed' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-amber-500/20 text-amber-300'
                  }`}>
                    {bus.status}
                  </span>
                </div>

                <div className="text-xs text-slate-300 font-medium mb-1 truncate">
                  📍 {bus.route}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-700/55">
                  <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
                    <Gauge className="w-3.5 h-3.5" />
                    <span>{bus.speed} km/h</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{bus.passengers}/{bus.capacity}</span>
                  </span>
                  <span className="text-slate-400">
                    {bus.eta}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Main Map Area & Active Bus Modal Drawer */}
      <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl relative shadow-xl overflow-hidden flex flex-col">
        
        {/* Map Header Overlay */}
        <div className="absolute top-4 left-4 z-[400] bg-slate-900/90 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-xl shadow-lg flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-white">Pakistan National Corridor Live GPS</span>
          </div>
          <span className="text-xs text-slate-400 border-l border-slate-700 pl-4">
            Karachi Terminals ➔ Hyderabad ➔ Sukkur ➔ Multan ➔ Lahore ➔ Islamabad
          </span>
        </div>

        {/* Map Container */}
        <div ref={mapRef} className="flex-1 w-full h-full z-10" />

        {/* Selected Bus Floating Info Card */}
        {activeBus && (
          <div className="absolute bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:w-96 z-[400] bg-slate-900/95 backdrop-blur-md border border-slate-700 p-5 rounded-2xl shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="bg-emerald-600 text-white font-mono font-bold text-sm px-2.5 py-1 rounded-lg">
                  {activeBus.busNumber}
                </span>
                <div>
                  <h3 className="font-bold text-white text-sm">{activeBus.operator}</h3>
                  <p className="text-xs text-slate-400">{activeBus.route}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveBus(null)}
                className="text-slate-400 hover:text-white text-lg font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-800/80 p-3 rounded-xl mb-3 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block">Current Speed</span>
                <span className="text-sm font-extrabold text-emerald-400">{activeBus.speed} km/h</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Passengers</span>
                <span className="text-sm font-extrabold text-white">{activeBus.passengers}/{activeBus.capacity}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Fuel Level</span>
                <span className="text-sm font-extrabold text-teal-400">{activeBus.fuelLevel}%</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Driver:</span>
                <span className="font-semibold text-white">{activeBus.driverName} ({activeBus.driverPhone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Departure:</span>
                <span className="text-white">{activeBus.departureTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Arrival (ETA):</span>
                <span className="text-emerald-300 font-bold">{activeBus.eta}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onSimulateMove(activeBus.id)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-600/30 transition-all"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Simulate GPS Ping</span>
              </button>
              <a
                href={`tel:${activeBus.driverPhone}`}
                className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Driver</span>
              </a>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
