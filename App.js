import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import StudentTrackingScreen from './src/screens/StudentTrackingScreen';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <StudentTrackingScreen />
    </SafeAreaView>
  );
}
