import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

import TrackingScreen from './src/screens/TrackingScreen';
import GeoPhotoScreen from './src/screens/GeoPhotoScreen';
import AlertsScreen from './src/screens/AlertsScreen';
import RerouteScreen from './src/screens/RerouteScreen';

const Tab = createBottomTabNavigator();

function TabIcon({ emoji, focused, label }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.6 }}>{emoji}</Text>
      <Text style={{ color: focused ? '#10b981' : '#64748b', fontSize: 10, fontWeight: focused ? 'bold' : 'normal', marginTop: 2 }}>
        {label}
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#0f172a',
            borderTopColor: '#1e293b',
            height: 65,
            paddingBottom: 8,
            paddingTop: 8
          },
          tabBarShowLabel: false
        }}
      >
        <Tab.Screen
          name="Tracking"
          component={TrackingScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon emoji="📍" focused={focused} label="Tracking" />
          }}
        />
        <Tab.Screen
          name="GeoPhoto"
          component={GeoPhotoScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon emoji="📸" focused={focused} label="Geo Photo" />
          }}
        />
        <Tab.Screen
          name="Alerts"
          component={AlertsScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon emoji="⚠️" focused={focused} label="Alerts" />
          }}
        />
        <Tab.Screen
          name="Reroute"
          component={RerouteScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon emoji="🔄" focused={focused} label="Reroute" />
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
