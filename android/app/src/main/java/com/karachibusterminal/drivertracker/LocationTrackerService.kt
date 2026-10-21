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
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private var busId: String = "FM-101"
    private val serverUrl = "https://ais-dev-ie6dwyt72najnc5g3jrw4j-371795666716.asia-east1.run.app/api/buses/"

    override fun onCreate() {
        super.onCreate()
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        intent?.getStringExtra("BUS_ID")?.let {
            busId = it
        }
        startLocationUpdates()
        return START_STICKY
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
                val url = URL("$serverUrl$busId/location")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "POST"
                conn.setRequestProperty("Content-Type", "application/json; utf-8")
                conn.doOutput = true

                val jsonInputString = "{\"lat\":${loc.latitude},\"lng\":${loc.longitude},\"speed\":${loc.speed * 3.6},\"heading\":${loc.bearing}}"
                conn.outputStream.write(jsonInputString.toByteArray(Charsets.UTF_8))
                conn.inputStream.close()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }.start()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
