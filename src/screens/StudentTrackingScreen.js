import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import MapView from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import NotificationService from '../services/NotificationService';
import NotificationManager from '../managers/NotificationManager';

export default function StudentTrackingScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [pushToken, setPushToken] = useState(null);
  const [distance, setDistance] = useState(0.8);
  const [busInfo, setBusInfo] = useState({ busNumber: 'KA-05-1234', status: 'active' });

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    setupNotifications();

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Tapped:', response.notification.request.content.data);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const setupNotifications = async () => {
    const token = await NotificationService.registerForPushNotifications();
    setPushToken(token);
  };

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const token = await NotificationService.registerForPushNotifications();
      if (token) {
        setNotificationsEnabled(true);
        Alert.alert('Enabled', 'You will now receive notifications.');
      }
    } else {
      setNotificationsEnabled(false);
      await NotificationService.cancelAllNotifications();
      Alert.alert('Disabled', 'Bus notifications turned off.');
    }
  };

  const testNotification = async () => {
    await NotificationService.sendLocalNotification(
      '🧪 Test Notification',
      'This is a test notification from Bus Tracker.',
      { type: 'test' }
    );
  };

  // Simulate bus approaching and very close after few seconds
  useEffect(() => {
    setTimeout(() => NotificationManager.notifyBusNearby('KA-05-1234', 0.9), 3000);
    setTimeout(() => NotificationManager.notifyBusVeryClose('KA-05-1234', 0.4), 8000);
    setTimeout(() => NotificationManager.notifyTripStarted('KA-05-1234', 'Route-1'), 12000);
    setTimeout(() => NotificationManager.notifyTripEnded('KA-05-1234'), 16000);
  }, []);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} />
      <View style={styles.notificationCard}>
        <View style={styles.notificationHeader}>
          <Ionicons
            name={notificationsEnabled ? 'notifications' : 'notifications-off'}
            size={24}
            color={notificationsEnabled ? '#0073e6' : '#999'}
          />
          <Text style={styles.notificationTitle}>Bus Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#ccc', true: '#0073e6' }}
          />
        </View>

        {notificationsEnabled && (
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationText}>✅ You’ll be notified when bus is nearby</Text>
            <TouchableOpacity style={styles.testButton} onPress={testNotification}>
              <Text style={styles.testButtonText}>Send Test Notification</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.busNumber}>{busInfo.busNumber}</Text>
        <Text style={styles.distanceText}>📍 {distance.toFixed(1)} km away</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  notificationCard: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    elevation: 5,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  notificationInfo: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  notificationText: { fontSize: 13, color: '#27ae60', marginBottom: 10 },
  testButton: {
    backgroundColor: '#e3f2fd',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  testButtonText: { color: '#0073e6', fontSize: 13, fontWeight: '600' },
  infoCard: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 8,
  },
  busNumber: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50' },
  distanceText: { fontSize: 16, color: '#666', marginTop: 5 },
});
