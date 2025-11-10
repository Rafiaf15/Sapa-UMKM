import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface UMKMProfile {
    // Data Pemilik
    nik: string;
    ownerName: string;
    npwpPribadi: string;
    ownerAddress: string;
    
    // Data Usaha
    businessName: string;
    businessAddress: string;
    kbliCode: string;
    businessSector: string;
    businessScale: string;
    capitalEstimate: string;
    
    // Dokumen Pendukung
    ktpPhoto: string | null;
    domicileLetter: string | null;
}

export default function UpdateProfileForm() {
    const [formData, setFormData] = useState<UMKMProfile>({
        // Data Pemilik
        nik: '',
        ownerName: '',
        npwpPribadi: '',
        ownerAddress: '',
        
        // Data Usaha
        businessName: '',
        businessAddress: '',
        kbliCode: '',
        businessSector: '',
        businessScale: '',
        capitalEstimate: '',
        
        // Dokumen
        ktpPhoto: null,
        domicileLetter: null,
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showKBLIDropdown, setShowKBLIDropdown] = useState(false);
    const [showSectorDropdown, setShowSectorDropdown] = useState(false);
    const [showScaleDropdown, setShowScaleDropdown] = useState(false);

    // Dropdown Options
    const businessSectors = [
        'Makanan & Minuman',
        'Fashion & Tekstil',
        'Kerajinan Tangan',
        'Jasa',
        'Pertanian',
        'Perikanan',
        'Peternakan',
        'Teknologi',
        'Perdagangan',
        'Otomotif',
        'Kesehatan & Kecantikan',
        'Lainnya',
    ];

    const businessScales = [
        'Mikro (Aset ≤ 50 juta atau Omset ≤ 300 juta/tahun)',
        'Kecil (Aset > 50 juta - 500 juta atau Omset > 300 juta - 2,5 milyar/tahun)',
    ];

    const kbliCodes = [
        { code: '10792', name: 'Perdagangan Kebutuhan Pokok' },
        { code: '47191', name: 'Perdagangan Eceran Makanan' },
        { code: '47711', name: 'Perdagangan Eceran Pakaian' },
        { code: '56101', name: 'Restoran' },
        { code: '47521', name: 'Perdagangan Eceran Bahan Bangunan' },
        { code: '13111', name: 'Persiapan Serat Tekstil' },
        { code: '01111', name: 'Pertanian Padi' },
        { code: '03111', name: 'Penangkapan Ikan Laut' },
        { code: '01410', name: 'Peternakan Ayam' },
        { code: '62010', name: 'Aktivitas Pemrograman Komputer' },
    ];

    useEffect(() => {
        loadProfileData();
        requestPermissions();
    }, []);

    const requestPermissions = async () => {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
            Alert.alert('Izin Diperlukan', 'Aplikasi memerlukan izin akses kamera dan galeri untuk upload dokumen');
        }
    };

    const loadProfileData = async () => {
        try {
            const profileData = await AsyncStorage.getItem('umkmProfile');
            if (profileData) {
                const parsedData = JSON.parse(profileData);
                setFormData(parsedData);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const pickImage = async (type: 'ktp' | 'domicile') => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: type === 'ktp' ? [16, 10] : [4, 3],
                quality: 0.8,
            });

            if (!result.canceled) {
                if (type === 'ktp') {
                    setFormData({ ...formData, ktpPhoto: result.assets[0].uri });
                } else {
                    setFormData({ ...formData, domicileLetter: result.assets[0].uri });
                }
            }
        } catch (error) {
            Alert.alert('Error', 'Gagal memilih gambar');
        }
    };

    const validateNIK = (nik: string): boolean => {
        return nik.length === 16 && /^\d+$/.test(nik);
    };

    const validateNPWP = (npwp: string): boolean => {
        const cleanNPWP = npwp.replace(/[^\d]/g, '');
        return cleanNPWP.length === 15 && /^\d+$/.test(cleanNPWP);
    };

    const formatNPWP = (text: string): string => {
        const cleaned = text.replace(/[^\d]/g, '');
        if (cleaned.length <= 2) return cleaned;
        if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
        if (cleaned.length <= 8) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`;
        if (cleaned.length <= 9) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}.${cleaned.slice(8)}`;
        return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}.${cleaned.slice(8, 9)}-${cleaned.slice(9, 12)}.${cleaned.slice(12, 15)}`;
    };

    const formatCurrency = (text: string): string => {
        const number = text.replace(/[^\d]/g, '');
        return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const getKBLIName = (code: string): string => {
        const kbli = kbliCodes.find(item => item.code === code);
        return kbli ? kbli.name : '';
    };

    const handleSubmit = async () => {
        // Validasi Data Pemilik
        if (!formData.nik || !validateNIK(formData.nik)) {
            Alert.alert('Error', 'NIK harus 16 digit angka');
            return;
        }
        if (!formData.ownerName.trim()) {
            Alert.alert('Error', 'Nama lengkap pemilik wajib diisi');
            return;
        }
        if (!formData.npwpPribadi || !validateNPWP(formData.npwpPribadi)) {
            Alert.alert('Error', 'NPWP harus 15 digit angka');
            return;
        }
        if (!formData.ownerAddress.trim()) {
            Alert.alert('Error', 'Alamat pemilik wajib diisi');
            return;
        }

        // Validasi Data Usaha
        if (!formData.businessName.trim()) {
            Alert.alert('Error', 'Nama usaha wajib diisi');
            return;
        }
        if (!formData.businessAddress.trim()) {
            Alert.alert('Error', 'Alamat lokasi usaha wajib diisi');
            return;
        }
        if (!formData.kbliCode) {
            Alert.alert('Error', 'Kode KBLI wajib dipilih');
            return;
        }
        if (!formData.businessSector) {
            Alert.alert('Error', 'Sektor usaha wajib dipilih');
            return;
        }
        if (!formData.businessScale) {
            Alert.alert('Error', 'Skala usaha wajib dipilih');
            return;
        }
        if (!formData.capitalEstimate) {
            Alert.alert('Error', 'Estimasi modal usaha wajib diisi');
            return;
        }

        // Validasi Dokumen
        if (!formData.ktpPhoto) {
            Alert.alert('Error', 'Foto e-KTP wajib di-upload');
            return;
        }

        setIsSubmitting(true);

        try {
            await AsyncStorage.setItem('umkmProfile', JSON.stringify(formData));

            const submission = {
                ...formData,
                id: Date.now().toString(),
                type: 'profile_update',
                status: 'completed',
                updatedAt: new Date().toISOString(),
            };

            const existingSubmissions = await AsyncStorage.getItem('profileUpdateSubmissions');
            const submissions = existingSubmissions ? JSON.parse(existingSubmissions) : [];
            submissions.push(submission);
            await AsyncStorage.setItem('profileUpdateSubmissions', JSON.stringify(submissions));

            Alert.alert(
                'Profil Berhasil Diperbarui! ✅',
                'Data profil UMKM Anda telah berhasil disimpan dan akan diverifikasi.',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (error) {
            Alert.alert('Error', 'Gagal memperbarui profil. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Memuat data profil...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(72, 149, 239, 0.2)', 'rgba(120, 195, 251, 0.2)']}
                style={styles.header}
            >
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerIcon}>📋</Text>
                    <Text style={styles.headerTitle}>Pembaruan Profil UMKM</Text>
                    <Text style={styles.headerSubtitle}>
                        Lengkapi data profil sesuai dokumen resmi
                    </Text>
                </View>
            </LinearGradient>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.infoBanner}>
                    <Ionicons name="information-circle" size={24} color="#4895ef" />
                    <Text style={styles.infoBannerText}>
                        Pastikan semua data yang diisi sesuai dengan dokumen resmi (KTP, NPWP, dll)
                    </Text>
                </View>

                {/* BAGIAN 1: DATA PEMILIK */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionNumber}>1</Text>
                        <Text style={styles.sectionTitle}>Data Pemilik</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>NIK (Nomor Induk Kependudukan) <Text style={styles.required}>*</Text></Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="card-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <TextInput
                                style={styles.input}
                                placeholder="16 digit NIK sesuai e-KTP"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.nik}
                                onChangeText={(text) => setFormData({ ...formData, nik: text.replace(/[^0-9]/g, '') })}
                                keyboardType="number-pad"
                                maxLength={16}
                            />
                        </View>
                        {formData.nik && !validateNIK(formData.nik) && (
                            <Text style={styles.errorText}>NIK harus 16 digit angka</Text>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nama Lengkap Pemilik <Text style={styles.required}>*</Text></Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <TextInput
                                style={styles.input}
                                placeholder="Nama sesuai KTP"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.ownerName}
                                onChangeText={(text) => setFormData({ ...formData, ownerName: text })}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>NPWP Pribadi <Text style={styles.required}>*</Text></Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="document-text-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <TextInput
                                style={styles.input}
                                placeholder="00.000.000.0-000.000"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.npwpPribadi}
                                onChangeText={(text) => setFormData({ ...formData, npwpPribadi: formatNPWP(text) })}
                                keyboardType="number-pad"
                                maxLength={20}
                            />
                        </View>
                        <Text style={styles.hint}>Format: 15 digit (akan diformat otomatis)</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Alamat Pemilik <Text style={styles.required}>*</Text></Text>
                        <View style={[styles.inputContainer, styles.textAreaContainer]}>
                            <Ionicons name="location-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.textAreaIcon} />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Alamat sesuai domisili pribadi"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.ownerAddress}
                                onChangeText={(text) => setFormData({ ...formData, ownerAddress: text })}
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                    </View>
                </View>

                {/* BAGIAN 2: DATA USAHA */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionNumber}>2</Text>
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
                                value={formData.businessName}
                                onChangeText={(text) => setFormData({ ...formData, businessName: text })}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Alamat Lokasi Usaha <Text style={styles.required}>*</Text></Text>
                        <View style={[styles.inputContainer, styles.textAreaContainer]}>
                            <Ionicons name="storefront-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.textAreaIcon} />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Alamat tempat usaha beroperasi"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.businessAddress}
                                onChangeText={(text) => setFormData({ ...formData, businessAddress: text })}
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Kode KBLI <Text style={styles.required}>*</Text></Text>
                        <Text style={styles.hint}>Klasifikasi Baku Lapangan Usaha Indonesia</Text>
                        <TouchableOpacity 
                            style={styles.dropdownButton}
                            onPress={() => setShowKBLIDropdown(!showKBLIDropdown)}
                        >
                            <Ionicons name="search-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <Text style={[styles.dropdownButtonText, formData.kbliCode ? styles.dropdownButtonTextSelected : {}]}>
                                {formData.kbliCode ? `${formData.kbliCode} - ${getKBLIName(formData.kbliCode)}` : 'Pilih Kode KBLI'}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="rgba(255,255,255,0.5)" />
                        </TouchableOpacity>
                        
                        {showKBLIDropdown && (
                            <View style={styles.dropdown}>
                                <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                                    {kbliCodes.map((item) => (
                                        <TouchableOpacity
                                            key={item.code}
                                            style={styles.dropdownItem}
                                            onPress={() => {
                                                setFormData({ ...formData, kbliCode: item.code });
                                                setShowKBLIDropdown(false);
                                            }}
                                        >
                                            <Text style={styles.dropdownItemCode}>{item.code}</Text>
                                            <Text style={styles.dropdownItemName}>{item.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Sektor Usaha <Text style={styles.required}>*</Text></Text>
                        <TouchableOpacity 
                            style={styles.dropdownButton}
                            onPress={() => setShowSectorDropdown(!showSectorDropdown)}
                        >
                            <Ionicons name="business-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <Text style={[styles.dropdownButtonText, formData.businessSector ? styles.dropdownButtonTextSelected : {}]}>
                                {formData.businessSector || 'Pilih Sektor Usaha'}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="rgba(255,255,255,0.5)" />
                        </TouchableOpacity>
                        
                        {showSectorDropdown && (
                            <View style={styles.dropdown}>
                                <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                                    {businessSectors.map((sector) => (
                                        <TouchableOpacity
                                            key={sector}
                                            style={styles.dropdownItem}
                                            onPress={() => {
                                                setFormData({ ...formData, businessSector: sector });
                                                setShowSectorDropdown(false);
                                            }}
                                        >
                                            <Text style={styles.dropdownItemText}>{sector}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Skala Usaha <Text style={styles.required}>*</Text></Text>
                        <TouchableOpacity 
                            style={styles.dropdownButton}
                            onPress={() => setShowScaleDropdown(!showScaleDropdown)}
                        >
                            <Ionicons name="analytics-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <Text style={[styles.dropdownButtonText, formData.businessScale ? styles.dropdownButtonTextSelected : {}]}>
                                {formData.businessScale || 'Pilih Skala Usaha'}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="rgba(255,255,255,0.5)" />
                        </TouchableOpacity>
                        
                        {showScaleDropdown && (
                            <View style={styles.dropdown}>
                                <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                                    {businessScales.map((scale) => (
                                        <TouchableOpacity
                                            key={scale}
                                            style={styles.dropdownItem}
                                            onPress={() => {
                                                setFormData({ ...formData, businessScale: scale });
                                                setShowScaleDropdown(false);
                                            }}
                                        >
                                            <Text style={styles.dropdownItemText}>{scale}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Estimasi Modal Usaha <Text style={styles.required}>*</Text></Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="cash-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <Text style={styles.currencyPrefix}>Rp</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.capitalEstimate}
                                onChangeText={(text) => setFormData({ ...formData, capitalEstimate: formatCurrency(text) })}
                                keyboardType="number-pad"
                            />
                        </View>
                        <Text style={styles.hint}>Nominal investasi yang dikeluarkan</Text>
                    </View>
                </View>

                {/* BAGIAN 3: DOKUMEN PENDUKUNG */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionNumber}>3</Text>
                        <Text style={styles.sectionTitle}>Dokumen Pendukung</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Foto e-KTP <Text style={styles.required}>*</Text></Text>
                        <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage('ktp')}>
                            {formData.ktpPhoto ? (
                                <View style={styles.uploadedContainer}>
                                    <Image source={{ uri: formData.ktpPhoto }} style={styles.uploadedImage} />
                                    <View style={styles.uploadedOverlay}>
                                        <Ionicons name="checkmark-circle" size={32} color="#4CD964" />
                                        <Text style={styles.uploadedText}>Foto KTP telah di-upload</Text>
                                        <Text style={styles.uploadedSubtext}>Tap untuk mengganti</Text>
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.uploadContent}>
                                    <Ionicons name="cloud-upload-outline" size={48} color="rgba(255,255,255,0.5)" />
                                    <Text style={styles.uploadText}>Upload Foto e-KTP</Text>
                                    <Text style={styles.uploadSubtext}>Format: JPG, PNG (Max 5MB)</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Surat Keterangan Domisili (SKD)</Text>
                        <Text style={styles.hint}>Opsional - Tergantung persyaratan daerah</Text>
                        <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage('domicile')}>
                            {formData.domicileLetter ? (
                                <View style={styles.uploadedContainer}>
                                    <Image source={{ uri: formData.domicileLetter }} style={styles.uploadedImage} />
                                    <View style={styles.uploadedOverlay}>
                                        <Ionicons name="checkmark-circle" size={32} color="#4CD964" />
                                        <Text style={styles.uploadedText}>SKD telah di-upload</Text>
                                        <Text style={styles.uploadedSubtext}>Tap untuk mengganti</Text>
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.uploadContent}>
                                    <Ionicons name="document-attach-outline" size={48} color="rgba(255,255,255,0.5)" />
                                    <Text style={styles.uploadText}>Upload SKD (Opsional)</Text>
                                    <Text style={styles.uploadSubtext}>Format: JPG, PNG, PDF (Max 5MB)</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                        <Text style={styles.cancelButtonText}>Batal</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.submitButton} 
                        onPress={handleSubmit} 
                        disabled={isSubmitting}
                    >
                        <LinearGradient colors={['#4895ef', '#78c3fb']} style={styles.submitButtonGradient}>
                            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                            <Text style={styles.submitButtonText}>
                                {isSubmitting ? 'Menyimpan...' : 'Simpan & Verifikasi'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0e27' },
    loadingContainer: { flex: 1, backgroundColor: '#0a0e27', justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: '#fff', fontSize: 16 },
    header: { paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 24, paddingHorizontal: 20 },
    backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    headerContent: { alignItems: 'center' },
    headerIcon: { fontSize: 48, marginBottom: 12 },
    headerTitle: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 8 },
    headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
    scrollView: { flex: 1 },
    content: { padding: 20 },
    infoBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(72, 149, 239, 0.15)', borderRadius: 12, padding: 16, marginBottom: 24, gap: 12, borderWidth: 1, borderColor: 'rgba(72, 149, 239, 0.3)' },
    infoBannerText: { flex: 1, color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 18 },
    section: { marginBottom: 32 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
    sectionNumber: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#4895ef', color: '#fff', fontSize: 18, fontWeight: '700', textAlign: 'center', lineHeight: 32 },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 14, color: '#fff', marginBottom: 8, fontWeight: '600' },
    required: { color: '#fa709a' },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', gap: 12 },
    input: { flex: 1, paddingVertical: 14, color: '#fff', fontSize: 15 },
    currencyPrefix: { color: 'rgba(255,255,255,0.5)', fontSize: 15, fontWeight: '600' },
    textAreaContainer: { alignItems: 'flex-start', paddingVertical: 12 },
    textAreaIcon: { marginTop: 4 },
    textArea: { minHeight: 80, textAlignVertical: 'top' },
    hint: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
    errorText: { fontSize: 12, color: '#fa709a', marginTop: 4 },
    
    // Dropdown Styles
    dropdownButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        borderRadius: 12, 
        paddingHorizontal: 16, 
        paddingVertical: 14,
        borderWidth: 1, 
        borderColor: 'rgba(255,255,255,0.1)', 
        gap: 12 
    },
    dropdownButtonText: { 
        flex: 1, 
        color: 'rgba(255,255,255,0.4)', 
        fontSize: 15 
    },
    dropdownButtonTextSelected: { 
        color: '#fff' 
    },
    dropdown: { 
        backgroundColor: 'rgba(255,255,255,0.08)', 
        borderRadius: 12, 
        marginTop: 8, 
        maxHeight: 200, 
        borderWidth: 1, 
        borderColor: 'rgba(255,255,255,0.1)' 
    },
    dropdownScroll: { 
        maxHeight: 200 
    },
    dropdownItem: { 
        padding: 16, 
        borderBottomWidth: 1, 
        borderBottomColor: 'rgba(255,255,255,0.05)' 
    },
    dropdownItemCode: { 
        color: '#4895ef', 
        fontSize: 14, 
        fontWeight: '600', 
        marginBottom: 4 
    },
    dropdownItemName: { 
        color: 'rgba(255,255,255,0.7)', 
        fontSize: 12 
    },
    dropdownItemText: { 
        color: '#fff', 
        fontSize: 14 
    },
    
    // Upload Styles
    uploadButton: { 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        borderRadius: 12, 
        borderWidth: 1, 
        borderColor: 'rgba(255,255,255,0.1)', 
        borderStyle: 'dashed',
        overflow: 'hidden'
    },
    uploadContent: { 
        padding: 32, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    uploadText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: '600', 
        marginTop: 12, 
        marginBottom: 4 
    },
    uploadSubtext: { 
        color: 'rgba(255,255,255,0.5)', 
        fontSize: 12 
    },
    uploadedContainer: { 
        position: 'relative' 
    },
    uploadedImage: { 
        width: '100%', 
        height: 200, 
        resizeMode: 'cover' 
    },
    uploadedOverlay: { 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: 'rgba(0,0,0,0.7)', 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    uploadedText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: '600', 
        marginTop: 8 
    },
    uploadedSubtext: { 
        color: 'rgba(255,255,255,0.7)', 
        fontSize: 12, 
        marginTop: 4 
    },
    
    // Button Group
    buttonGroup: { 
        flexDirection: 'row', 
        gap: 12, 
        marginTop: 24 
    },
    cancelButton: { 
        flex: 1, 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        borderRadius: 12, 
        paddingVertical: 16, 
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
    },
    cancelButtonText: { 
        color: 'rgba(255,255,255,0.7)', 
        fontSize: 16, 
        fontWeight: '600' 
    },
    submitButton: { 
        flex: 2, 
        borderRadius: 12, 
        overflow: 'hidden' 
    },
    submitButtonGradient: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingVertical: 16, 
        gap: 8 
    },
    submitButtonText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: '600' 
    },
});