import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  status: 'In Transit' | 'Departed' | 'Boarding' | 'Arrived' | 'Delayed' | 'Maintenance';
  passengers: number;
  capacity: number;
  departureTime: string;
  eta: string;
  fuelLevel: number; // percentage
  temperature: number; // celsius
  lastUpdated: string;
}

const initialBuses: Bus[] = [
  {
    id: 'FM-101',
    busNumber: 'LX-7865',
    operator: 'Faisal Movers',
    route: 'Karachi to Lahore (M-5 Motorway)',
    origin: 'Karachi Sohrab Goth Terminal',
    destination: 'Lahore Badami Bagh',
    driverName: 'Tariq Mehmood',
    driverPhone: '+92 300 1234567',
    lat: 27.7155,
    lng: 68.8540,
    speed: 92,
    heading: 45,
    status: 'In Transit',
    passengers: 42,
    capacity: 45,
    departureTime: '06:00 AM',
    eta: '08:30 PM',
    fuelLevel: 68,
    temperature: 24,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'DW-402',
    busNumber: 'ISB-9921',
    operator: 'Daewoo Express',
    route: 'Karachi to Islamabad (M-4 & M-2)',
    origin: 'Karachi Super Highway Terminal',
    destination: 'Islamabad Tarnol Terminal',
    driverName: 'Muhammad Akram',
    driverPhone: '+92 321 9876543',
    lat: 28.4199,
    lng: 70.3015,
    speed: 88,
    heading: 30,
    status: 'In Transit',
    passengers: 38,
    capacity: 40,
    departureTime: '08:30 AM',
    eta: '11:45 PM',
    fuelLevel: 54,
    temperature: 22,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'NZ-303',
    busNumber: 'KPK-5512',
    operator: 'Niazi Express',
    route: 'Karachi to Peshawar',
    origin: 'Karachi Y-Area Korangi',
    destination: 'Peshawar General Bus Stand',
    driverName: 'Gul Khan',
    driverPhone: '+92 333 5551122',
    lat: 25.3960,
    lng: 68.3578,
    speed: 75,
    heading: 15,
    status: 'Departed',
    passengers: 45,
    capacity: 45,
    departureTime: '10:15 AM',
    eta: '04:00 AM (Next Day)',
    fuelLevel: 90,
    temperature: 26,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'QC-505',
    busNumber: 'QTA-1109',
    operator: 'Q-Connect Luxury',
    route: 'Karachi to Quetta (RCD Highway)',
    origin: 'Karachi Saddar Terminal',
    destination: 'Quetta Al-khidmat Terminal',
    driverName: 'Ahmed Bugti',
    driverPhone: '+92 345 7788990',
    lat: 25.8080,
    lng: 66.6210,
    speed: 64,
    heading: 320,
    status: 'In Transit',
    passengers: 28,
    capacity: 30,
    departureTime: '07:00 AM',
    eta: '06:30 PM',
    fuelLevel: 45,
    temperature: 19,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'AM-202',
    busNumber: 'MUL-3344',
    operator: 'Al-Madina Travels',
    route: 'Karachi to Multan',
    origin: 'Karachi Sohrab Goth Terminal',
    destination: 'Multan Chowk Kumharanwala',
    driverName: 'Saleem Raza',
    driverPhone: '+92 312 4433221',
    lat: 24.9384,
    lng: 67.1122,
    speed: 0,
    heading: 0,
    status: 'Boarding',
    passengers: 32,
    capacity: 45,
    departureTime: '11:30 AM',
    eta: '09:00 PM',
    fuelLevel: 95,
    temperature: 28,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'SW-809',
    busNumber: 'FSD-8822',
    operator: 'Swat Coach & Bus',
    route: 'Karachi to Faisalabad',
    origin: 'Karachi Super Highway Terminal',
    destination: 'Faisalabad General Bus Stand',
    driverName: 'Jamil Ahmed',
    driverPhone: '+92 301 6677889',
    lat: 26.6631,
    lng: 68.0012,
    speed: 85,
    heading: 40,
    status: 'In Transit',
    passengers: 40,
    capacity: 40,
    departureTime: '05:00 AM',
    eta: '07:30 PM',
    fuelLevel: 60,
    temperature: 25,
    lastUpdated: new Date().toISOString(),
  }
];

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // In-memory database of buses
  let buses: Bus[] = [...initialBuses];

  // API Routes
  app.get('/api/buses', (req, res) => {
    res.json(buses);
  });

  app.get('/api/buses/:id', (req, res) => {
    const bus = buses.find(b => b.id === req.params.id);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }
    res.json(bus);
  });

  app.post('/api/buses', (req, res) => {
    const newBus: Bus = {
      id: req.body.id || `BUS-${Math.floor(100 + Math.random() * 900)}`,
      busNumber: req.body.busNumber || 'KHI-786',
      operator: req.body.operator || 'Faisal Movers',
      route: req.body.route || 'Karachi to Lahore',
      origin: req.body.origin || 'Karachi Sohrab Goth Terminal',
      destination: req.body.destination || 'Lahore',
      driverName: req.body.driverName || 'Driver Name',
      driverPhone: req.body.driverPhone || '+92 300 0000000',
      lat: req.body.lat || 24.9384,
      lng: req.body.lng || 67.1122,
      speed: req.body.speed || 0,
      heading: req.body.heading || 0,
      status: req.body.status || 'Boarding',
      passengers: req.body.passengers || 0,
      capacity: req.body.capacity || 45,
      departureTime: req.body.departureTime || '12:00 PM',
      eta: req.body.eta || '10:00 PM',
      fuelLevel: 100,
      temperature: 25,
      lastUpdated: new Date().toISOString(),
    };
    buses.push(newBus);
    res.status(201).json(newBus);
  });

  // Android Driver App GPS ping endpoint
  app.post('/api/buses/:id/location', (req, res) => {
    const { lat, lng, speed, heading, status, passengers } = req.body;
    const busIndex = buses.findIndex(b => b.id === req.params.id);
    if (busIndex === -1) {
      return res.status(404).json({ error: 'Bus not found for tracking ID' });
    }

    buses[busIndex] = {
      ...buses[busIndex],
      lat: lat !== undefined ? Number(lat) : buses[busIndex].lat,
      lng: lng !== undefined ? Number(lng) : buses[busIndex].lng,
      speed: speed !== undefined ? Number(speed) : buses[busIndex].speed,
      heading: heading !== undefined ? Number(heading) : buses[busIndex].heading,
      status: status || buses[busIndex].status,
      passengers: passengers !== undefined ? Number(passengers) : buses[busIndex].passengers,
      lastUpdated: new Date().toISOString()
    };

    res.json({ success: true, bus: buses[busIndex] });
  });

  // Terminals in Karachi
  app.get('/api/terminals', (req, res) => {
    res.json([
      { id: 't1', name: 'Sohrab Goth Central Terminal', location: 'Super Highway, Karachi', activeBuses: 45, dailyDepartures: 120 },
      { id: 't2', name: 'Super Highway Intercity Terminal', location: 'M-9 Motorway Start, Karachi', activeBuses: 32, dailyDepartures: 95 },
      { id: 't3', name: 'Y-Area Korangi Terminal', location: 'Korangi Crossing, Karachi', activeBuses: 18, dailyDepartures: 40 },
      { id: 't4', name: 'Saddar Empress Market Terminal', location: 'Saddar, Karachi', activeBuses: 25, dailyDepartures: 60 },
      { id: 't5', name: 'Cantonment Station Bus Hub', location: 'Cantt Railway Station Area, Karachi', activeBuses: 15, dailyDepartures: 30 }
    ]);
  });

  // APK and GitHub Workflow template details
  app.get('/api/apk-info', (req, res) => {
    res.json({
      appName: 'KarachiBusDriverTracker.apk',
      version: '1.2.0',
      packageName: 'com.karachibusterminal.drivertracker',
      minSdk: 24,
      targetSdk: 34,
      githubWorkflowYaml: `name: Build Android Driver APK

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Set up JDK 17
      uses: actions/setup-java@v4
      with:
        distribution: 'temurin'
        java-version: '17'

    - name: Setup Android SDK
      uses: android-actions/setup-android@v3

    - name: Grant execute permission for gradlew
      run: chmod +x android/gradlew

    - name: Build Debug APK with Gradle
      run: |
        cd android
        ./gradlew assembleDebug

    - name: Upload APK Artifact
      uses: actions/upload-artifact@v4
      with:
        name: KarachiBusDriverTracker-Debug
        path: android/app/build/outputs/apk/debug/app-debug.apk`,
      androidKotlinSource: `// Android LocationTrackerService.kt (Foreground Service sending GPS to Karachi Terminal Server)
package com.karachibusterminal.drivertracker

import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.location.Location
import android.os.Looper
import com.google.android.gms.location.*
import java.net.HttpURLConnection
import java.net.URL

class LocationTrackerService : Service() {
    private lateinit.FusedLocationProviderClient fusedLocationClient;
    private lateinit.String serverUrl = "https://your-server-url.run.app/api/buses/";

    override fun onCreate() {
        super.onCreate()
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        startLocationUpdates()
    }

    private fun startLocationUpdates() {
        val locationRequest = LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, 10000)
            .setMinUpdateIntervalMillis(5000)
            .build()

        try {
            fusedLocationClient.requestLocationUpdates(locationRequest, object : LocationCallback() {
                override fun onLocationResult(locationResult: LocationResult) {
                    locationResult.lastLocation?.let { location ->
                        sendLocationToServer(location)
                    }
                }
            }, Looper.getMainLooper())
        } catch (e: SecurityException) {
            e.printStackTrace()
        }
    }

    private fun sendLocationToServer(loc: Location) {
        Thread {
            try {
                val busId = "FM-101" // Configured per bus driver login
                val url = URL("\$serverUrl\$busId/location")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "POST"
                conn.setRequestProperty("Content-Type", "application/json; utf-8")
                conn.doOutput = true

                val jsonInputString = "{\"lat\":\${loc.latitude},\"lng\":\${loc.longitude},\"speed\":\${loc.speed * 3.6},\"heading\":\${loc.bearing}}"
                conn.outputStream.write(jsonInputString.toByteArray(Charsets.UTF_8))
                conn.inputStream.close()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }.start()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}`
    });
  });

  // Vite integration in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Karachi Bus Terminal Fleet & GPS Tracker running on port ${PORT}`);
  });
}

startServer();
