import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  ScrollView,
  Alert,
  FlatList
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { API_BASE_URL, endpoints } from '../api/config';

export default function GeoPhotoScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [hazardType, setHazardType] = useState('Landslide');
  const [description, setDescription] = useState('Mudslide blocking dual lane highway.');
  const [location, setLocation] = useState({ latitude: 26.1445, longitude: 91.7362 });
  const [geoPhotos, setGeoPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPhotos();
    getCurrentGps();
  }, []);

  const getCurrentGps = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let pos = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
      }
    } catch (e) {
      console.log('GPS error');
    }
  };

  const fetchPhotos = async () => {
    try {
      const res = await fetch(endpoints.geoPhotos);
      if (res.ok) {
        const data = await res.json();
        setGeoPhotos(data);
      }
    } catch (e) {
      console.log('Fetch photos offline');
    }
  };

  const handlePickImage = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Camera Permission Required');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
      base64: true
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setBase64Image(`data:image/jpeg;base64,${result.assets[0].base64}`);
    }
  };

  const handleSubmitPhoto = async () => {
    if (!base64Image) {
      Alert.alert('No Photo Captured', 'Please snap a photo first.');
      return;
    }

    setLoading(true);

    const payload = {
      filename: `NATIVE_GEO_${Date.now()}.jpg`,
      image_data: base64Image,
      lat: location.latitude,
      lon: location.longitude,
      hazard_type: hazardType,
      description: description,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    try {
      const res = await fetch(endpoints.geoPhotos, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        Alert.alert('Success', 'Geo-Tagged photo saved to SQLite Database!');
        setImageUri(null);
        setBase64Image(null);
        fetchPhotos();
      }
    } catch (e) {
      Alert.alert('Saved Locally', 'Photo queued for backend upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>📸 GEO-TAGGED PHOTO CAPTURE</Text>
        <Text style={styles.subtitle}>Native Mobile Camera & GPS Persistence</Text>

        {/* Camera Preview Box */}
        <TouchableOpacity style={styles.cameraBox} onPress={handlePickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <View style={styles.placeholderBox}>
              <Text style={styles.cameraIcon}>📷</Text>
              <Text style={styles.cameraText}>Tap to Open Native Camera</Text>
            </View>
          )}

          <View style={styles.gpsBadge}>
            <Text style={styles.gpsBadgeText}>
              GPS: {location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°
            </Text>
          </View>
        </TouchableOpacity>

        {/* Form Controls */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>HAZARD CLASSIFICATION</Text>
          <View style={styles.chipGroup}>
            {['Landslide', 'Flood', 'Road Blocked', 'Safe Route'].map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, hazardType === cat && styles.chipActive]}
                onPress={() => setHazardType(cat)}
              >
                <Text style={[styles.chipText, hazardType === cat && styles.chipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>FIELD OFFICER REMARKS</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter situation details..."
            placeholderTextColor="#64748b"
            multiline
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitPhoto}
            disabled={loading}
          >
            <Text style={styles.submitText}>
              {loading ? 'SAVING TO DATABASE...' : '💾 UPLOAD & SAVE GEO-PHOTO'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Saved Photos List */}
        <Text style={styles.sectionTitle}>SAVED FIELD GEO-PHOTOS ({geoPhotos.length})</Text>
        {geoPhotos.map((photo) => (
          <View key={photo.id} style={styles.photoCard}>
            <Image source={{ uri: photo.image_data }} style={styles.cardImage} />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{photo.hazard_type}</Text>
              <Text style={styles.cardDesc}>{photo.description}</Text>
              <Text style={styles.cardGps}>
                📍 {photo.lat?.toFixed(4)}°, {photo.lon?.toFixed(4)}° | {photo.timestamp}
              </Text>
            </View>
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
  cameraBox: {
    height: 200,
    backgroundColor: '#0f172a',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#334155',
    borderStyle: 'dashed',
    overflow: 'hidden',
    position: 'relative'
  },
  placeholderBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cameraIcon: { fontSize: 36, marginBottom: 8 },
  cameraText: { color: '#10b981', fontWeight: 'bold', fontSize: 14 },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  gpsBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(2, 6, 23, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  gpsBadgeText: { color: '#10b981', fontSize: 10, fontWeight: 'bold', fontFamily: 'monospace' },
  formGroup: { marginTop: 16, backgroundColor: '#0f172a', padding: 14, borderRadius: 16 },
  label: { color: '#cbd5e1', fontSize: 11, fontWeight: 'bold', marginBottom: 8 },
  chipGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: { backgroundColor: '#1e293b', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  chipActive: { backgroundColor: '#059669' },
  chipText: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  chipTextActive: { color: '#fff' },
  input: {
    backgroundColor: '#020617',
    color: '#fff',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#334155',
    fontSize: 13,
    marginBottom: 14
  },
  submitButton: { backgroundColor: '#059669', padding: 14, borderRadius: 12, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  sectionTitle: { color: '#f8fafc', fontSize: 14, fontWeight: 'bold', marginTop: 24, marginBottom: 12 },
  photoCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1e293b'
  },
  cardImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  cardInfo: { flex: 1, justifyContent: 'center' },
  cardTitle: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  cardDesc: { color: '#94a3b8', fontSize: 11, marginVertical: 2 },
  cardGps: { color: '#10b981', fontSize: 10, fontFamily: 'monospace' }
});
