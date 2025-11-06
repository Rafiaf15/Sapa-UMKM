import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const services = [
  {
    id: 1,
    icon: '📋',
    title: 'Perizinan Usaha',
    desc: 'Urus NIB, IUMK, dan berbagai izin usaha lainnya dengan mudah dan cepat',
    color: '#667eea',
    gradient: ['#667eea', '#764ba2'],
  },
  {
    id: 2,
    icon: '💼',
    title: 'Pendanaan UMKM',
    desc: 'Akses berbagai program pembiayaan dari pemerintah dan lembaga keuangan',
    color: '#f093fb',
    gradient: ['#f093fb', '#f5576c'],
  },
  {
    id: 3,
    icon: '📊',
    title: 'Pelatihan & Workshop',
    desc: 'Ikuti pelatihan gratis untuk meningkatkan skill dan pengetahuan bisnis',
    color: '#4facfe',
    gradient: ['#4facfe', '#00f2fe'],
  },
  {
    id: 4,
    icon: '🏪',
    title: 'Pemasaran Digital',
    desc: 'Dapatkan bantuan promosi dan akses ke berbagai marketplace online',
    color: '#43e97b',
    gradient: ['#43e97b', '#38f9d7'],
  },
  {
    id: 5,
    icon: '📦',
    title: 'Logistik & Distribusi',
    desc: 'Kelola pengiriman produk dengan integrasi ke berbagai jasa kurir terpercaya',
    color: '#fa709a',
    gradient: ['#fa709a', '#fee140'],
  },
  {
    id: 6,
    icon: '💰',
    title: 'Konsultasi Keuangan',
    desc: 'Dapatkan konsultasi pengelolaan keuangan bisnis dari ahli',
    color: '#30cfd0',
    gradient: ['#30cfd0', '#330867'],
  },
];

export default function LayananScreen() {
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
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="rgba(255,255,255,0.5)" />
          <Text style={styles.searchPlaceholder}>Cari layanan...</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>50+</Text>
            <Text style={styles.statLabel}>Layanan</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>10K+</Text>
            <Text style={styles.statLabel}>Pengguna</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>Support</Text>
          </View>
        </View>

        {/* Services Grid */}
        <View style={styles.servicesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kategori Layanan</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Lihat Semua →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.grid}>
            {services.map((service, index) => (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.serviceCard,
                  index % 2 === 0 ? styles.cardLeft : styles.cardRight,
                ]}
                activeOpacity={0.8}
              >
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
                >
                  <Text style={styles.actionButtonText}>Akses</Text>
                  <Ionicons name="arrow-forward" size={16} color="#fff" />
                </TouchableOpacity>

                {/* Background Decoration */}
                <View style={[styles.cardDecoration, { backgroundColor: service.color }]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Services */}
        <View style={styles.popularSection}>
          <Text style={styles.sectionTitle}>Paling Populer</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.popularScroll}
          >
            {services.slice(0, 3).map((service) => (
              <View key={service.id} style={styles.popularCard}>
                <View style={[styles.popularIcon, { backgroundColor: service.color }]}>
                  <Text style={styles.popularIconText}>{service.icon}</Text>
                </View>
                <Text style={styles.popularTitle}>{service.title}</Text>
                <View style={styles.popularStats}>
                  <Ionicons name="people" size={14} color="rgba(255,255,255,0.6)" />
                  <Text style={styles.popularStatsText}>1.2K pengguna</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
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
});