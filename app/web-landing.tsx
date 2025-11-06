import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function WebLanding() {
  return (
    <>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Image
          source={require('../assets/images/Logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <View style={styles.navLinks}>
          <TouchableOpacity onPress={() => router.push('/')}><Text style={styles.navLink}>Beranda</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/layanan')}><Text style={styles.navLink}>Layanan</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/event')}><Text style={styles.navLink}>Event</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/tentang')}><Text style={styles.navLink}>Tentang</Text></TouchableOpacity>
        </View>
        <TouchableOpacity 
          onPress={() => router.push('/login/login')} 
          style={styles.navButton}
          accessibilityRole="button"
        >
          <Text style={styles.navButtonText}>Login/Daftar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.containerContent}>
        {/* Hero Section */}
        <LinearGradient
          colors={['#0a0e27', '#1b195d', '#2d1b69']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          {/* Animated Background Blur Circles */}
          <AnimatedBackgroundCircle color="rgba(102, 126, 234, 0.3)" delay={0} />
          <AnimatedBackgroundCircle color="rgba(118, 75, 162, 0.3)" delay={2000} />

          <View style={styles.heroContent}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroTitle}>
                Platform Layanan{"\n"}UMKM Terpadu
              </Text>
              <Text style={styles.heroSubtitle}>
                Kelola bisnis UMKM Anda dengan lebih mudah. Akses perizinan, pendanaan, pelatihan, dan berbagai layanan lainnya dalam satu platform.
              </Text>

              <View style={styles.heroButtons}>
                <TouchableOpacity onPress={() => router.push('/(tabs)/layanan')} style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Mulai Gratis</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/(tabs)/event')} style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Pelajari Lebih Lanjut</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.heroRight}>
              <FloatingServiceCard 
                icon="📋" 
                title="Perizinan Cepat" 
                desc="Urus NIB & IUMK" 
                delay={0}
              />
              <FloatingServiceCard 
                icon="📊" 
                title="Pelatihan Gratis" 
                desc="Upgrade skill bisnis" 
                delay={1000}
              />
              <FloatingServiceCard 
                icon="💼" 
                title="Pendanaan UMKM" 
                desc="Akses modal usaha" 
                delay={2000}
              />
            </View>
          </View>
        </LinearGradient>

        {/* Features Section */}
        <LinearGradient
          colors={['#1a1f3a', '#252b4a']}
          style={styles.features}
        >
          <Text style={styles.sectionTitle}>Layanan Lengkap untuk UMKM</Text>
          <Text style={styles.sectionSubtitle}>
            Semua yang Anda butuhkan untuk mengembangkan bisnis UMKM
          </Text>

          <View style={styles.featureGrid}>
            <FeatureCard icon="📋" title="Perizinan Usaha" description="Urus NIB, IUMK, dan berbagai izin usaha lainnya dengan mudah dan cepat." />
            <FeatureCard icon="💼" title="Pendanaan" description="Akses berbagai program pembiayaan UMKM dari pemerintah." />
            <FeatureCard icon="📊" title="Pelatihan" description="Ikuti workshop dan pelatihan gratis untuk meningkatkan skill bisnis." />
            <FeatureCard icon="🏪" title="Pemasaran" description="Dapatkan bantuan promosi dan akses ke marketplace." />
            <FeatureCard icon="📦" title="Logistik & Distribusi" description="Kelola pengiriman produk dengan mudah. Integrasi dengan berbagai jasa kurir." />
          </View>
        </LinearGradient>

        {/* Stats Section */}
        <View style={styles.stats}>
          <View style={styles.statsGrid}>
            <StatCard number="10K+" label="UMKM Terdaftar" />
            <StatCard number="50+" label="Layanan Tersedia" />
            <StatCard number="100+" label="Event & Pelatihan" />
            <StatCard number="95%" label="Kepuasan Pengguna" />
          </View>
        </View>

        {/* CTA Section */}
        <LinearGradient
          colors={['rgba(102, 126, 234, 0.15)', 'rgba(118, 75, 162, 0.15)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cta}
        >
          <Text style={styles.ctaTitle}>Siap Mengembangkan UMKM Anda?</Text>
          <Text style={styles.ctaSubtitle}>
            Bergabunglah dengan ribuan pelaku UMKM yang telah merasakan kemudahan layanan kami
          </Text>
          <TouchableOpacity 
            accessibilityRole="button" 
            onPress={() => router.push('/(tabs)/layanan')} 
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Daftar Sekarang - Gratis!</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Footer Section */}
        <View style={styles.footer}>
          <View style={styles.footerColumn}>
            <Text style={styles.footerTitle}>Sapa UMKM</Text>
            <Text style={styles.footerText}>
              Platform terpadu untuk membantu UMKM Indonesia berkembang dengan menyediakan akses mudah ke berbagai layanan pemerintah dan swasta.
            </Text>
          </View>

          <View style={styles.footerColumn}>
            <Text style={styles.footerTitle}>Layanan</Text>
            <Text style={styles.footerLink}>Perizinan</Text>
            <Text style={styles.footerLink}>Pendanaan</Text>
            <Text style={styles.footerLink}>Pelatihan</Text>
            <Text style={styles.footerLink}>Pemasaran</Text>
          </View>

          <View style={styles.footerColumn}>
            <Text style={styles.footerTitle}>Perusahaan</Text>
            <Text style={styles.footerLink}>Tentang Kami</Text>
            <Text style={styles.footerLink}>Kontak</Text>
            <Text style={styles.footerLink}>Karir</Text>
            <Text style={styles.footerLink}>Blog</Text>
          </View>

          <View style={styles.footerColumn}>
            <Text style={styles.footerTitle}>Legal</Text>
            <Text style={styles.footerLink}>Kebijakan Privasi</Text>
            <Text style={styles.footerLink}>Syarat & Ketentuan</Text>
            <Text style={styles.footerLink}>FAQ</Text>
          </View>
        </View>

        <Text style={styles.copyText}>© 2024 Sapa UMKM. All rights reserved.</Text>
      </ScrollView>
    </>
  );
}

// Animated Background Circle Component
const AnimatedBackgroundCircle = ({ color, delay }: { color: string; delay: number }) => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0.8,
            duration: 3000,
            useNativeDriver: true,
            delay,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 3000,
            useNativeDriver: true,
            delay,
          }),
        ]),
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0.3,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.backgroundCircle,
        {
          backgroundColor: color,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    />
  );
};

// Floating Service Card Component with Animation
const FloatingServiceCard = ({ icon, title, desc, delay }: any) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -15,
          duration: 2000,
          useNativeDriver: true,
          delay,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.serviceCard,
        {
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.serviceIcon}>{icon}</Text>
      <Text style={styles.serviceTitle}>{title}</Text>
      <Text style={styles.serviceDesc}>{desc}</Text>
    </Animated.View>
  );
};

// FeatureCard component
const FeatureCard = ({ icon, title, description }: any) => (
  <View style={styles.featureCard}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDescription}>{description}</Text>
  </View>
);

// StatCard component
const StatCard = ({ number, label }: any) => (
  <LinearGradient
    colors={['rgba(102, 126, 234, 0.1)', 'rgba(118, 75, 162, 0.1)']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.statCard}
  >
    <Text style={styles.statNumber}>{number}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </LinearGradient>
);

const styles = StyleSheet.create({
  navbar: {
    width: '100%',
    height: 100,
    backgroundColor: 'rgba(18, 21, 60, 0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    position: 'absolute',
    top: 0,
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(102, 126, 234, 0.2)',
  },
  logoImage: {
    width: width > 800 ? 120 : 80,
    height: 50,
    top: 8,
  },
  navLinks: {
    flexDirection: 'row',
    gap: 8,
  },
  navLink: {
    color: '#fff',
    fontSize: 10,
    top: 8,
  },
  navButton: {
    backgroundColor: '#667eea',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    top: 8,
    shadowColor: '#667eea',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  navButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 8,
  },
  hero: {
    minHeight: 600,
    paddingVertical: 40,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundCircle: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    top: '20%',
    right: '10%',
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 1100,
    gap: 40,
    zIndex: 1,
  },
  heroLeft: {
    flex: 1,
  },
  heroRight: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  heroTitle: {
    fontSize: 35,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 20,
    textShadowColor: 'rgba(102, 126, 234, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 26,
    marginBottom: 40,
    textAlign: 'justify',
  },
  heroButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    backgroundColor: '#667eea',
    shadowColor: '#667eea',
    shadowOpacity: 0.6,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  serviceCard: {
    width: 160,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#667eea',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  serviceIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  serviceTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  serviceDesc: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
  },
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  containerContent: {
    alignItems: 'center',
    paddingBottom: 80,
    paddingTop: 80,
  },
  features: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 60,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'stretch',
    maxWidth: 1000,
    alignSelf: 'center',
  },
  featureCard: {
    flexBasis: '48%',
    flexGrow: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
    marginHorizontal: '1%',
    minHeight: 220,
  },
  featureIcon: {
    fontSize: 48,
    marginBottom: 15,
    textAlign: 'center',
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 22,
    textAlign: 'center',
  },
  stats: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    width: '100%',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 1000,
    alignSelf: 'center',
  },
  statCard: {
    flexBasis: '48%',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
    marginBottom: 20,
    marginHorizontal: '1%',
    minHeight: 150,
  },
  statNumber: {
    fontSize: 48,
    fontWeight: '800',
    color: '#667eea',
    marginBottom: 10,
    textShadowColor: 'rgba(102, 126, 234, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  statLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  cta: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
  },
  ctaTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  ctaSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 30,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingVertical: 50,
    paddingHorizontal: 20,
    backgroundColor: '#0b0e24',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: 'rgba(102, 126, 234, 0.2)',
  },
  footerColumn: {
    width: '45%',
    marginBottom: 25,
    maxWidth: 300,
  },
  footerTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 10,
  },
  footerText: {
    color: '#bbb',
    fontSize: 14,
    lineHeight: 20,
  },
  footerLink: {
    color: '#bbb',
    fontSize: 14,
    marginBottom: 6,
  },
  copyText: {
    color: '#999',
    textAlign: 'center',
    paddingVertical: 25,
    fontSize: 15,
    backgroundColor: '#0a0d23',
    borderTopWidth: 1,
    borderTopColor: 'rgba(102, 126, 234, 0.2)',
  },
});