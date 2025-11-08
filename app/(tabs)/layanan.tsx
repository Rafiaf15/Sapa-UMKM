import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const services = [
  {
    id: 1,
    icon: '📋',
    title: 'Perizinan Usaha',
    desc: 'Urus NIB, IUMK, dan berbagai izin usaha lainnya dengan mudah dan cepat',
    color: '#667eea',
    gradient: ['#667eea', '#764ba2'],
    requiresLogin: true,
    route: '/forms/perizinan-form',
  },
  {
    id: 2,
    icon: '💼',
    title: 'Pendanaan UMKM',
    desc: 'Akses berbagai program pembiayaan dari pemerintah dan lembaga keuangan',
    color: '#f093fb',
    gradient: ['#f093fb', '#f5576c'],
    requiresLogin: true,
    route: '/forms/pendanaan-form',
  },
  {
    id: 3,
    icon: '📊',
    title: 'Pelatihan & Workshop',
    desc: 'Ikuti pelatihan gratis untuk meningkatkan skill dan pengetahuan bisnis',
    color: '#4facfe',
    gradient: ['#4facfe', '#00f2fe'],
    requiresLogin: false,
    route: '/(tabs)/event',
  },
  {
    id: 4,
    icon: '🏪',
    title: 'Pemasaran Digital',
    desc: 'Dapatkan bantuan promosi dan akses ke berbagai marketplace online',
    color: '#43e97b',
    gradient: ['#43e97b', '#38f9d7'],
    requiresLogin: true,
    route: '/forms/pemasaran-form',
  },
  {
    id: 5,
    icon: '📦',
    title: 'Logistik & Distribusi',
    desc: 'Kelola pengiriman produk dengan integrasi ke berbagai jasa kurir terpercaya',
    color: '#fa709a',
    gradient: ['#fa709a', '#fee140'],
    requiresLogin: true,
    route: '/forms/logistik-form',
  },
  {
    id: 6,
    icon: '💰',
    title: 'Konsultasi Keuangan',
    desc: 'Dapatkan konsultasi pengelolaan keuangan bisnis dari ahli',
    color: '#30cfd0',
    gradient: ['#30cfd0', '#330867'],
    requiresLogin: true,
    route: '/forms/konsultasi-form',
  },
];

export default function LayananScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessedServices, setAccessedServices] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    checkLoginStatus();
    loadAccessedServices();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const loggedIn = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(loggedIn === 'true');
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  const loadAccessedServices = async () => {
    try {
      const accessed = await AsyncStorage.getItem('accessedServices');
      if (accessed) {
        setAccessedServices(JSON.parse(accessed));
      }
    } catch (error) {
      console.error('Error loading accessed services:', error);
    }
  };

  const handleServiceAccess = async (service: typeof services[0]) => {
    // Check if login is required first
    if (service.requiresLogin && !isLoggedIn) {
      Alert.alert(
        'Login Diperlukan',
        'Anda harus login terlebih dahulu untuk mengakses layanan ini',
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

    // If service has a specific route
    if (service.route) {
      // Track accessed service
      if (!accessedServices.includes(service.id)) {
        const newAccessed = [...accessedServices, service.id];
        await AsyncStorage.setItem('accessedServices', JSON.stringify(newAccessed));
        setAccessedServices(newAccessed);
      }
      
      router.push(service.route as any);
      return;
    }

    // Fallback - should not reach here as all services now have routes
    Alert.alert('Info', 'Layanan ini akan segera tersedia');
  };

  const handleSeeAll = () => {
    Alert.alert(
      'Semua Layanan',
      `Total ${services.length} layanan tersedia untuk mengembangkan UMKM Anda`,
      [{ text: 'OK' }]
    );
  };

  // Filter services based on search
  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get most popular services (first 3)
  const popularServices = services.slice(0, 3);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Layanan UMKM</Text>
          <Text style={styles.headerSubtitle}>
            Semua layanan yang Anda butuhkan untuk mengembangkan bisnis UMKM dalam satu platform
          </Text>
        </View>

        {/* Search Bar */}
        <TouchableOpacity 
          style={styles.searchContainer}
          onPress={() => setShowSearch(!showSearch)}
        >
          <Ionicons name="search" size={20} color="rgba(255,255,255,0.5)" />
          {showSearch ? (
            <TextInput
              style={styles.searchInput}
              placeholder="Cari layanan..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          ) : (
            <Text style={styles.searchPlaceholder}>Cari layanan...</Text>
          )}
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statBox} activeOpacity={0.8}>
            <Text style={styles.statNumber}>{services.length}</Text>
            <Text style={styles.statLabel}>Layanan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statBox} activeOpacity={0.8}>
            <Text style={styles.statNumber}>{accessedServices.length}</Text>
            <Text style={styles.statLabel}>Diakses</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.statBox} 
            activeOpacity={0.8}
            onPress={() => {
              if (isLoggedIn) {
                Alert.alert('Support', 'Hubungi kami:\nEmail: support@sapaumkm.id\nWA: +62 812-3456-7890');
              } else {
                Alert.alert('Login', 'Login terlebih dahulu untuk mengakses support');
              }
            }}
          >
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>Support</Text>
          </TouchableOpacity>
        </View>

        {/* Services Grid */}
        <View style={styles.servicesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kategori Layanan</Text>
            <TouchableOpacity onPress={handleSeeAll}>
              <Text style={styles.seeAll}>Lihat Semua →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.grid}>
            {filteredServices.map((service, index) => {
              const isAccessed = accessedServices.includes(service.id);
              
              return (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.serviceCard,
                    index % 2 === 0 ? styles.cardLeft : styles.cardRight,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => handleServiceAccess(service)}
                >
                  {/* Accessed Badge */}
                  {isAccessed && (
                    <View style={styles.accessedBadge}>
                      <Ionicons name="checkmark-circle" size={12} color="#43e97b" />
                      <Text style={styles.accessedBadgeText}>Diakses</Text>
                    </View>
                  )}

                  {/* Login Required Badge */}
                  {service.requiresLogin && !isLoggedIn && (
                    <View style={styles.loginBadge}>
                      <Ionicons name="lock-closed" size={12} color="#fa709a" />
                      <Text style={styles.loginBadgeText}>Login</Text>
                    </View>
                  )}

                  {/* Icon Container */}
                  <View style={[styles.iconContainer, { backgroundColor: service.color + '20' }]}>
                    <Text style={styles.serviceIcon}>{service.icon}</Text>
                    <View style={[styles.iconGlow, { backgroundColor: service.color }]} />
                  </View>

                  {/* Content */}
                  <View style={styles.cardContent}>
                    <Text style={styles.serviceTitle}>{service.title}</Text>
                    <Text style={styles.serviceDesc} numberOfLines={2}>
                      {service.desc}
                    </Text>
                  </View>

                  {/* Action Button */}
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: service.color }]}
                    activeOpacity={0.9}
                    onPress={() => handleServiceAccess(service)}
                  >
                    <Text style={styles.actionButtonText}>Akses</Text>
                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                  </TouchableOpacity>

                  {/* Background Decoration */}
                  <View style={[styles.cardDecoration, { backgroundColor: service.color }]} />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Empty State for Search */}
          {filteredServices.length === 0 && searchQuery.length > 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🔍</Text>
              <Text style={styles.emptyStateTitle}>Layanan Tidak Ditemukan</Text>
              <Text style={styles.emptyStateDesc}>
                Coba kata kunci lain atau lihat semua layanan yang tersedia
              </Text>
            </View>
          )}
        </View>

        {/* Popular Services */}
        <View style={styles.popularSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Paling Populer</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/event')}>
              <Text style={styles.seeAll}>Lihat Event →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularScroll}
          >
            {popularServices.map((service) => (
              <TouchableOpacity 
                key={service.id} 
                style={styles.popularCard}
                activeOpacity={0.8}
                onPress={() => handleServiceAccess(service)}
              >
                <View style={[styles.popularIcon, { backgroundColor: service.color }]}>
                  <Text style={styles.popularIconText}>{service.icon}</Text>
                </View>
                <Text style={styles.popularTitle}>{service.title}</Text>
                <View style={styles.popularStats}>
                  <Ionicons name="people" size={14} color="rgba(255,255,255,0.6)" />
                  <Text style={styles.popularStatsText}>1.2K pengguna</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Info Banner */}
        <TouchableOpacity 
          style={styles.infoBanner}
          activeOpacity={0.8}
          onPress={() => {
            if (!isLoggedIn) {
              Alert.alert(
                'Dapatkan Akses Penuh',
                'Login untuk mengakses semua layanan UMKM',
                [
                  { text: 'Nanti', style: 'cancel' },
                  { text: 'Login', onPress: () => router.push('/login/login') }
                ]
              );
            } else {
              Alert.alert('Info', 'Anda sudah login dan dapat mengakses semua layanan');
            }
          }}
        >
          <View style={styles.infoBannerContent}>
            <Ionicons name="information-circle" size={40} color="#667eea" />
            <View style={styles.infoBannerText}>
              <Text style={styles.infoBannerTitle}>
                {isLoggedIn ? 'Akses Penuh Aktif 🎉' : 'Butuh Bantuan?'}
              </Text>
              <Text style={styles.infoBannerDesc}>
                {isLoggedIn 
                  ? 'Nikmati semua layanan UMKM yang tersedia' 
                  : 'Login untuk mengakses semua layanan'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.5)" />
          </View>
        </TouchableOpacity>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 12,
  },
  searchPlaceholder: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 15,
    flex: 1,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 24,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(102, 126, 234, 0.15)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  statNumber: {
    color: '#667eea',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
  },
  servicesSection: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  seeAll: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  grid: {
    gap: 16,
  },
  serviceCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    position: 'relative',
    overflow: 'hidden',
  },
  cardLeft: {
    marginRight: 0,
  },
  cardRight: {
    marginLeft: 0,
  },
  accessedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(67, 233, 123, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    zIndex: 10,
  },
  accessedBadgeText: {
    color: '#43e97b',
    fontSize: 10,
    fontWeight: '700',
  },
  loginBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 112, 154, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    zIndex: 10,
  },
  loginBadgeText: {
    color: '#fa709a',
    fontSize: 10,
    fontWeight: '700',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  serviceIcon: {
    fontSize: 32,
    zIndex: 1,
  },
  iconGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.2,
    transform: [{ scale: 1.5 }],
  },
  cardContent: {
    marginBottom: 16,
  },
  serviceTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  serviceDesc: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    lineHeight: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  cardDecoration: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    top: -30,
    right: -30,
    opacity: 0.1,
  },
  popularSection: {
    marginTop: 32,
    paddingLeft: 24,
  },
  popularScroll: {
    paddingRight: 24,
    paddingTop: 16,
    gap: 16,
  },
  popularCard: {
    width: 160,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  popularIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  popularIconText: {
    fontSize: 24,
  },
  popularTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  popularStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  popularStatsText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
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
    paddingHorizontal: 40,
  },
  infoBanner: {
    marginHorizontal: 24,
    marginTop: 32,
    backgroundColor: 'rgba(102, 126, 234, 0.15)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
    overflow: 'hidden',
  },
  infoBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  infoBannerText: {
    flex: 1,
  },
  infoBannerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  infoBannerDesc: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    lineHeight: 18,
  },
});