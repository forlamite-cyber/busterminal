import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LiveMap } from './components/LiveMap';
import { FleetManager } from './components/FleetManager';
import { TerminalDepartureBoard } from './components/TerminalDepartureBoard';
import { AndroidAppPortal } from './components/AndroidAppPortal';
import { AnalyticsView } from './components/AnalyticsView';

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

export default function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedTerminal, setSelectedTerminal] = useState('ALL');
  const [buses, setBuses] = useState<Bus[]>([]);
  const [terminals, setTerminals] = useState<Array<{ id: string; name: string; location: string; activeBuses: number; dailyDepartures: number }>>([]);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

  const fetchBuses = async () => {
    try {
      const res = await fetch('/api/buses');
      const data = await res.json();
      setBuses(data);
    } catch (err) {
      console.error('Failed to fetch buses:', err);
    }
  };

  const fetchTerminals = async () => {
    try {
      const res = await fetch('/api/terminals');
      const data = await res.json();
      setTerminals(data);
    } catch (err) {
      console.error('Failed to fetch terminals:', err);
    }
  };

  useEffect(() => {
    fetchBuses();
    fetchTerminals();

    // Poll every 5 seconds for live GPS updates from Android driver app / simulator
    const interval = setInterval(fetchBuses, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAddBus = async (newBusData: Partial<Bus>) => {
    try {
      const res = await fetch('/api/buses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBusData)
      });
      if (res.ok) {
        fetchBuses();
      }
    } catch (err) {
      console.error('Failed to add bus:', err);
    }
  };

  const handleSimulateMove = async (busId: string, customSpeed?: number) => {
    const bus = buses.find(b => b.id === busId);
    if (!bus) return;

    // Simulate movement along Pakistan highway corridor (Karachi towards Lahore / Islamabad)
    const newLat = bus.lat + (Math.random() * 0.2 - 0.05);
    const newLng = bus.lng + (Math.random() * 0.3 + 0.05);
    const speed = customSpeed || Math.floor(70 + Math.random() * 45);

    try {
      await fetch(`/api/buses/${busId}/location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: newLat,
          lng: newLng,
          speed: speed,
          heading: Math.floor(Math.random() * 360),
          status: 'In Transit',
          passengers: bus.passengers
        })
      });
      fetchBuses();
    } catch (err) {
      console.error('Failed to simulate move:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedTerminal={selectedTerminal}
        setSelectedTerminal={setSelectedTerminal}
        terminals={terminals}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'map' && (
          <LiveMap
            buses={buses}
            selectedTerminal={selectedTerminal}
            onSelectBus={(bus) => setSelectedBus(bus)}
            onRefresh={fetchBuses}
            onSimulateMove={handleSimulateMove}
          />
        )}

        {activeTab === 'fleet' && (
          <FleetManager
            buses={buses}
            onAddBus={handleAddBus}
          />
        )}

        {activeTab === 'board' && (
          <TerminalDepartureBoard
            buses={buses}
            terminals={terminals}
          />
        )}

        {activeTab === 'android' && (
          <AndroidAppPortal
            buses={buses}
            onSimulateMove={handleSimulateMove}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            buses={buses}
          />
        )}
      </main>
    </div>
  );
}
