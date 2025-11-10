import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState("fase");
  const [currentBanner, setCurrentBanner] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  type MaterialIconName = keyof typeof MaterialCommunityIcons.glyphMap;

  interface ServiceItem {
    id: string;
    name: string;
    icon: MaterialIconName;
    color: string;
  }

  const services: ServiceItem[] = [
    { id: '1', name: 'Toko Online', icon: 'storefront', color: '#667eea' },
    { id: '2', name: 'Promosi', icon: 'bullhorn', color: '#f093fb' },
    { id: '3', name: 'Event', icon: 'calendar-star', color: '#4facfe' },
    { id: '4', name: 'Lokasi', icon: 'map-marker', color: '#43e97b' },
    { id: '5', name: 'Pelatihan', icon: 'school', color: '#fa709a' },
    { id: '6', name: 'Konsultasi', icon: 'account-group', color: '#30cfd0' },
  ];

  const banners = [
    { 
      id: "1", 
      image: require("../../assets/images/banner1.jpeg"), 
      title: "Nikmati semua layanan Sapa UMKM",
      gradient: ['#667eea', '#764ba2']
    },
    { 
      id: "2", 
      image: require("../../assets/images/banner2.jpeg"), 
      title: "JABAR MEMANGGIL! Cari kerja lebih mudah dengan Nyari Gawe",
      gradient: ['#f093fb', '#f5576c']
    },
  ];

  type PhaseItem = {
    name: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    color: string;
    description: string;
  };

  const lifePhases: PhaseItem[] = [
    { 
      name: "Perizinan Usaha", 
      icon: "file-document-edit", 
      color: '#667eea',
      description: 'NIB, IUMK, dll'
    },
    { 
      name: "Pendanaan", 
      icon: "cash-multiple", 
      color: '#f093fb',
      description: 'Modal usaha'
    },
    { 
      name: "Pelatihan", 
      icon: "school", 
      color: '#4facfe',
      description: 'Workshop gratis'
    },
    { 
      name: "Pemasaran", 
      icon: "chart-line", 
      color: '#43e97b',
      description: 'Digital marketing'
    },
    { 
      name: "Logistik", 
      icon: "truck-delivery", 
      color: '#fa709a',
      description: 'Pengiriman barang'
    },
    { 
      name: "Keuangan", 
      icon: "calculator", 
      color: '#30cfd0',
      description: 'Manajemen keuangan'
    },
  ];

  const quickStats = [
    { label: 'UMKM', value: '10K+', icon: 'account-group' },
    { label: 'Layanan', value: '50+', icon: 'apps' },
    { label: 'Event', value: '100+', icon: 'calendar' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome Header */}
      <LinearGradient
        colors={['rgba(102, 126, 234, 0.15)', 'rgba(118, 75, 162, 0.15)']}
        style={styles.welcomeHeader}
      >
        <View style={styles.welcomeContent}>
          <View>
            <Text style={styles.welcomeGreeting}>Selamat Datang! 👋</Text>
            <Text style={styles.welcomeName}>di Sapa UMKM</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Quick Stats */}
      <View style={styles.quickStatsContainer}>
        {quickStats.map((stat, index) => (
          <View key={index} style={styles.quickStatItem}>
            <MaterialCommunityIcons 
              name={stat.icon as MaterialIconName} 
              size={24} 
              color="#667eea" 
            />
            <Text style={styles.quickStatValue}>{stat.value}</Text>
            <Text style={styles.quickStatLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Card Info Login */}
      <TouchableOpacity activeOpacity={0.8}>
        <LinearGradient
          colors={['rgba(102, 126, 234, 0.2)', 'rgba(118, 75, 162, 0.2)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardLogin}
        >
          <View style={styles.cardLoginIcon}>
            <Ionicons name="person-circle-outline" size={40} color="#667eea" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Belum masuk akun?</Text>
            <Text style={styles.cardSubtitle}>
              Nikmati semua layanan Sapa UMKM dengan masuk ke akun Anda!
            </Text>
          </View>
          <View style={styles.cardArrow}>
            <Ionicons name="chevron-forward" size={24} color="#667eea" />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Rekomendasi */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Layanan Populer</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Lihat Semua →</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={services}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.8}>
              <View style={styles.serviceItem}>
                <LinearGradient
                  colors={[item.color, item.color + 'aa']}
                  style={styles.serviceIconContainer}
                >
                  <MaterialCommunityIcons 
                    name={item.icon} 
                    size={32} 
                    color="#ffffff" 
                  />
                </LinearGradient>
                <Text style={styles.serviceText}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Banner Slider */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Informasi Terbaru</Text>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {banners.map((banner, index) => (
            <TouchableOpacity 
              key={banner.id} 
              activeOpacity={0.9}
              style={styles.bannerItem}
            >
              <Image source={banner.image} style={styles.bannerImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.bannerOverlay}
              >
                <Text style={styles.bannerTitle}>{banner.title}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* Banner Dots Indicator */}
        <View style={styles.dotsContainer}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentBanner ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Daftar Layanan */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daftar Layanan</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setActiveTab("fase")}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={activeTab === "fase" 
                ? ['#667eea', '#764ba2'] 
                : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.05)']
              }
              style={styles.tabButton}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "fase" && styles.activeTabText,
                ]}
              >
                Layanan Wirausaha
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("lainnya")}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={activeTab === "lainnya" 
                ? ['#667eea', '#764ba2'] 
                : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.05)']
              }
              style={styles.tabButton}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "lainnya" && styles.activeTabText,
                ]}
              >
                Layanan Lainnya
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Konten Layanan */}
      {activeTab === "fase" && (
        <View style={styles.grid}>
          {lifePhases.map((item, index) => (
            <TouchableOpacity 
              key={item.name} 
              style={styles.gridItem}
              activeOpacity={0.8}
            >
              <View style={styles.gridItemContent}>
                <View style={[styles.gridIconContainer, { backgroundColor: item.color + '20' }]}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={28}
                    color={item.color}
                  />
                </View>
                <View style={styles.gridTextContainer}>
                  <Text style={styles.gridText}>{item.name}</Text>
                  <Text style={styles.gridDescription}>{item.description}</Text>
                </View>
                <View style={styles.gridArrow}>
                  <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.4)" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {activeTab === "lainnya" && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📋</Text>
          <Text style={styles.emptyStateTitle}>Segera Hadir</Text>
          <Text style={styles.emptyStateDesc}>
            Layanan lainnya akan segera tersedia untuk Anda
          </Text>
        </View>
      )}

      {/* Bottom Spacing */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0e27",
    paddingTop: Platform.OS === "web" ? 40 : 0,
  },
  welcomeHeader: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  welcomeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeGreeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  welcomeName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  notificationButton: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    backgroundColor: '#fa709a',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  quickStatsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: -30,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 12,
  },
  quickStatItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#667eea',
  },
  quickStatLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  cardLogin: {
    borderRadius: 20,
    margin: 16,
    marginTop: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  cardLoginIcon: {
    marginRight: 16,
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#fff",
    marginBottom: 6,
  },
  cardSubtitle: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 13,
    lineHeight: 18,
  },
  cardArrow: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 20,
    paddingHorizontal: 16,
    color: "#fff",
  },
  seeAll: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '600',
  },
  serviceItem: {
    alignItems: "center",
    marginRight: 16,
    width: 90,
  },
  serviceIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#667eea',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  serviceText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: 'center',
    fontWeight: '600',
  },
  bannerItem: {
    width: width - 32,
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: "hidden",
    position: 'relative',
  },
  bannerImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  activeDot: {
    width: 20,
    backgroundColor: '#667eea',
  },
  inactiveDot: {
    width: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  tabContainer: {
    flexDirection: "row",
    marginTop: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  tabText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "600",
    fontSize: 13,
  },
  activeTabText: {
    color: "#fff",
  },
  grid: {
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  gridItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  gridItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gridIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridTextContainer: {
    flex: 1,
  },
  gridText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  gridDescription: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },
  gridArrow: {
    width: 28,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
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
});