import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [business, setBusiness] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginAndLoadProfile();
  }, []);

  const checkLoginAndLoadProfile = async () => {
    try {
      const loggedIn = await AsyncStorage.getItem('isLoggedIn');
      
      if (loggedIn === 'true') {
        setIsLoggedIn(true);
        loadProfile();
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error checking login:', error);
    }
  };

  const loadProfile = async () => {
    try {
      const [n, e, p, b] = await Promise.all([
        AsyncStorage.getItem('profile.name'),
        AsyncStorage.getItem('profile.email'),
        AsyncStorage.getItem('profile.phone'),
        AsyncStorage.getItem('profile.business'),
      ]);
      if (n) setName(n);
      if (e) setEmail(e);
      if (p) setPhone(p);
      if (b) setBusiness(b);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const saveProfile = async () => {
    if (!name || !email || !phone) {
      Alert.alert('Error', 'Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    setIsSaving(true);
    try {
      await Promise.all([
        AsyncStorage.setItem('profile.name', name),
        AsyncStorage.setItem('profile.email', email),
        AsyncStorage.setItem('profile.phone', phone),
        AsyncStorage.setItem('profile.business', business),
      ]);
      
      // Update user data in users array
      const existingUsers = await AsyncStorage.getItem('users');
      if (existingUsers) {
        const users = JSON.parse(existingUsers);
        const currentUser = await AsyncStorage.getItem('currentUser');
        
        if (currentUser) {
          const user = JSON.parse(currentUser);
          const userIndex = users.findIndex((u: any) => u.id === user.id);
          
          if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], name, email, phone };
            await AsyncStorage.setItem('users', JSON.stringify(users));
            await AsyncStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
          }
        }
      }
      
      Alert.alert('Berhasil', 'Profil berhasil disimpan');
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan profil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Konfirmasi Logout",
      "Apakah Anda yakin ingin keluar dari akun?",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Keluar",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('isLoggedIn');
              await AsyncStorage.removeItem('currentUser');
              
              Alert.alert(
                "Berhasil",
                "Anda telah keluar dari akun",
                [
                  {
                    text: "OK",
                    onPress: () => router.replace('/login/login'),
                  }
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Gagal logout. Silakan coba lagi.');
            }
          },
        },
      ]
    );
  };

  const handleMenuPress = (menu: string) => {
    Alert.alert('Info', `Menu ${menu} akan segera tersedia`);
  };

  const menuItems = [
    { icon: 'shield-checkmark', label: 'Keamanan Akun', color: '#667eea' },
    { icon: 'notifications', label: 'Notifikasi', color: '#f093fb' },
    { icon: 'help-circle', label: 'Bantuan', color: '#4facfe' },
    { icon: 'information-circle', label: 'Tentang Aplikasi', color: '#43e97b' },
  ];

  // If not logged in, show login prompt
  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.notLoggedInContainer}
          showsVerticalScrollIndicator={false}
        >
          <LinearGradient
            colors={['rgba(102, 126, 234, 0.2)', 'rgba(118, 75, 162, 0.2)']}
            style={styles.loginPromptCard}
          >
            <View style={styles.loginPromptIcon}>
              <Ionicons name="person-circle-outline" size={80} color="#667eea" />
            </View>
            <Text style={styles.loginPromptTitle}>Belum Masuk Akun</Text>
            <Text style={styles.loginPromptDesc}>
              Silakan masuk untuk mengakses profil dan menikmati semua fitur Sapa UMKM
            </Text>
            <TouchableOpacity 
              onPress={() => router.push('/login/login')}
              style={styles.loginPromptButton}
            >
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.loginPromptButtonGradient}
              >
                <Ionicons name="log-in-outline" size={20} color="#fff" />
                <Text style={styles.loginPromptButtonText}>Masuk Sekarang</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => router.push('/login/register')}
              style={styles.registerLink}
            >
              <Text style={styles.registerLinkText}>
                Belum punya akun? <Text style={styles.registerLinkHighlight}>Daftar</Text>
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <LinearGradient
        colors={['rgba(102, 126, 234, 0.2)', 'rgba(118, 75, 162, 0.2)']}
        style={styles.profileHeader}
      >
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </LinearGradient>
          <TouchableOpacity 
            style={styles.editAvatarButton}
            onPress={() => Alert.alert('Info', 'Fitur upload foto akan segera tersedia')}
          >
            <Ionicons name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.profileName}>{name || 'Pelaku UMKM'}</Text>
        <Text style={styles.profileEmail}>{email || 'user@umkm.id'}</Text>
        
        <TouchableOpacity 
          style={styles.editProfileButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Ionicons 
            name={isEditing ? "close-circle" : "create"} 
            size={16} 
            color="#fff" 
          />
          <Text style={styles.editProfileButtonText}>
            {isEditing ? 'Batal Edit' : 'Edit Profil'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Stats Card */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={[styles.statIconContainer, { backgroundColor: 'rgba(102, 126, 234, 0.2)' }]}>
            <Ionicons name="briefcase" size={20} color="#667eea" />
          </View>
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Layanan Digunakan</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <View style={[styles.statIconContainer, { backgroundColor: 'rgba(67, 233, 123, 0.2)' }]}>
            <Ionicons name="calendar" size={20} color="#43e97b" />
          </View>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Event Diikuti</Text>
        </View>
      </View>

      {/* Form Section */}
      {isEditing ? (
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Informasi Pribadi</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Nama Lengkap <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="rgba(255,255,255,0.5)" />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Masukkan nama lengkap"
                placeholderTextColor="rgba(255,255,255,0.4)"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Email <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.5)" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="email@example.com"
                placeholderTextColor="rgba(255,255,255,0.4)"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              No. Handphone <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="rgba(255,255,255,0.5)" />
              <TextInput
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="08xxxxxxxxxx"
                placeholderTextColor="rgba(255,255,255,0.4)"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama Usaha</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="store-outline" size={20} color="rgba(255,255,255,0.5)" />
              <TextInput
                value={business}
                onChangeText={setBusiness}
                placeholder="Nama usaha Anda"
                placeholderTextColor="rgba(255,255,255,0.4)"
                style={styles.input}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.saveButton}
            onPress={saveProfile}
            disabled={isSaving}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.saveButtonGradient}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informasi Pribadi</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="person" size={20} color="#667eea" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nama Lengkap</Text>
                <Text style={styles.infoValue}>{name || '-'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="mail" size={20} color="#f093fb" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{email || '-'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="call" size={20} color="#4facfe" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>No. Handphone</Text>
                <Text style={styles.infoValue}>{phone || '-'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <MaterialCommunityIcons name="store" size={20} color="#43e97b" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nama Usaha</Text>
                <Text style={styles.infoValue}>{business || '-'}</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Menu Section */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Pengaturan</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.menuItem}
            activeOpacity={0.7}
            onPress={() => handleMenuPress(item.label)}
          >
            <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon as any} size={22} color={item.color} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.4)" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color="#fa709a" />
        <Text style={styles.logoutButtonText}>Keluar</Text>
      </TouchableOpacity>

      {/* Bottom Spacing */}
      <View style={{ height: 100 }} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0a0e27' 
  },
  content: { 
    paddingBottom: 20 
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginPromptCard: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.3)',
  },
  loginPromptIcon: {
    marginBottom: 24,
  },
  loginPromptTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 12,
  },
  loginPromptDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  loginPromptButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  loginPromptButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  loginPromptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  registerLink: {
    paddingVertical: 12,
  },
  registerLinkText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  registerLinkHighlight: {
    color: '#667eea',
    fontWeight: '700',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#0a0e27',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 16,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  editProfileButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: -30,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  formSection: {
    padding: 20,
    marginTop: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '600',
  },
  required: {
    color: '#fa709a',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 15,
  },
  saveButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  infoSection: {
    padding: 20,
    marginTop: 24,
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  infoIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
  menuSection: {
    padding: 20,
    marginTop: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    backgroundColor: 'rgba(250, 112, 154, 0.15)',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(250, 112, 154, 0.3)',
    gap: 8,
  },
  logoutButtonText: {
    color: '#fa709a',
    fontSize: 16,
    fontWeight: '700',
  },
});