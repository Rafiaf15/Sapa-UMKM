import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const categories = ['Semua', 'Workshop', 'Webinar', 'Pelatihan', 'Networking'];

const events = [
  {
    id: 1,
    title: 'Workshop Digital Marketing untuk UMKM',
    date: '15 Nov 2024',
    time: '14:00 - 16:00',
    type: 'Workshop',
    location: 'Online via Zoom',
    price: 'Gratis',
    slots: 45,
    maxSlots: 50,
    category: 'Marketing',
    color: '#667eea',
    icon: '📱',
  },
  {
    id: 2,
    title: 'Pelatihan Manajemen Keuangan Bisnis',
    date: '18 Nov 2024',
    time: '09:00 - 12:00',
    type: 'Pelatihan',
    location: 'Gedung UMKM Center, Jakarta',
    price: 'Rp 50.000',
    slots: 12,
    maxSlots: 30,
    category: 'Keuangan',
    color: '#f093fb',
    icon: '💰',
  },
  {
    id: 3,
    title: 'Webinar Ekspor Produk UMKM',
    date: '20 Nov 2024',
    time: '19:00 - 21:00',
    type: 'Webinar',
    location: 'Online via Google Meet',
    price: 'Gratis',
    slots: 150,
    maxSlots: 200,
    category: 'Ekspor',
    color: '#4facfe',
    icon: '🌏',
  },
  {
    id: 4,
    title: 'Networking UMKM Food & Beverage',
    date: '22 Nov 2024',
    time: '16:00 - 18:00',
    type: 'Networking',
    location: 'Cafe Kolab, Bandung',
    price: 'Rp 75.000',
    slots: 8,
    maxSlots: 25,
    category: 'F&B',
    color: '#43e97b',
    icon: '🍴',
  },
  {
    id: 5,
    title: 'Pelatihan Fotografi Produk',
    date: '25 Nov 2024',
    time: '13:00 - 16:00',
    type: 'Pelatihan',
    location: 'Studio Fotografi Pro, Surabaya',
    price: 'Rp 100.000',
    slots: 5,
    maxSlots: 15,
    category: 'Marketing',
    color: '#fa709a',
    icon: '📸',
  },
];

export default function EventScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);
  const [eventSlots, setEventSlots] = useState<{[key: number]: number}>({});

  useEffect(() => {
    checkLoginStatus();
    loadRegisteredEvents();
    loadEventSlots();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const loggedIn = await AsyncStorage.getItem('isLoggedIn');
      const isUserLoggedIn = loggedIn === 'true';
      setIsLoggedIn(isUserLoggedIn);
      
      // If not logged in, clear registered events
      if (!isUserLoggedIn) {
        setRegisteredEvents([]);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  const loadRegisteredEvents = async () => {
    try {
      const loggedIn = await AsyncStorage.getItem('isLoggedIn');
      
      // Only load registered events if user is logged in
      if (loggedIn === 'true') {
        const registered = await AsyncStorage.getItem('registeredEvents');
        if (registered) {
          setRegisteredEvents(JSON.parse(registered));
        }
      } else {
        setRegisteredEvents([]);
      }
    } catch (error) {
      console.error('Error loading registered events:', error);
    }
  };

  const loadEventSlots = async () => {
    try {
      const slots = await AsyncStorage.getItem('eventSlots');
      if (slots) {
        setEventSlots(JSON.parse(slots));
      } else {
        // Initialize slots from default events
        const initialSlots: {[key: number]: number} = {};
        events.forEach(event => {
          initialSlots[event.id] = event.slots;
        });
        setEventSlots(initialSlots);
        await AsyncStorage.setItem('eventSlots', JSON.stringify(initialSlots));
      }
    } catch (error) {
      console.error('Error loading event slots:', error);
    }
  };

  const handleRegisterEvent = async (eventId: number, eventTitle: string) => {
    if (!isLoggedIn) {
      Alert.alert(
        'Login Diperlukan',
        'Anda harus login terlebih dahulu untuk mendaftar event',
        [
          { text: 'Batal', style: 'cancel' },
          { 
            text: 'Login', 
            onPress: () => router.push('/login/login') 
          }
        ]
      );
      return;
    }

    // Check if already registered
    if (registeredEvents.includes(eventId)) {
      Alert.alert('Info', 'Anda sudah terdaftar di event ini');
      return;
    }

    // Check if slots available
    const currentSlots = eventSlots[eventId] || 0;
    if (currentSlots <= 0) {
      Alert.alert('Maaf', 'Kursi untuk event ini sudah penuh');
      return;
    }

    Alert.alert(
      'Konfirmasi Pendaftaran',
      `Apakah Anda yakin ingin mendaftar untuk event "${eventTitle}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Daftar',
          onPress: async () => {
            try {
              // Add to registered events
              const newRegistered = [...registeredEvents, eventId];
              await AsyncStorage.setItem('registeredEvents', JSON.stringify(newRegistered));
              setRegisteredEvents(newRegistered);

              // Decrease slots
              const newSlots = { ...eventSlots, [eventId]: currentSlots - 1 };
              await AsyncStorage.setItem('eventSlots', JSON.stringify(newSlots));
              setEventSlots(newSlots);

              Alert.alert(
                'Berhasil! 🎉',
                'Anda berhasil mendaftar event. Cek email untuk detail lebih lanjut.',
                [{ text: 'OK' }]
              );
            } catch (error) {
              Alert.alert('Error', 'Gagal mendaftar event. Silakan coba lagi.');
            }
          }
        }
      ]
    );
  };

  const handleFeaturedEventRegister = () => {
    handleRegisterEvent(0, 'Bootcamp UMKM Go Digital');
  };

  const handleFabPress = () => {
    if (isLoggedIn) {
      Alert.alert(
        'Event Saya',
        `Anda terdaftar di ${registeredEvents.length} event`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Login Diperlukan',
        'Login untuk melihat event yang Anda daftarkan',
        [
          { text: 'Batal', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/login/login') }
        ]
      );
    }
  };

  const filteredEvents = selectedCategory === 'Semua' 
    ? events 
    : events.filter(event => event.type === selectedCategory);

  // Get current slots for each event
  const getEventSlots = (eventId: number, defaultSlots: number) => {
    return eventSlots[eventId] !== undefined ? eventSlots[eventId] : defaultSlots;
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Event & Pelatihan</Text>
          <Text style={styles.headerSubtitle}>
            Tingkatkan skill dan perluas networking melalui berbagai event UMKM
          </Text>
        </View>

        {/* Stats Banner */}
        <View style={styles.statsBanner}>
          <View style={styles.statItem}>
            <Ionicons name="calendar" size={24} color="#667eea" />
            <View style={styles.statTextContainer}>
              <Text style={styles.statNumber}>{events.length}</Text>
              <Text style={styles.statLabel}>Event Tersedia</Text>
            </View>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle" size={24} color="#43e97b" />
            <View style={styles.statTextContainer}>
              <Text style={styles.statNumber}>{registeredEvents.length}</Text>
              <Text style={styles.statLabel}>Event Terdaftar</Text>
            </View>
          </View>
        </View>

        {/* Category Filter */}
        <View style={styles.filterSection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterChip,
                  selectedCategory === category && styles.filterChipActive,
                ]}
                onPress={() => setSelectedCategory(category)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedCategory === category && styles.filterChipTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Event */}
        {selectedCategory === 'Semua' && (
          <View style={styles.featuredSection}>
            <View style={styles.featuredBadge}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.featuredBadgeText}>Featured Event</Text>
            </View>
            <TouchableOpacity 
              style={styles.featuredCard} 
              activeOpacity={0.9}
              onPress={handleFeaturedEventRegister}
            >
              <View style={styles.featuredGradient}>
                <View style={styles.featuredContent}>
                  <View style={styles.featuredIcon}>
                    <Text style={styles.featuredIconText}>🎯</Text>
                  </View>
                  <Text style={styles.featuredTitle}>Bootcamp UMKM Go Digital</Text>
                  <Text style={styles.featuredDesc}>
                    Program intensif 3 hari untuk transformasi digital UMKM
                  </Text>
                  <View style={styles.featuredMeta}>
                    <View style={styles.featuredMetaItem}>
                      <Ionicons name="calendar-outline" size={16} color="rgba(255,255,255,0.8)" />
                      <Text style={styles.featuredMetaText}>12-14 Des 2024</Text>
                    </View>
                    <View style={styles.featuredMetaItem}>
                      <Ionicons name="location-outline" size={16} color="rgba(255,255,255,0.8)" />
                      <Text style={styles.featuredMetaText}>Jakarta</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={styles.featuredButton}
                    onPress={handleFeaturedEventRegister}
                  >
                    <Text style={styles.featuredButtonText}>Daftar Sekarang</Text>
                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Events List */}
        <View style={styles.eventsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'Semua' ? 'Event Mendatang' : `${selectedCategory}`}
            </Text>
            <Text style={styles.sectionCount}>({filteredEvents.length})</Text>
          </View>

          {filteredEvents.map((event) => {
            const currentSlots = getEventSlots(event.id, event.slots);
            const isRegistered = registeredEvents.includes(event.id);
            
            return (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                activeOpacity={0.8}
              >
                {/* Event Header */}
                <View style={styles.eventHeader}>
                  <View style={[styles.eventIcon, { backgroundColor: event.color + '20' }]}>
                    <Text style={styles.eventIconText}>{event.icon}</Text>
                  </View>
                  <View style={styles.eventBadge}>
                    <Text style={styles.eventBadgeText}>{event.type}</Text>
                  </View>
                </View>

                {/* Event Title */}
                <Text style={styles.eventTitle}>{event.title}</Text>

                {/* Event Meta Info */}
                <View style={styles.eventMetaContainer}>
                  <View style={styles.eventMetaRow}>
                    <Ionicons name="calendar-outline" size={16} color="rgba(255,255,255,0.6)" />
                    <Text style={styles.eventMetaText}>{event.date}</Text>
                    <Text style={styles.eventMetaDot}>•</Text>
                    <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.6)" />
                    <Text style={styles.eventMetaText}>{event.time}</Text>
                  </View>
                  <View style={styles.eventMetaRow}>
                    <Ionicons name="location-outline" size={16} color="rgba(255,255,255,0.6)" />
                    <Text style={styles.eventMetaText} numberOfLines={1}>
                      {event.location}
                    </Text>
                  </View>
                </View>

                {/* Event Footer */}
                <View style={styles.eventFooter}>
                  <View style={styles.eventFooterLeft}>
                    <View style={styles.priceTag}>
                      <Ionicons name="pricetag" size={14} color="#43e97b" />
                      <Text style={styles.priceText}>{event.price}</Text>
                    </View>
                    <View style={[
                      styles.slotsTag,
                      currentSlots <= 10 && styles.slotsTagUrgent,
                    ]}>
                      <Ionicons 
                        name="people" 
                        size={14} 
                        color={currentSlots <= 10 ? '#fa709a' : '#4facfe'} 
                      />
                      <Text style={[
                        styles.slotsText,
                        currentSlots <= 10 && styles.slotsTextUrgent,
                      ]}>
                        {currentSlots} kursi tersisa
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={[
                      styles.registerButton, 
                      { 
                        backgroundColor: isRegistered ? '#43e97b' : event.color,
                        opacity: currentSlots <= 0 ? 0.5 : 1
                      }
                    ]}
                    activeOpacity={0.8}
                    onPress={() => handleRegisterEvent(event.id, event.title)}
                    disabled={currentSlots <= 0}
                  >
                    <Text style={styles.registerButtonText}>
                      {isRegistered ? 'Terdaftar' : currentSlots <= 0 ? 'Penuh' : 'Daftar'}
                    </Text>
                    {isRegistered ? (
                      <Ionicons name="checkmark-circle" size={14} color="#fff" />
                    ) : (
                      <Ionicons name="arrow-forward" size={14} color="#fff" />
                    )}
                  </TouchableOpacity>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { 
                        width: `${((event.maxSlots - currentSlots) / event.maxSlots) * 100}%`,
                        backgroundColor: event.color,
                      }
                    ]} 
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📅</Text>
            <Text style={styles.emptyStateTitle}>Belum Ada Event</Text>
            <Text style={styles.emptyStateDesc}>
              Event untuk kategori ini akan segera hadir
            </Text>
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab} 
        activeOpacity={0.9}
        onPress={handleFabPress}
      >
        <Ionicons name="calendar" size={24} color="#fff" />
        {registeredEvents.length > 0 && (
          <View style={styles.fabBadge}>
            <Text style={styles.fabBadgeText}>{registeredEvents.length}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 20,
  },
  header: {
    padding: 24,
    paddingTop: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    lineHeight: 22,
  },
  statsBanner: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 24,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statTextContainer: {
    flex: 1,
  },
  statNumber: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 16,
  },
  filterSection: {
    marginTop: 24,
    paddingLeft: 24,
  },
  filterScroll: {
    paddingRight: 24,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  filterChipActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  filterChipText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  featuredSection: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
    gap: 6,
  },
  featuredBadgeText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '700',
  },
  featuredCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  featuredGradient: {
    backgroundColor: '#667eea',
    padding: 24,
  },
  featuredContent: {
    gap: 12,
  },
  featuredIcon: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featuredIconText: {
    fontSize: 32,
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  featuredDesc: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
  featuredMeta: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  featuredMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featuredMetaText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  featuredButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  featuredButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  eventsSection: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  sectionCount: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
    fontWeight: '600',
  },
  eventCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  eventIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventIconText: {
    fontSize: 28,
  },
  eventBadge: {
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  eventBadgeText: {
    color: '#667eea',
    fontSize: 12,
    fontWeight: '700',
  },
  eventTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    lineHeight: 24,
  },
  eventMetaContainer: {
    gap: 10,
    marginBottom: 16,
  },
  eventMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventMetaText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    flex: 1,
  },
  eventMetaDot: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventFooterLeft: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(67, 233, 123, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  priceText: {
    color: '#43e97b',
    fontSize: 12,
    fontWeight: '700',
  },
  slotsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 172, 254, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  slotsTagUrgent: {
    backgroundColor: 'rgba(250, 112, 154, 0.15)',
  },
  slotsText: {
    color: '#4facfe',
    fontSize: 12,
    fontWeight: '600',
  },
  slotsTextUrgent: {
    color: '#fa709a',
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyStateDesc: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  fabBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fa709a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0a0e27',
  },
  fabBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});