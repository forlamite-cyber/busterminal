package com.karachibusterminal.drivertracker

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

class MainActivity : AppCompatActivity() {

    private lateinit.dpBusIdInput: EditText
    private lateinit.statusText: TextView
    private lateinit.startBtn: Button
    private lateinit.stopBtn: Button

    companion object {
        private const val LOCATION_PERMISSION_REQUEST_CODE = 1001
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Simple programmatic layout for driver app UI
        val layout = android.widget.LinearLayout(this).apply {
            orientation = android.widget.LinearLayout.VERTICAL
            setPadding(48, 48, 48, 48)
            gravity = android.view.Gravity.CENTER_HORIZONTAL
        }

        val title = TextView(this).apply {
            text = "Karachi Bus Driver Tracker"
            textSize = 22f
            setTypeface(null, android.graphics.Typeface.BOLD)
            setTextColor(android.graphics.Color.parseColor("#059669"))
            gravity = android.view.Gravity.CENTER
        }
        layout.addView(title)

        val subtitle = TextView(this).apply {
            text = "Connected to Karachi Central Terminal"
            textSize = 14f
            setTextColor(android.graphics.Color.GRAY)
            gravity = android.view.Gravity.CENTER
            setPadding(0, 8, 0, 32)
        }
        layout.addView(subtitle)

        dpBusIdInput = EditText(this).apply {
            hint = "Enter Bus ID (e.g., FM-101)"
            setText("FM-101")
            setPadding(24, 24, 24, 24)
        }
        layout.addView(dpBusIdInput)

        statusText = TextView(this).apply {
            text = "Status: Service Stopped"
            textSize = 14f
            setTextColor(android.graphics.Color.DKGRAY)
            setPadding(0, 24, 0, 24)
            gravity = android.view.Gravity.CENTER
        }
        layout.addView(statusText)

        startBtn = Button(this).apply {
            text = "Start Live Tracking"
            setBackgroundColor(android.graphics.Color.parseColor("#059669"))
            setTextColor(android.graphics.Color.WHITE)
            setOnClickListener {
                checkAndStartTracking()
            }
        }
        layout.addView(startBtn)

        stopBtn = Button(this).apply {
            text = "Stop Tracking"
            setBackgroundColor(android.graphics.Color.parseColor("#DC2626"))
            setTextColor(android.graphics.Color.WHITE)
            setOnClickListener {
                stopService(Intent(this@MainActivity, LocationTrackerService::class.java))
                statusText.text = "Status: Service Stopped"
                Toast.makeText(this@MainActivity, "Tracking Stopped", Toast.LENGTH_SHORT).show()
            }
            setPadding(0, 16, 0, 0)
        }
        layout.addView(stopBtn)

        setContentView(layout)
    }

    private fun checkAndStartTracking() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION),
                LOCATION_PERMISSION_REQUEST_CODE
            )
        } else {
            startLocationService()
        }
    }

    private fun startLocationService() {
        val busId = dpBusIdInput.text.toString().trim()
        if (busId.isEmpty()) {
            Toast.makeText(this, "Please enter Bus ID", Toast.LENGTH_SHORT).show()
            return
        }

        val serviceIntent = Intent(this, LocationTrackerService::class.java).apply {
            putExtra("BUS_ID", busId)
        }
        ContextCompat.startForegroundService(this, serviceIntent)
        statusText.text = "Status: Live Tracking Active for $busId"
        Toast.makeText(this, "Live GPS Broadcast Started", Toast.LENGTH_SHORT).show()
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == LOCATION_PERMISSION_REQUEST_CODE) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                startLocationService()
            } else {
                Toast.makeText(this, "Location Permission is required for tracking", Toast.LENGTH_LONG).show()
            }
        }
    }
}
