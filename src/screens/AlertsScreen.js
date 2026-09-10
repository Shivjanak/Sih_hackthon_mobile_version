import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import { endpoints } from '../api/config';

export default function AlertsScreen({ navigation }) {
  const [incidents, setIncidents] = useState([]);
  const [activeAlert, setActiveAlert] = useState(null);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const res = await fetch(endpoints.incidents);
      if (res.ok) {
        const data = await res.json();
        setIncidents(data);
      }
    } catch (e) {
      console.log('Fetch incidents error');
    }
  };

  const triggerTestAlert = () => {
    setActiveAlert({
      title: 'CRITICAL HAZARD DETECTED AHEAD',
      type: 'Landslide',
      location: 'NH-27 Km 60 (Nagaon Bypass)',
      distance: '1.8 km away',
      action: 'Immediate detour suggested via Tezpur Highway'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>⚠️ INSTANT HAZARD ALERTS</Text>
        <Text style={styles.subtitle}>Real-Time Proximity Siren & NDMA Emergency Feeds</Text>

        {/* Test Siren Button */}
        <TouchableOpacity style={styles.sirenButton} onPress={triggerTestAlert}>
          <Text style={styles.sirenText}>🔊 SIMULATE EMERGENCY SIREN ALERT</Text>
        </TouchableOpacity>

        {/* Active Alert Overlay */}
        {activeAlert && (
          <View style={styles.alertCardActive}>
            <Text style={styles.alertCardTitle}>⚠️ {activeAlert.title}</Text>
            <Text style={styles.alertCardLoc}>{activeAlert.location} ({activeAlert.distance})</Text>
            <Text style={styles.alertCardAction}>💡 {activeAlert.action}</Text>

            <TouchableOpacity
              style={styles.rerouteBtn}
              onPress={() => navigation.navigate('Reroute')}
            >
              <Text style={styles.rerouteBtnText}>VIEW DETOUR REROUTE ➔</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Live Feeds List */}
        <Text style={styles.feedTitle}>LIVE ROAD BLOCKAGES & ALERTS ({incidents.length})</Text>
        {incidents.map((item) => (
          <View key={item.id} style={styles.feedCard}>
            <View style={styles.feedHeader}>
              <Text style={styles.feedType}>🚨 {item.type}</Text>
              <Text style={styles.feedSeverity}>{item.severity}</Text>
            </View>
            <Text style={styles.feedDesc}>{item.description}</Text>
            <Text style={styles.feedLoc}>📍 {item.location}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scroll: { padding: 16 },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  subtitle: { color: '#94a3b8', fontSize: 12, marginBottom: 16 },
  sirenButton: {
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16
  },
  sirenText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  alertCardActive: {
    backgroundColor: '#450a0a',
    borderWidth: 2,
    borderColor: '#ef4444',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20
  },
  alertCardTitle: { color: '#fca5a5', fontSize: 14, fontWeight: 'bold' },
  alertCardLoc: { color: '#fff', fontSize: 12, marginVertical: 4 },
  alertCardAction: { color: '#cbd5e1', fontSize: 11, marginTop: 4 },
  rerouteBtn: {
    backgroundColor: '#d97706',
    padding: 10,
    borderRadius: 10,
    marginTop: 12,
    alignItems: 'center'
  },
  rerouteBtnText: { color: '#0f172a', fontWeight: 'bold', fontSize: 12 },
  feedTitle: { color: '#f8fafc', fontSize: 13, fontWeight: 'bold', marginBottom: 12 },
  feedCard: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  feedHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  feedType: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  feedSeverity: {
    color: '#ef4444',
    fontWeight: 'bold',
    fontSize: 10,
    backgroundColor: '#450a0a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4
  },
  feedDesc: { color: '#94a3b8', fontSize: 12 },
  feedLoc: { color: '#10b981', fontSize: 11, marginTop: 6, fontFamily: 'monospace' }
});
