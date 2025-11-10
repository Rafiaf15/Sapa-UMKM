import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Data dropdown
const sektorUsaha = [
  'Makanan & Minuman',
  'Fashion & Pakaian',
  'Kerajinan Tangan',
  'Pertanian & Perkebunan',
  'Perikanan & Kelautan',
  'Peternakan',
  'Jasa Konstruksi',
  'Jasa Keuangan',
  'Jasa Konsultasi',
  'Teknologi & IT',
  'Pendidikan & Pelatihan',
  'Kesehatan & Kecantikan',
  'Otomotif',
  'Elektronik',
  'Perdagangan',
  'Lainnya'
];

const skalaUsaha = [
  { value: 'mikro', label: 'Mikro (Aset < 1 M, Omzet < 2 M/tahun)' },
  { value: 'kecil', label: 'Kecil (Aset 1-5 M, Omzet 2-15 M/tahun)' }
];

export default function NIBForm() {
  const [formData, setFormData] = useState({
    nik: '',
    namaLengkap: '',
    npwp: '',
    alamatPemilik: '',
    phone: '',
    email: '',
    namaUsaha: '',
    alamatUsaha: '',
    kodeKBLI: '',
    sektorUsaha: '',
    skalaUsaha: 'mikro',
    modalUsaha: '',
    hasKTP: 'tidak',
    hasSKD: 'tidak',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSektorDropdown, setShowSektorDropdown] = useState(false);

  const formatCurrency = (value: string) => {
    const number = value.replace(/[^0-9]/g, '');
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleSubmit = async () => {
    if (!formData.nik || !formData.namaLengkap || !formData.npwp || 
        !formData.alamatPemilik || !formData.phone || !formData.email ||
        !formData.namaUsaha || !formData.alamatUsaha || !formData.kodeKBLI ||
        !formData.sektorUsaha || !formData.modalUsaha) {
      Alert.alert('Error', 'Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    if (formData.nik.length !== 16) {
      Alert.alert('Error', 'NIK harus 16 digit');
      return;
    }

    if (formData.npwp.length !== 15) {
      Alert.alert('Error', 'NPWP harus 15 digit');
      return;
    }

    if (formData.phone.length < 10) {
      Alert.alert('Error', 'Nomor telepon tidak valid');
      return;
    }

    if (formData.kodeKBLI.length !== 5) {
      Alert.alert('Error', 'Kode KBLI harus 5 digit');
      return;
    }

    setIsSubmitting(true);

    try {
      const submission = {
        ...formData,
        id: Date.now().toString(),
        type: 'nib',
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };

      const existingSubmissions = await AsyncStorage.getItem('nibSubmissions');
      const submissions = existingSubmissions ? JSON.parse(existingSubmissions) : [];
      submissions.push(submission);
      await AsyncStorage.setItem('nibSubmissions', JSON.stringify(submissions));

      Alert.alert(
        'Berhasil Dikirim! 🎉',
        `Permohonan NIB Anda telah diterima.\n\nNomor Registrasi: ${submission.id}\n\nProses verifikasi memakan waktu 3-5 hari kerja. Tim kami akan menghubungi Anda melalui email/WhatsApp.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Gagal mengirim permohonan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(102, 126, 234, 0.2)', 'rgba(118, 75, 162, 0.2)']}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerIcon}>📋</Text>
          <Text style={styles.headerTitle}>Pengajuan NIB</Text>
          <Text style={styles.headerSubtitle}>
            Nomor Induk Berusaha - Izin usaha resmi dari pemerintah
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={24} color="#667eea" />
          <Text style={styles.infoBannerText}>
            NIB diperlukan untuk legalitas usaha. Proses verifikasi 3-5 hari kerja.
          </Text>
        </View>

        {/* DATA PEMILIK */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="person" size={20} color="#667eea" />
            <Text style={styles.sectionTitle}>Data Pemilik</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>NIK (Nomor Induk Kependudukan) <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputContainer}>
              <Ionicons name="card-outline" size={20} color="rgba(255,255,255,0.5)" />
              <TextInput
                style={styles.input}
                placeholder="16 digit sesuai e-KTP"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={formData.nik}
                onChangeText={(text) => setFormData({ ...formData, nik: text.replace(/[^0-9]/g, '') })}
                keyboardType="number-pad"
                maxLength={16}
              />
            </View>
            <Text style={styles.hint}>{formData.nik.length}/16 digit</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama Lengkap Pemilik <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="rgba(255,255,255,0.5)" />
              <TextInput
                style={styles.input}
                placeholder="Nama sesuai KTP"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={formData.namaLengkap}
                onChangeText={(text) => setFormData({ ...formData, namaLengkap: text })}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>NPWP Pribadi <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputContainer}>
              <Ionicons name="document-text-outline" size={20} color="rgba(255,255,255,0.5)" />
              <TextInput
                style={styles.input}
                placeholder="15 digit Nomor Pokok Wajib Pajak"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={formData.npwp}
                onChangeText={(text) => setFormData({ ...formData, npwp: text.replace(/[^0-9]/g, '') })}
                keyboardType="number-pad"
                maxLength={15}
              />
            </View>
            <Text style={styles.hint}>{formData.npwp.length}/15 digit</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Alamat Pemilik <Text style={styles.required}>*</Text></Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <Ionicons name="location-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.textAreaIcon} />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Alamat domisili sesuai KTP"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={formData.alamatPemilik}
                onChangeText={(text) => setFormData({ ...formData, alamatPemilik: text })}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>No. Telepon <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="rgba(255,255,255,0.5)" />
              <TextInput
                style={styles.input}
                placeholder="08xxxxxxxxxx"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text.replace(/[^0-9]/g, '') })}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.5)" />
              <TextInput
                style={styles.input}
                placeholder="email@example.com"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
        </View>

        {/* DATA USAHA */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="business" size={20} color="#667eea" />
            <Text style={styles.sectionTitle}>Data Usaha</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama Usaha <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputContainer}>
              <Ionicons name="business-outline" size={20} color="rgba(255,255,255,0.5)" />
              <TextInput
                style={styles.input}
                placeholder="Nama brand atau toko Anda"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={formData.namaUsaha}
                onChangeText={(text) => setFormData({ ...formData, namaUsaha: text })}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Alamat Lokasi Usaha <Text style={styles.required}>*</Text></Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <Ionicons name="location-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.textAreaIcon} />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Alamat tempat usaha beroperasi"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={formData.alamatUsaha}
                onChangeText={(text) => setFormData({ ...formData, alamatUsaha: text })}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kode KBLI <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputContainer}>
              <Ionicons name="code-outline" size={20} color="rgba(255,255,255,0.5)" />
              <TextInput
                style={styles.input}
                placeholder="5 digit (cth: 10792)"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={formData.kodeKBLI}
                onChangeText={(text) => setFormData({ ...formData, kodeKBLI: text.replace(/[^0-9]/g, '') })}
                keyboardType="number-pad"
                maxLength={5}
              />
            </View>
            <Text style={styles.hint}>
              Klasifikasi Baku Lapangan Usaha Indonesia ({formData.kodeKBLI.length}/5)
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sektor Usaha <Text style={styles.required}>*</Text></Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setShowSektorDropdown(!showSektorDropdown)}
            >
              <Ionicons name="briefcase-outline" size={20} color="rgba(255,255,255,0.5)" />
              <Text style={[styles.input, { paddingVertical: 14, color: formData.sektorUsaha ? '#fff' : 'rgba(255,255,255,0.4)' }]}>
                {formData.sektorUsaha || 'Pilih sektor usaha'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
            {showSektorDropdown && (
              <ScrollView style={styles.dropdown} nestedScrollEnabled>
                {sektorUsaha.map((sektor, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setFormData({ ...formData, sektorUsaha: sektor });
                      setShowSektorDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{sektor}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Skala Usaha <Text style={styles.required}>*</Text></Text>
            <View style={styles.radioGroup}>
              {skalaUsaha.map((skala) => (
                <TouchableOpacity
                  key={skala.value}
                  style={[
                    styles.radioButton,
                    formData.skalaUsaha === skala.value && styles.radioButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, skalaUsaha: skala.value })}
                >
                  <View style={styles.radioCircle}>
                    {formData.skalaUsaha === skala.value && <View style={styles.radioCircleInner} />}
                  </View>
                  <Text style={[
                    styles.radioLabel,
                    formData.skalaUsaha === skala.value && styles.radioLabelActive,
                  ]}>
                    {skala.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Estimasi Modal Usaha (Rp) <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputContainer}>
              <Ionicons name="cash-outline" size={20} color="rgba(255,255,255,0.5)" />
              <Text style={styles.currencyPrefix}>Rp</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={formData.modalUsaha}
                onChangeText={(text) => setFormData({ ...formData, modalUsaha: formatCurrency(text) })}
                keyboardType="number-pad"
              />
            </View>
          </View>
        </View>

        {/* DOKUMEN PENDUKUNG */}
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="document" size={20} color="#667eea" />
            <Text style={styles.sectionTitle}>Dokumen Pendukung</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Foto E-KTP <Text style={styles.required}>*</Text></Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[styles.radioButton, formData.hasKTP === 'ya' && styles.radioButtonActive]}
                onPress={() => setFormData({ ...formData, hasKTP: 'ya' })}
              >
                <View style={styles.radioCircle}>
                  {formData.hasKTP === 'ya' && <View style={styles.radioCircleInner} />}
                </View>
                <Text style={[styles.radioLabel, formData.hasKTP === 'ya' && styles.radioLabelActive]}>
                  Sudah siap diunggah
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.radioButton, formData.hasKTP === 'tidak' && styles.radioButtonActive]}
                onPress={() => setFormData({ ...formData, hasKTP: 'tidak' })}
              >
                <View style={styles.radioCircle}>
                  {formData.hasKTP === 'tidak' && <View style={styles.radioCircleInner} />}
                </View>
                <Text style={[styles.radioLabel, formData.hasKTP === 'tidak' && styles.radioLabelActive]}>
                  Akan dikirim via email
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.hint}>
              Dokumen identitas pemilik usaha (format JPG/PNG)
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Surat Keterangan Domisili (SKD)</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[styles.radioButton, formData.hasSKD === 'ya' && styles.radioButtonActive]}
                onPress={() => setFormData({ ...formData, hasSKD: 'ya' })}
              >
                <View style={styles.radioCircle}>
                  {formData.hasSKD === 'ya' && <View style={styles.radioCircleInner} />}
                </View>
                <Text style={[styles.radioLabel, formData.hasSKD === 'ya' && styles.radioLabelActive]}>
                  Ada, akan dilampirkan
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.radioButton, formData.hasSKD === 'tidak' && styles.radioButtonActive]}
                onPress={() => setFormData({ ...formData, hasSKD: 'tidak' })}
              >
                <View style={styles.radioCircle}>
                  {formData.hasSKD === 'tidak' && <View style={styles.radioCircleInner} />}
                </View>
                <Text style={[styles.radioLabel, formData.hasSKD === 'tidak' && styles.radioLabelActive]}>
                  Belum ada
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.hint}>
              Opsional - Tergantung kebijakan daerah setempat
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
          <LinearGradient colors={['#667eea', '#764ba2']} style={styles.submitButtonGradient}>
            <Ionicons name="send" size={20} color="#fff" />
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Mengirim...' : 'Ajukan Permohonan NIB'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e27' },
  header: { paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 24, paddingHorizontal: 20 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  headerContent: { alignItems: 'center' },
  headerIcon: { fontSize: 48, marginBottom: 12 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 8 },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  scrollView: { flex: 1 },
  content: { padding: 20 },
  infoBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(102, 126, 234, 0.15)', borderRadius: 12, padding: 16, marginBottom: 24, gap: 12, borderWidth: 1, borderColor: 'rgba(102, 126, 234, 0.3)' },
  infoBannerText: { flex: 1, color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 18 },
  section: { marginBottom: 24 },
  sectionTitleContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: '#fff', marginBottom: 8, fontWeight: '600' },
  required: { color: '#fa709a' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', gap: 12 },
  input: { flex: 1, paddingVertical: 14, color: '#fff', fontSize: 15 },
  textAreaContainer: { alignItems: 'flex-start', paddingVertical: 12 },
  textAreaIcon: { marginTop: 4 },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  hint: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  radioGroup: { gap: 12 },
  radioButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', gap: 12 },
  radioButtonActive: { backgroundColor: 'rgba(102, 126, 234, 0.15)', borderColor: '#667eea' },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)', justifyContent: 'center', alignItems: 'center' },
  radioCircleInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#667eea' },
  radioLabel: { flex: 1, color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  radioLabelActive: { color: '#fff', fontWeight: '600' },
  submitButton: { borderRadius: 12, overflow: 'hidden', marginTop: 8 },
  submitButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  currencyPrefix: { color: 'rgba(255,255,255,0.5)', fontSize: 15, fontWeight: '600' },
  dropdown: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, marginTop: 8, maxHeight: 300, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  dropdownItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  dropdownItemText: { color: '#fff', fontSize: 15 },
});