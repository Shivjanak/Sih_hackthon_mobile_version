import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';

export default function RerouteScreen({ navigation }) {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
    Alert.alert('Reroute Applied', 'Safe detour applied to live navigation map.', [
      { text: 'OK', onPress: () => navigation.navigate('Tracking') }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>🔄 ALTERNATIVE SAFE REROUTE</Text>
        <Text style={styles.subtitle}>AI Dynamic Detour & Hazard Bypass Engine</Text>

        {/* Hazard Warning Header */}
        <View style={styles.hazardCard}>
          <Text style={styles.hazardTitle}>❌ PRIMARY CORRIDOR BLOCKED</Text>
          <Text style={styles.hazardDesc}>Landslide on NH-27 Km 60 (Nagaon Highway Dual Lane)</Text>
        </View>

        {/* Suggested Detour Card */}
        <View style={styles.detourCard}>
          <Text style={styles.detourHeader}>✅ SUGGESTED SAFE DETOUR</Text>
          <Text style={styles.detourName}>Via Sonitpur State Highway Detour</Text>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Distance</Text>
              <Text style={styles.statVal}>138 km</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Est. ETA</Text>
              <Text style={styles.statVal}>2h 15m</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Safety</Text>
              <Text style={styles.statValGreen}>100% Clear</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.acceptBtn, accepted && styles.acceptBtnDone]}
            onPress={handleAccept}
            disabled={accepted}
          >
            <Text style={styles.acceptBtnText}>
              {accepted ? '✓ DETOUR APPLIED TO MAP' : 'ACCEPT & APPLY SAFE REROUTE'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  scroll: { padding: 16 },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  subtitle: { color: '#94a3b8', fontSize: 12, marginBottom: 16 },
  hazardCard: {
    backgroundColor: '#450a0a',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ef4444',
    marginBottom: 14
  },
  hazardTitle: { color: '#fca5a5', fontWeight: 'bold', fontSize: 13 },
  hazardDesc: { color: '#cbd5e1', fontSize: 12, marginTop: 4 },
  detourCard: {
    backgroundColor: '#064e3b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#10b981'
  },
  detourHeader: { color: '#a7f3d0', fontSize: 11, fontWeight: 'bold' },
  detourName: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginVertical: 8 },
  statsRow: { flexDirection: 'row', gap: 10, marginVertical: 12 },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.6)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center'
  },
  statLabel: { color: '#94a3b8', fontSize: 10 },
  statVal: { color: '#fff', fontWeight: 'bold', fontSize: 13, marginTop: 2 },
  statValGreen: { color: '#10b981', fontWeight: 'bold', fontSize: 12, marginTop: 2 },
  acceptBtn: {
    backgroundColor: '#d97706',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8
  },
  acceptBtnDone: { backgroundColor: '#059669' },
  acceptBtnText: { color: '#0f172a', fontWeight: 'black', fontSize: 13 }
});
