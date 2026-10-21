import React from 'react';
import { Bus, MapPin, LayoutDashboard, Calendar, Smartphone, BarChart3, ShieldCheck, Radio } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedTerminal: string;
  setSelectedTerminal: (terminal: string) => void;
  terminals: Array<{ id: string; name: string; location: string }>;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedTerminal,
  setSelectedTerminal,
  terminals
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Bus className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                  Karachi Bus Terminal Hub
                </span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                  🇵🇰 Pakistan Intercity
                </span>
              </div>
              <p className="text-xs text-slate-400">Live Fleet GPS Tracker & Multi-Operator Terminal System</p>
            </div>
          </div>

          {/* Terminal Selector Dropdown */}
          <div className="hidden lg:flex items-center space-x-2 bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-1.5">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <select
              value={selectedTerminal}
              onChange={(e) => setSelectedTerminal(e.target.value)}
              className="bg-transparent text-sm text-slate-200 focus:outline-none cursor-pointer font-medium"
            >
              <option value="ALL" className="bg-slate-900">All Karachi Terminals (All Hubs)</option>
              {terminals.map(t => (
                <option key={t.id} value={t.name} className="bg-slate-900">{t.name}</option>
              ))}
            </select>
          </div>

          {/* Quick Stats Indicator */}
          <div className="hidden xl:flex items-center space-x-4 bg-slate-800/50 border border-slate-700/50 px-4 py-2 rounded-xl text-xs">
            <div className="flex items-center space-x-1.5 text-emerald-400">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span className="font-semibold">GPS Gateway: Online</span>
            </div>
            <div className="h-4 w-px bg-slate-700" />
            <div className="text-slate-300">
              PST Time: <span className="font-mono text-emerald-300">{new Date().toLocaleTimeString()}</span>
            </div>
          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto pb-3 pt-1 border-t border-slate-800/80 scrollbar-none">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0 ${
              activeTab === 'map'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Live Pakistan Map</span>
          </button>

          <button
            onClick={() => setActiveTab('fleet')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0 ${
              activeTab === 'fleet'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Fleet Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('board')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0 ${
              activeTab === 'board'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Terminal Departure Board</span>
          </button>

          <button
            onClick={() => setActiveTab('android')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0 ${
              activeTab === 'android'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android APK & Driver App</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0 ${
              activeTab === 'analytics'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Reports & Analytics</span>
          </button>
        </div>

      </div>
    </header>
  );
};
