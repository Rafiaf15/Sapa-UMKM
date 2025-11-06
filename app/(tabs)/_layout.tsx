import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
        tabBarStyle: { 
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#0a0e27',
          borderTopWidth: 1,
          borderTopColor: 'rgba(102, 126, 234, 0.2)',
          height: 65,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          position: 'absolute',
          elevation: 0,
          shadowColor: '#667eea',
          shadowOpacity: 0.1,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: -5 },
        },
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={80}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(10, 14, 39, 0.8)',
              }}
            />
          ) : null
        ),
        headerStyle: { 
          backgroundColor: '#0a0e27',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(102, 126, 234, 0.2)',
        },
        headerTitleStyle: { 
          color: '#fff', 
          fontWeight: '700',
          fontSize: 20,
        },
        headerTintColor: '#fff',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              color={color} 
              size={focused ? size + 2 : size} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="layanan"
        options={{
          title: 'Layanan',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "briefcase" : "briefcase-outline"} 
              color={color} 
              size={focused ? size + 2 : size} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="event"
        options={{
          title: 'Event',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "calendar" : "calendar-outline"} 
              color={color} 
              size={focused ? size + 2 : size} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              color={color} 
              size={focused ? size + 2 : size} 
            />
          ),
        }}
      />
    </Tabs>
  );
}