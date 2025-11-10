import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput,
    TouchableOpacity, Alert, Platform, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const jenisMerek = [
    { value: 'dagang', label: 'Merek Dagang (Produk/Jasa)' },
    { value: 'kolektif', label: 'Merek Kolektif (Kelompok)' },
    { value: 'terdaftar', label: 'Merek Terdaftar (Logo/Nama)' }
];

const kelasBarang = [
    'Kelas 1-5: Kimia & Industri',
    'Kelas 6-14: Logam & Mesin',
    'Kelas 15-17: Musik & Elektronik',
    'Kelas 18-21: Kulit & Barang Rumah Tangga',
    'Kelas 22-27: Tekstil & Pakaian',
    'Kelas 28-34: Makanan & Minuman',
    'Kelas 35-45: Jasa'
];

const layananMerek = [
    'Pendaftaran Merek Baru',
    'Perpanjangan Merek',
    'Pengalihan Hak Merek',
    'Pencatatan Perubahan Data',
    'Konsultasi Merek'
];

export default function MerekForm() {
    const [formData, setFormData] = useState({
        businessName: '',
        ownerName: '',
        nik: '',
        npwp: '',
        address: '',
        brandName: '',
        brandDescription: '',
        serviceType: '',
        brandType: 'dagang',
        productClass: '',
        hasLogo: 'ya',
        logoDescription: '',
        logoImage: null as string | null, // Tambahan untuk menyimpan URI gambar
        usageStartDate: '',
        hasRegistered: 'tidak',
        registrationNumber: '',
        similarCheck: 'belum',
        phone: '',
        email: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showServiceDropdown, setShowServiceDropdown] = useState(false);
    const [showClassDropdown, setShowClassDropdown] = useState(false);

    // Fungsi untuk memilih gambar dari gallery
    const pickImage = async () => {
        // Request permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Izin diperlukan', 'Izin untuk mengakses galeri diperlukan untuk memilih logo.');
            return;
        }

        // Launch image picker
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
            base64: true,
        });

        if (!result.canceled) {
            setFormData({
                ...formData,
                logoImage: result.assets[0].uri,
                logoDescription: formData.logoDescription || `Logo - ${result.assets[0].fileName || 'file'}`
            });
        }
    };

    // Fungsi untuk mengambil foto dengan kamera
    const takePhoto = async () => {
        // Request permission
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Izin diperlukan', 'Izin untuk mengakses kamera diperlukan untuk mengambil foto logo.');
            return;
        }

        // Launch camera
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
            base64: true,
        });

        if (!result.canceled) {
            setFormData({
                ...formData,
                logoImage: result.assets[0].uri,
                logoDescription: formData.logoDescription || 'Logo - Foto kamera'
            });
        }
    };

    // Fungsi untuk menghapus gambar yang dipilih
    const removeImage = () => {
        setFormData({
            ...formData,
            logoImage: null
        });
    };

    const handleSubmit = async () => {
        if (!formData.businessName || !formData.ownerName || !formData.nik ||
            !formData.address || !formData.brandName || !formData.brandDescription ||
            !formData.serviceType || !formData.productClass ||
            !formData.phone || !formData.email) {
            Alert.alert('Error', 'Mohon lengkapi semua field yang wajib diisi');
            return;
        }

        if (formData.nik.length !== 16) {
            Alert.alert('Error', 'NIK harus 16 digit');
            return;
        }

        setIsSubmitting(true);

        try {
            const submission = {
                ...formData,
                id: Date.now().toString(),
                type: 'merek',
                status: 'pending',
                submittedAt: new Date().toISOString(),
            };

            const existingSubmissions = await AsyncStorage.getItem('merekSubmissions');
            const submissions = existingSubmissions ? JSON.parse(existingSubmissions) : [];
            submissions.push(submission);
            await AsyncStorage.setItem('merekSubmissions', JSON.stringify(submissions));

            Alert.alert(
                'Permohonan Diterima! ®️',
                `Nomor Registrasi: ${submission.id}\n\nPermohonan merek Anda telah diterima. Tim legal kami akan melakukan penelusuran merek serupa dan menghubungi Anda dalam 3-7 hari kerja.`,
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
                colors={['rgba(240, 147, 251, 0.2)', 'rgba(245, 87, 108, 0.2)']}
                style={styles.header}
            >
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerIcon}>®️</Text>
                    <Text style={styles.headerTitle}>Registrasi Merek Produk</Text>
                    <Text style={styles.headerSubtitle}>
                        Lindungi brand dan produk Anda dengan pendaftaran merek resmi
                    </Text>
                </View>
            </LinearGradient>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.infoBanner}>
                    <Ionicons name="information-circle" size={24} color="#f093fb" />
                    <Text style={styles.infoBannerText}>
                        Perlindungan merek berlaku 10 tahun dan dapat diperpanjang. Proses verifikasi 7-14 hari kerja.
                    </Text>
                </View>

                {/* Data Pemohon */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Data Pemohon</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nama Usaha/Perusahaan <Text style={styles.required}>*</Text></Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="business-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <TextInput
                                style={styles.input}
                                placeholder="Nama badan usaha/CV/PT"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.businessName}
                                onChangeText={(text) => setFormData({ ...formData, businessName: text })}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nama Pemilik/Direktur <Text style={styles.required}>*</Text></Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <TextInput
                                style={styles.input}
                                placeholder="Nama lengkap pemilik"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.ownerName}
                                onChangeText={(text) => setFormData({ ...formData, ownerName: text })}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>NIK <Text style={styles.required}>*</Text></Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="card-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <TextInput
                                style={styles.input}
                                placeholder="16 digit sesuai KTP"
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
                        <Text style={styles.label}>NPWP (Opsional)</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="document-text-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <TextInput
                                style={styles.input}
                                placeholder="15 digit NPWP"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.npwp}
                                onChangeText={(text) => setFormData({ ...formData, npwp: text.replace(/[^0-9]/g, '') })}
                                keyboardType="number-pad"
                                maxLength={15}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Alamat Lengkap <Text style={styles.required}>*</Text></Text>
                        <View style={[styles.inputContainer, styles.textAreaContainer]}>
                            <Ionicons name="location-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.textAreaIcon} />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Alamat domisili atau kantor usaha"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.address}
                                onChangeText={(text) => setFormData({ ...formData, address: text })}
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                    </View>
                </View>

                {/* Informasi Merek */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informasi Merek</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Jenis Layanan <Text style={styles.required}>*</Text></Text>
                        <TouchableOpacity
                            style={styles.inputContainer}
                            onPress={() => setShowServiceDropdown(!showServiceDropdown)}
                        >
                            <Ionicons name="list-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <Text style={[styles.input, { paddingVertical: 14, color: formData.serviceType ? '#fff' : 'rgba(255,255,255,0.4)' }]}>
                                {formData.serviceType || 'Pilih jenis layanan'}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="rgba(255,255,255,0.5)" />
                        </TouchableOpacity>
                        {showServiceDropdown && (
                            <ScrollView style={styles.dropdown} nestedScrollEnabled>
                                {layananMerek.map((layanan, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setFormData({ ...formData, serviceType: layanan });
                                            setShowServiceDropdown(false);
                                        }}
                                    >
                                        <Text style={styles.dropdownItemText}>{layanan}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nama Merek/Brand <Text style={styles.required}>*</Text></Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="pricetag-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <TextInput
                                style={styles.input}
                                placeholder="Nama merek yang ingin didaftarkan"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.brandName}
                                onChangeText={(text) => setFormData({ ...formData, brandName: text })}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Deskripsi Merek <Text style={styles.required}>*</Text></Text>
                        <View style={[styles.inputContainer, styles.textAreaContainer]}>
                            <Ionicons name="text-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.textAreaIcon} />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Jelaskan produk/jasa yang menggunakan merek ini"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.brandDescription}
                                onChangeText={(text) => setFormData({ ...formData, brandDescription: text })}
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Jenis Merek <Text style={styles.required}>*</Text></Text>
                        <View style={styles.radioGroup}>
                            {jenisMerek.map((jenis) => (
                                <TouchableOpacity
                                    key={jenis.value}
                                    style={[
                                        styles.radioButton,
                                        formData.brandType === jenis.value && styles.radioButtonActive,
                                    ]}
                                    onPress={() => setFormData({ ...formData, brandType: jenis.value })}
                                >
                                    <View style={styles.radioCircle}>
                                        {formData.brandType === jenis.value && <View style={styles.radioCircleInner} />}
                                    </View>
                                    <Text style={[
                                        styles.radioLabel,
                                        formData.brandType === jenis.value && styles.radioLabelActive,
                                    ]}>
                                        {jenis.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Kelas Barang/Jasa <Text style={styles.required}>*</Text></Text>
                        <TouchableOpacity
                            style={styles.inputContainer}
                            onPress={() => setShowClassDropdown(!showClassDropdown)}
                        >
                            <Ionicons name="grid-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <Text style={[styles.input, { paddingVertical: 14, color: formData.productClass ? '#fff' : 'rgba(255,255,255,0.4)' }]}>
                                {formData.productClass || 'Pilih kelas barang/jasa'}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="rgba(255,255,255,0.5)" />
                        </TouchableOpacity>
                        {showClassDropdown && (
                            <ScrollView style={styles.dropdown} nestedScrollEnabled>
                                {kelasBarang.map((kelas, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setFormData({ ...formData, productClass: kelas });
                                            setShowClassDropdown(false);
                                        }}
                                    >
                                        <Text style={styles.dropdownItemText}>{kelas}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}
                        <Text style={styles.hint}>Pilih sesuai kategori produk/jasa Anda</Text>
                    </View>
                </View>

                {/* Detail Merek */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Detail Merek</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Memiliki Logo/Desain?</Text>
                        <View style={styles.radioGroup}>
                            <TouchableOpacity
                                style={[styles.radioButton, formData.hasLogo === 'ya' && styles.radioButtonActive]}
                                onPress={() => setFormData({ ...formData, hasLogo: 'ya' })}
                            >
                                <View style={styles.radioCircle}>
                                    {formData.hasLogo === 'ya' && <View style={styles.radioCircleInner} />}
                                </View>
                                <Text style={[styles.radioLabel, formData.hasLogo === 'ya' && styles.radioLabelActive]}>
                                    Ya, ada logo
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.radioButton, formData.hasLogo === 'tidak' && styles.radioButtonActive]}
                                onPress={() => {
                                    setFormData({ 
                                        ...formData, 
                                        hasLogo: 'tidak', 
                                        logoDescription: '',
                                        logoImage: null 
                                    });
                                }}
                            >
                                <View style={styles.radioCircle}>
                                    {formData.hasLogo === 'tidak' && <View style={styles.radioCircleInner} />}
                                </View>
                                <Text style={[styles.radioLabel, formData.hasLogo === 'tidak' && styles.radioLabelActive]}>
                                    Hanya nama/teks
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {formData.hasLogo === 'ya' && (
                        <>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Unggah Logo</Text>
                                <View style={styles.imageUploadContainer}>
                                    {formData.logoImage ? (
                                        <View style={styles.imagePreviewContainer}>
                                            <Image 
                                                source={{ uri: formData.logoImage }} 
                                                style={styles.imagePreview} 
                                            />
                                            <TouchableOpacity 
                                                style={styles.removeImageButton}
                                                onPress={removeImage}
                                            >
                                                <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
                                                <Text style={styles.removeImageText}>Hapus</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <View style={styles.uploadButtonsContainer}>
                                            <TouchableOpacity 
                                                style={styles.uploadButton}
                                                onPress={pickImage}
                                            >
                                                <Ionicons name="image-outline" size={24} color="#f093fb" />
                                                <Text style={styles.uploadButtonText}>Pilih dari Galeri</Text>
                                                <Text style={styles.uploadButtonSubtext}>PNG, JPG max 5MB</Text>
                                            </TouchableOpacity>
                                            
                                            <TouchableOpacity 
                                                style={styles.uploadButton}
                                                onPress={takePhoto}
                                            >
                                                <Ionicons name="camera-outline" size={24} color="#f093fb" />
                                                <Text style={styles.uploadButtonText}>Ambil Foto</Text>
                                                <Text style={styles.uploadButtonSubtext}>Gunakan Kamera</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Deskripsi Logo</Text>
                                <View style={[styles.inputContainer, styles.textAreaContainer]}>
                                    <Ionicons name="color-palette-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.textAreaIcon} />
                                    <TextInput
                                        style={[styles.input, styles.textArea]}
                                        placeholder="Jelaskan warna, bentuk, dan elemen logo"
                                        placeholderTextColor="rgba(255,255,255,0.4)"
                                        value={formData.logoDescription}
                                        onChangeText={(text) => setFormData({ ...formData, logoDescription: text })}
                                        multiline
                                        numberOfLines={2}
                                    />
                                </View>
                            </View>
                        </>
                    )}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Mulai Menggunakan Merek (Tahun)</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="calendar-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <TextInput
                                style={styles.input}
                                placeholder="Contoh: 2020"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.usageStartDate}
                                onChangeText={(text) => setFormData({ ...formData, usageStartDate: text.replace(/[^0-9]/g, '') })}
                                keyboardType="number-pad"
                                maxLength={4}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Sudah Pernah Mendaftar Merek Serupa?</Text>
                        <View style={styles.radioGroup}>
                            <TouchableOpacity
                                style={[styles.radioButton, formData.hasRegistered === 'ya' && styles.radioButtonActive]}
                                onPress={() => setFormData({ ...formData, hasRegistered: 'ya' })}
                            >
                                <View style={styles.radioCircle}>
                                    {formData.hasRegistered === 'ya' && <View style={styles.radioCircleInner} />}
                                </View>
                                <Text style={[styles.radioLabel, formData.hasRegistered === 'ya' && styles.radioLabelActive]}>
                                    Ya, pernah
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.radioButton, formData.hasRegistered === 'tidak' && styles.radioButtonActive]}
                                onPress={() => setFormData({ ...formData, hasRegistered: 'tidak', registrationNumber: '' })}
                            >
                                <View style={styles.radioCircle}>
                                    {formData.hasRegistered === 'tidak' && <View style={styles.radioCircleInner} />}
                                </View>
                                <Text style={[styles.radioLabel, formData.hasRegistered === 'tidak' && styles.radioLabelActive]}>
                                    Belum pernah
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {formData.hasRegistered === 'ya' && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Nomor Pendaftaran Sebelumnya</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="document-outline" size={20} color="rgba(255,255,255,0.5)" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nomor registrasi merek"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    value={formData.registrationNumber}
                                    onChangeText={(text) => setFormData({ ...formData, registrationNumber: text })}
                                />
                            </View>
                        </View>
                    )}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Sudah Melakukan Penelusuran Merek Serupa?</Text>
                        <View style={styles.radioGroup}>
                            <TouchableOpacity
                                style={[styles.radioButton, formData.similarCheck === 'sudah' && styles.radioButtonActive]}
                                onPress={() => setFormData({ ...formData, similarCheck: 'sudah' })}
                            >
                                <View style={styles.radioCircle}>
                                    {formData.similarCheck === 'sudah' && <View style={styles.radioCircleInner} />}
                                </View>
                                <Text style={[styles.radioLabel, formData.similarCheck === 'sudah' && styles.radioLabelActive]}>
                                    Sudah, tidak ada yang sama
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.radioButton, formData.similarCheck === 'belum' && styles.radioButtonActive]}
                                onPress={() => setFormData({ ...formData, similarCheck: 'belum' })}
                            >
                                <View style={styles.radioCircle}>
                                    {formData.similarCheck === 'belum' && <View style={styles.radioCircleInner} />}
                                </View>
                                <Text style={[styles.radioLabel, formData.similarCheck === 'belum' && styles.radioLabelActive]}>
                                    Belum, butuh bantuan
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.hint}>Kami akan membantu penelusuran jika belum dilakukan</Text>
                    </View>
                </View>

                {/* Kontak */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informasi Kontak</Text>

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

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
                    <LinearGradient colors={['#f093fb', '#f5576c']} style={styles.submitButtonGradient}>
                        <Ionicons name="send" size={20} color="#fff" />
                        <Text style={styles.submitButtonText}>
                            {isSubmitting ? 'Mengirim...' : 'Ajukan Pendaftaran Merek'}
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
    infoBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(240, 147, 251, 0.15)', borderRadius: 12, padding: 16, marginBottom: 24, gap: 12, borderWidth: 1, borderColor: 'rgba(240, 147, 251, 0.3)' },
    infoBannerText: { flex: 1, color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 18 },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 16 },
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
    radioButtonActive: { backgroundColor: 'rgba(240, 147, 251, 0.15)', borderColor: '#f093fb' },
    radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)', justifyContent: 'center', alignItems: 'center' },
    radioCircleInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#f093fb' },
    radioLabel: { flex: 1, color: 'rgba(255,255,255,0.7)', fontSize: 14 },
    radioLabelActive: { color: '#fff', fontWeight: '600' },
    submitButton: { borderRadius: 12, overflow: 'hidden', marginTop: 8 },
    submitButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
    submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    dropdown: { 
        backgroundColor: 'rgba(30, 30, 50, 0.95)', 
        borderRadius: 12, 
        marginTop: 8, 
        maxHeight: 200,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    dropdownItemText: {
        color: '#fff',
        fontSize: 14,
    },
    // Styles untuk upload gambar
    imageUploadContainer: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    uploadButtonsContainer: {
        gap: 12,
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(240, 147, 251, 0.1)',
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(240, 147, 251, 0.3)',
        gap: 12,
    },
    uploadButtonText: {
        color: '#f093fb',
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    uploadButtonSubtext: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 12,
    },
    imagePreviewContainer: {
        alignItems: 'center',
        gap: 12,
    },
    imagePreview: {
        width: 150,
        height: 150,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'rgba(240, 147, 251, 0.5)',
    },
    removeImageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        gap: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 107, 107, 0.3)',
    },
    removeImageText: {
        color: '#ff6b6b',
        fontSize: 14,
        fontWeight: '600',
    },
});