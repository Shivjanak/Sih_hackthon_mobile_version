import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import * as Location from 'expo-location';
import { API_BASE_URL, endpoints } from '../api/config';

// Demo path coordinates for driving simulation
const DEMO_PATH = [
  { latitude: 26.1445, longitude: 91.7362 },
  { latitude: 26.1601, longitude: 91.8012 },
  { latitude: 26.1750, longitude: 91.9540 },
  { latitude: 26.1920, longitude: 92.1200 },
  { latitude: 26.2100, longitude: 92.3500 }, // Hazard area
  { latitude: 26.3450, longitude: 92.6840 }
];

export default function TrackingScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [speed, setSpeed] = useState(0);
  const [address, setAddress] = useState('Guwahati Highway');
  const [isSimulating, setIsSimulating] = useState(false);
  const simIndexRef = useRef(0);
  const simIntervalRef = useRef(null);

  // Request & Watch Native GPS Location
  useEffect(() => {
    let subscription = null;

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('GPS Permission Denied', 'Defaulting to simulation mode.');
        setLocation(DEMO_PATH[0]);
        return;
      }

      let initialLoc = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: initialLoc.coords.latitude,
        longitude: initialLoc.coords.longitude
      };
      setLocation(coords);

      // Subscribe to live GPS updates
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 5
        },
        (loc) => {
          if (!isSimulating) {
            const newCoords = {
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude
            };
            const currentSpeed = loc.coords.speed ? Math.round(loc.coords.speed * 3.6) : 42;
            setLocation(newCoords);
            setSpeed(currentSpeed);
            postGpsToBackend(newCoords.latitude, newCoords.longitude, currentSpeed);
          }
        }
      );
    })();

    return () => {
      if (subscription) subscription.remove();
      if (simIntervalRef.current) clearInterval(simIntervalRef.current);
    };
  }, []);

  const postGpsToBackend = async (lat, lon, currentSpeed) => {
    try {
      await fetch(endpoints.updateGps('TRK-9001'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lat: lat,
          lon: lon,
          speed: currentSpeed,
          location: `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`
        })
      });
    } catch (e) {
      console.log('Backend GPS sync offline');
    }
  };

  const toggleSimulation = () => {
    if (isSimulating) {
      clearInterval(simIntervalRef.current);
      setIsSimulating(false);
    } else {
      setIsSimulating(true);
      simIntervalRef.current = setInterval(() => {
        const nextIdx = (simIndexRef.current + 1) % DEMO_PATH.length;
        simIndexRef.current = nextIdx;
        const target = DEMO_PATH[nextIdx];
        const currentSpeed = Math.floor(45 + Math.random() * 20);

        setLocation(target);
        setSpeed(currentSpeed);
        setAddress(`NH-27 Km ${nextIdx * 15}`);
        postGpsToBackend(target.latitude, target.longitude, currentSpeed);

        if (nextIdx === 4) {
          Alert.alert(
            '⚠️ LANDSLIDE HAZARD AHEAD',
            'Hazard detected within 2.0 km on active route! Reroute suggested.',
            [
              { text: 'View Detour', onPress: () => navigation.navigate('Reroute') },
              { text: 'Dismiss', style: 'cancel' }
            ]
          );
        }
      }, 3000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* App Header */}
      <View style={styles.header}>
        <View style={styles.badgeContainer}>
          <View style={styles.liveDot} />
          <Text style={styles.headerTitle}>NEXUS-NER NATIVE GPS</Text>
        </View>
        <Text style={styles.headerSub}>{isSimulating ? 'DEMO SIMULATION' : 'LIVE HARDWARE'}</Text>
      </View>

      {/* Map Graphic Box */}
      <View style={styles.mapBox}>
        {location ? (
          <View style={styles.mapInfoContent}>
            <Text style={styles.mapMarkerText}>🚚 TRK-9001 ACTIVE POSITION</Text>
            <Text style={styles.coordText}>LAT: {location.latitude.toFixed(4)}°</Text>
            <Text style={styles.coordText}>LON: {location.longitude.toFixed(4)}°</Text>
            <Text style={styles.addressText}>📍 {address}</Text>

            <View style={styles.routeBox}>
              <Text style={styles.routeText}>DESTINATION: Nagaon Relief Base</Text>
              <Text style={styles.routeEta}>EST. ETA: 2h 15m (124 km)</Text>
            </View>
          </View>
        ) : (
          <ActivityIndicator size="large" color="#10b981" />
        )}
      </View>

      {/* Speedometer & Controls Card */}
      <View style={styles.bottomCard}>
        <View style={styles.speedGauge}>
          <Text style={styles.speedNum}>{speed}</Text>
          <Text style={styles.speedUnit}>KM/H</Text>
        </View>

        <TouchableOpacity
          style={[styles.simButton, isSimulating ? styles.simButtonActive : styles.simButtonInactive]}
          onPress={toggleSimulation}
        >
          <Text style={styles.simButtonText}>
            {isSimulating ? '⏸ PAUSE DRIVE SIM' : '▶ START DRIVE SIM'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 16
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b'
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10b981',
    marginRight: 8
  },
  headerTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  headerSub: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: '#064e3b',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4
  },
  mapBox: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 20,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  mapInfoContent: {
    alignItems: 'center'
  },
  mapMarkerText: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: 'black',
    marginBottom: 12
  },
  coordText: {
    color: '#94a3b8',
    fontSize: 14,
    fontFamily: 'monospace',
    marginVertical: 2
  },
  addressText: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10
  },
  routeBox: {
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
    alignItems: 'center'
  },
  routeText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: 'bold'
  },
  routeEta: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 4
  },
  bottomCard: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  speedGauge: {
    alignItems: 'center'
  },
  speedNum: {
    color: '#10b981',
    fontSize: 32,
    fontWeight: 'black'
  },
  speedUnit: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: 'bold'
  },
  simButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    shadowOpacity: 0.3
  },
  simButtonActive: {
    backgroundColor: '#d97706'
  },
  simButtonInactive: {
    backgroundColor: '#059669'
  },
  simButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13
  }
});
