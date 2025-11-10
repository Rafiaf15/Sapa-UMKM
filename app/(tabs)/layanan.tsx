import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

// Kategori layanan
const categories = [
  { id: 'all', name: 'Semua', icon: 'apps' },
  { id: 'perizinan', name: 'Perizinan', icon: 'document-text' },
  { id: 'pemberdayaan', name: 'Pemberdayaan', icon: 'trending-up' },
  { id: 'pelaporan', name: 'Pelaporan', icon: 'bar-chart' },
  { id: 'komunitas', name: 'Komunitas', icon: 'people' },
  { id: 'pelatihan', name: 'Pelatihan', icon: 'school' },
];

const services = [
  // A. LAYANAN PUBLIK & PERIZINAN
  {
    id: 1,
    category: 'perizinan',
    icon: '📋',
    title: 'Pengajuan NIB',
    desc: 'Nomor Induk Berusaha - Izin usaha resmi dari pemerintah',
    color: '#667eea',
    requiresLogin: true,
    route: '/forms/perizinan-form',
    status: 'available', // available, coming_soon
  },
  {
    id: 2,
    category: 'perizinan',
    icon: '™️',
    title: 'Registrasi Merek',
    desc: 'Daftarkan dan lindungi merek produk Anda secara resmi',
    color: '#f093fb',
    requiresLogin: true,
    route: '/forms/merek-form',
    status: 'available',
  },
  {
    id: 3,
    category: 'perizinan',
    icon: '✅',
    title: 'Pengajuan Sertifikasi',
    desc: 'Sertifikasi Halal, SNI, ISO, PIRT dan lainnya',
    color: '#4facfe',
    requiresLogin: true,
    route: '/forms/sertifikasi-form',
    status: 'available',
  },

  // B. PROGRAM PEMBERDAYAAN PEMERINTAH
  {
    id: 4,
    category: 'pemberdayaan',
    icon: '💰',
    title: 'Program KUR',
    desc: 'Kredit Usaha Rakyat dengan bunga rendah dari pemerintah',
    color: '#43e97b',
    requiresLogin: true,
    route: '/forms/kur-form',
    status: 'available',
  },
  {
    id: 5,
    category: 'pemberdayaan',
    icon: '🏦',
    title: 'Program UMi',
    desc: 'Pembiayaan Ultra Mikro hingga 10 juta tanpa jaminan',
    color: '#fa709a',
    requiresLogin: true,
    route: '/forms/umi-form',
    status: 'available',
  },
  {
    id: 6,
    category: 'pemberdayaan',
    icon: '🔄',
    title: 'Program LPDB',
    desc: 'Dana Bergulir untuk pengembangan usaha berkelanjutan',
    color: '#30cfd0',
    requiresLogin: true,
    route: '/forms/lpdb-form',
    status: 'available',
  },
  {
    id: 7,
    category: 'pemberdayaan',
    icon: '🎓',
    title: 'Inkubasi & Bimbingan',
    desc: 'Pendampingan dan bimbingan bisnis dari ahli',
    color: '#9c27b0',
    requiresLogin: true,
    route: '/forms/inkubasi-form',
    status: 'available',
  },

  // C. PELAPORAN & DATA USAHA
  {
    id: 8,
    category: 'pelaporan',
    icon: '📊',
    title: 'Pelaporan Kegiatan',
    desc: 'Laporkan perkembangan dan kegiatan usaha Anda',
    color: '#ff9800',
    requiresLogin: true,
    route: '/forms/laporan-form',
    status: 'available',
  },
  {
    id: 9,
    category: 'pelaporan',
    icon: '🔄',
    title: 'Update Data Profil',
    desc: 'Perbarui data usaha dan skala bisnis Anda',
    color: '#00bcd4',
    requiresLogin: true,
    route: '/forms/update-profil-form',
    status: 'available',
  },

  // D. KOMUNITAS & JARINGAN
  {
    id: 10,
    category: 'komunitas',
    icon: '💬',
    title: 'Forum UMKM',
    desc: 'Diskusi dan berbagi pengalaman dengan pelaku UMKM lainnya',
    color: '#e91e63',
    requiresLogin: false,
    route: '/forms/komunitas-form',
    status: 'available',
  },
  {
    id: 11,
    category: 'komunitas',
    icon: '📚',
    title: 'Pelatihan Komunitas',
    desc: 'Ikuti pelatihan dan workshop dari komunitas UMKM',
    color: '#4facfe',
    requiresLogin: false,
    route: '/(tabs)/event',
    status: 'available',
  },
  {
    id: 12,
    category: 'komunitas',
    icon: '📢',
    title: 'Info Program',
    desc: 'Informasi terbaru program dari KemenKopUKM',
    color: '#8bc34a',
    requiresLogin: false,
    route: '/forms/info-program',
    status: 'available',
  },

  // E. PENINGKATAN KOMPETENSI
  {
    id: 13,
    category: 'pelatihan',
    icon: '🎯',
    title: 'Pelatihan KemenKopUKM',
    desc: 'Pelatihan resmi dari Kementerian Koperasi dan UKM',
    color: '#667eea',
    requiresLogin: true,
    route: '/(tabs)/event',
    status: 'available',
  },
  {
    id: 14,
    category: 'pelatihan',
    icon: '📖',
    title: 'E-Learning',
    desc: 'Belajar mandiri dengan modul digital dan video tutorial',
    color: '#ff5722',
    requiresLogin: false,
    route: '/forms/e-learning',
    status: 'available',
  },
];

export default function LayananScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessedServices, setAccessedServices] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    checkLoginStatus();
    loadAccessedServices();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const loggedIn = await AsyncStorage.getItem('isLoggedIn');
      const isUserLoggedIn = loggedIn === 'true';
      setIsLoggedIn(isUserLoggedIn);

      if (!isUserLoggedIn) {
        setAccessedServices([]);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  const loadAccessedServices = async () => {
    try {
      const loggedIn = await AsyncStorage.getItem('isLoggedIn');

      if (loggedIn === 'true') {
        const accessed = await AsyncStorage.getItem('accessedServices');
        if (accessed) {
          setAccessedServices(JSON.parse(accessed));
        }
      } else {
        setAccessedServices([]);
      }
    } catch (error) {
      console.error('Error loading accessed services:', error);
    }
  };

  const handleServiceAccess = async (service: typeof services[0]) => {
    // Check status first
    if (service.status === 'coming_soon') {
      Alert.alert(
        'Segera Hadir',
        `Layanan ${service.title} akan segera tersedia. Pantau terus update dari kami!`,
        [{ text: 'OK' }]
      );
      return;
    }

    // Check if login is required
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

    // Track accessed service
    if (isLoggedIn && !accessedServices.includes(service.id)) {
      const newAccessed = [...accessedServices, service.id];
      await AsyncStorage.setItem('accessedServices', JSON.stringify(newAccessed));
      setAccessedServices(newAccessed);
    }

    // Navigate to service
    if (service.route) {
      router.push(service.route as any);
      return;
    }
  };

  // Filter services
  const filteredServices = services.filter(service => {
    const matchCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.desc.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchSearch;
  });

  // Group by category
  const servicesByCategory = categories.slice(1).map(cat => ({
    ...cat,
    services: filteredServices.filter(s => s.category === cat.id),
  })).filter(cat => cat.services.length > 0);

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
            Akses lengkap layanan publik, pemberdayaan, dan peningkatan kompetensi UMKM
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

        {/* Category Filter */}
        <View style={styles.categorySection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Ionicons
                  name={category.icon as any}
                  size={18}
                  color={selectedCategory === category.id ? '#fff' : 'rgba(255,255,255,0.6)'}
                />
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === category.id && styles.categoryChipTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statBox}>
            <Ionicons name="apps" size={24} color="#667eea" />
            <Text style={styles.statNumber}>{services.length}</Text>
            <Text style={styles.statLabel}>Total Layanan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statBox}>
            <Ionicons name="checkmark-circle" size={24} color="#43e97b" />
            <Text style={styles.statNumber}>{services.filter(s => s.status === 'available').length}</Text>
            <Text style={styles.statLabel}>Tersedia</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statBox}>
            <Ionicons name="star" size={24} color="#ffc107" />
            <Text style={styles.statNumber}>{accessedServices.length}</Text>
            <Text style={styles.statLabel}>Diakses</Text>
          </TouchableOpacity>
        </View>

        {/* Services by Category */}
        {selectedCategory === 'all' ? (
          servicesByCategory.map((category) => (
            <View key={category.id} style={styles.categorySection}>
              <View style={styles.categorySectionHeader}>
                <Ionicons name={category.icon as any} size={24} color="#667eea" />
                <Text style={styles.categorySectionTitle}>{category.name}</Text>
                <Text style={styles.categorySectionCount}>({category.services.length})</Text>
              </View>

              <View style={styles.grid}>
                {category.services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    isLoggedIn={isLoggedIn}
                    isAccessed={accessedServices.includes(service.id)}
                    onPress={() => handleServiceAccess(service)}
                  />
                ))}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.grid}>
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isLoggedIn={isLoggedIn}
                isAccessed={accessedServices.includes(service.id)}
                onPress={() => handleServiceAccess(service)}
              />
            ))}
          </View>
        )}

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🔍</Text>
            <Text style={styles.emptyStateTitle}>Layanan Tidak Ditemukan</Text>
            <Text style={styles.emptyStateDesc}>
              Coba kata kunci lain atau pilih kategori berbeda
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

// Service Card Component
function ServiceCard({ service, isLoggedIn, isAccessed, onPress }: any) {
  return (
    <TouchableOpacity
      style={styles.serviceCard}
      activeOpacity={0.8}
      onPress={onPress}
    >
      {/* Status Badge */}
      {service.status === 'coming_soon' && (
        <View style={styles.comingSoonBadge}>
          <Ionicons name="time-outline" size={10} color="#ffc107" />
          <Text style={styles.comingSoonBadgeText}>Segera</Text>
        </View>
      )}

      {/* Accessed Badge */}
      {isLoggedIn && isAccessed && service.status === 'available' && (
        <View style={styles.accessedBadge}>
          <Ionicons name="checkmark-circle" size={12} color="#43e97b" />
          <Text style={styles.accessedBadgeText}>Diakses</Text>
        </View>
      )}

      {/* Login Required Badge */}
      {service.requiresLogin && !isLoggedIn && service.status === 'available' && (
        <View style={styles.loginBadge}>
          <Ionicons name="lock-closed" size={12} color="#fa709a" />
          <Text style={styles.loginBadgeText}>Login</Text>
        </View>
      )}

      {/* Icon */}
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
        style={[
          styles.actionButton,
          {
            backgroundColor: service.status === 'coming_soon'
              ? 'rgba(255,193,7,0.2)'
              : service.color
          }
        ]}
        onPress={onPress}
      >
        <Text style={styles.actionButtonText}>
          {service.status === 'coming_soon' ? 'Info' : 'Akses'}
        </Text>
        <Ionicons
          name={service.status === 'coming_soon' ? 'information-circle' : 'arrow-forward'}
          size={16}
          color="#fff"
        />
      </TouchableOpacity>

      <View style={[styles.cardDecoration, { backgroundColor: service.color }]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e27' },
  scrollView: { flex: 1 },
  content: { paddingBottom: 20 },
  header: { padding: 24, paddingTop: 20 },
  headerTitle: { color: '#fff', fontSize: 32, fontWeight: '800', marginBottom: 8, letterSpacing: -0.5 },
  headerSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 22 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', marginHorizontal: 24, paddingHorizontal: 16, paddingVertical: 14, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', gap: 12 },
  searchPlaceholder: { color: 'rgba(255,255,255,0.5)', fontSize: 15, flex: 1 },
  searchInput: { flex: 1, color: '#fff', fontSize: 15 },
  categorySection: { marginTop: 24, paddingHorizontal: 24 },
  categoryScroll: { paddingRight: 24, gap: 12 },
  categoryChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', gap: 8 },
  categoryChipActive: { backgroundColor: '#667eea', borderColor: '#667eea' },
  categoryChipText: { color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: '600' },
  categoryChipTextActive: { color: '#fff' },
  statsContainer: { flexDirection: 'row', marginHorizontal: 24, marginTop: 24, gap: 12 },
  statBox: { flex: 1, backgroundColor: 'rgba(102, 126, 234, 0.15)', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(102, 126, 234, 0.3)', gap: 8 },
  statNumber: { color: '#fff', fontSize: 24, fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '600', textAlign: 'center' },
  categorySectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  categorySectionTitle: { color: '#fff', fontSize: 20, fontWeight: '700', flex: 1 },
  categorySectionCount: { color: 'rgba(255,255,255,0.5)', fontSize: 16, fontWeight: '600' },
  grid: { gap: 16, marginBottom: 24 },
  serviceCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' },
  comingSoonBadge: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 193, 7, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4, zIndex: 10 },
  comingSoonBadgeText: { color: '#ffc107', fontSize: 10, fontWeight: '700' },
  accessedBadge: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(67, 233, 123, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4, zIndex: 10 },
  accessedBadgeText: { color: '#43e97b', fontSize: 10, fontWeight: '700' },
  loginBadge: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(250, 112, 154, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4, zIndex: 10 },
  loginBadgeText: { color: '#fa709a', fontSize: 10, fontWeight: '700' },
  iconContainer: { width: 60, height: 60, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 16, position: 'relative' },
  serviceIcon: { fontSize: 32, zIndex: 1 },
  iconGlow: { position: 'absolute', width: 60, height: 60, borderRadius: 30, opacity: 0.2, transform: [{ scale: 1.5 }] },
  cardContent: { marginBottom: 16 },
  serviceTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  serviceDesc: { color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 20 },
  actionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, gap: 8, alignSelf: 'flex-start' },
  actionButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  cardDecoration: { position: 'absolute', width: 100, height: 100, borderRadius: 50, top: -30, right: -30, opacity: 0.1 },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyStateIcon: { fontSize: 64, marginBottom: 16 },
  emptyStateTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 8 },
  emptyStateDesc: { color: 'rgba(255,255,255,0.6)', fontSize: 14, textAlign: 'center', paddingHorizontal: 40 },
});