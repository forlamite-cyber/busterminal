import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Github, Code, Terminal, CheckCircle2, Copy, Play, RefreshCw, Radio } from 'lucide-react';

interface AndroidAppPortalProps {
  buses: Array<{ id: string; busNumber: string; operator: string; route: string }>;
  onSimulateMove: (busId: string, customSpeed?: number) => void;
}

export const AndroidAppPortal: React.FC<AndroidAppPortalProps> = ({ buses, onSimulateMove }) => {
  const [apkInfo, setApkInfo] = useState<any>(null);
  const [copiedYaml, setCopiedYaml] = useState(false);
  const [copiedKotlin, setCopiedKotlin] = useState(false);
  const [selectedBusForSim, setSelectedBusForSim] = useState(buses[0]?.id || '');
  const [simSpeed, setSimSpeed] = useState(90);
  const [simStatus, setSimStatus] = useState('In Transit');

  useEffect(() => {
    fetch('/api/apk-info')
      .then(res => res.json())
      .then(data => setApkInfo(data))
      .catch(err => console.error(err));
  }, []);

  const handleCopyYaml = () => {
    if (apkInfo?.githubWorkflowYaml) {
      navigator.clipboard.writeText(apkInfo.githubWorkflowYaml);
      setCopiedYaml(true);
      setTimeout(() => setCopiedYaml(false), 2500);
    }
  };

  const handleCopyKotlin = () => {
    if (apkInfo?.androidKotlinSource) {
      navigator.clipboard.writeText(apkInfo.androidKotlinSource);
      setCopiedKotlin(true);
      setTimeout(() => setCopiedKotlin(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/30 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Smartphone className="w-4 h-4" />
            <span>Android APK Driver Tracker App</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Karachi Bus Driver Companion App</h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Each bus driver installs this APK on their Android phone. It runs a secure background service that continuously transmits real-time GPS coordinates, speed, and status to the Karachi terminal dashboard.
          </p>
        </div>

        <div className="flex flex-col space-y-2 shrink-0">
          <button
            onClick={() => alert('To get your APK build automatically, push this repository to GitHub and GitHub Actions will build app-debug.apk in the Actions tab!')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-3 rounded-xl flex items-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all"
          >
            <Download className="w-5 h-5" />
            <span>Download Driver APK (v1.2)</span>
          </button>
          <span className="text-[11px] text-slate-400 text-center">Android 7.0+ (API 24) Compatible</span>
        </div>
      </div>

      {/* GitHub Actions Workflow YAML Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2">
            <Github className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">GitHub Actions YAML Workflow for APK Compilation</h3>
          </div>
          <button
            onClick={handleCopyYaml}
            className="bg-slate-800 hover:bg-slate-700 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all"
          >
            {copiedYaml ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedYaml ? 'Copied YAML!' : 'Copy Workflow YAML'}</span>
          </button>
        </div>

        <div className="p-4 bg-slate-950">
          <p className="text-xs text-slate-400 mb-3">
            Save this file at <code className="text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded">.github/workflows/build-apk.yml</code> in your GitHub repository. Whenever you push changes, GitHub will automatically compile your Android APK!
          </p>
          <pre className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto max-h-72">
            {apkInfo?.githubWorkflowYaml || 'Loading workflow...'}
          </pre>
        </div>
      </div>

      {/* Android Driver Simulator & Testing Hub */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
          <h3 className="font-bold text-white text-lg">Live Android Driver GPS Simulator</h3>
        </div>
        <p className="text-xs text-slate-400 mb-6">
          Test live GPS telemetry simulation directly from your browser. This replicates what the Android driver app sends when traveling across the M-5 Motorway towards Lahore or Islamabad.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-xs text-slate-400 block mb-1">Select Bus / Driver</label>
            <select
              value={selectedBusForSim}
              onChange={(e) => setSelectedBusForSim(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              {buses.map(b => (
                <option key={b.id} value={b.id}>{b.busNumber} - {b.operator} ({b.route})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Simulated Speed (km/h): {simSpeed}</label>
            <input
              type="range"
              min="20"
              max="120"
              value={simSpeed}
              onChange={(e) => setSimSpeed(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">Driver Status</label>
            <select
              value={simStatus}
              onChange={(e) => setSimStatus(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="In Transit">In Transit</option>
              <option value="Departed">Departed</option>
              <option value="Delayed">Delayed</option>
              <option value="Arrived">Arrived</option>
            </select>
          </div>

          <button
            onClick={() => onSimulateMove(selectedBusForSim, simSpeed)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all"
          >
            <Play className="w-4 h-4" />
            <span>Send GPS Ping Now</span>
          </button>
        </div>
      </div>

      {/* Android Kotlin Source Code Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">Android Background Location Tracker (Kotlin Source)</h3>
          </div>
          <button
            onClick={handleCopyKotlin}
            className="bg-slate-800 hover:bg-slate-700 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all"
          >
            {copiedKotlin ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedKotlin ? 'Copied Code!' : 'Copy Kotlin Code'}</span>
          </button>
        </div>

        <div className="p-4 bg-slate-950">
          <pre className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto max-h-80">
            {apkInfo?.androidKotlinSource || 'Loading Kotlin source...'}
          </pre>
        </div>
      </div>

    </div>
  );
};
