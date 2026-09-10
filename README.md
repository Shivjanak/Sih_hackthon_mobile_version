# NEXUS-NER React Native Mobile Application

Dedicated cross-platform mobile application for Android & iOS built using **React Native + Expo SDK 51**, connected directly to the Python FastAPI SQLite backend database.

---

## 📱 Features

1. **Native GPS Location Tracking**: Uses `expo-location` for hardware GPS position updates and posts live coordinates to the Python FastAPI backend (`POST /api/vehicles/TRK-9001/gps`).
2. **Native Camera & Geo Photo Storage**: Uses `expo-image-picker` to snap photos on physical mobile cameras, automatically attaching latitude, longitude, and hazard notes, saving directly to SQLite (`/api/geo-photos`).
3. **Instant Proximity Siren Alerts**: Real-time hazard detection with emergency alert modals.
4. **Alternative Detour Rerouting**: AI route comparison and detour application.

---

## 🚀 Quick Start Guide (Run on Your Mobile Device)

### 1. Install Expo CLI / Expo Go on Phone
Download the **Expo Go** app on your phone:
- Android: Play Store -> Search **"Expo Go"**
- iPhone: App Store -> Search **"Expo Go"**

### 2. Install Project Dependencies
Open a terminal in the `mobile-app` directory:
```bash
cd mobile-app
npm install
```

### 3. Start Expo Dev Server
```bash
npx expo start
```

### 4. Scan QR Code
- Open **Expo Go** on your Android / iPhone.
- Scan the QR code displayed in your computer terminal.
- The app will build and run natively on your phone instantly!
