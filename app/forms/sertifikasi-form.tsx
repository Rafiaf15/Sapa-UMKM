import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput,
    TouchableOpacity, Alert, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SertifikasiForm() {
    const [formData, setFormData] = useState({
        businessName: '',
        businessType: '',
        productName: '',
        productCategory: '',
        certificationType: '',
        productionProcess: '',
        ingredients: '',
        hasCertification: 'tidak',
        previousCertification: '',
        facilityDescription: '',
        productionScale: '',
        phone: '',
        email: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCertificationDropdown, setShowCertificationDropdown] = useState(false);

    const certificationTypes = [
        'Sertifikasi Halal',
        'SNI (Standar Nasional Indonesia)',
        'ISO 9001:2015 - Quality Management',
        'ISO 22000 - Food Safety Management',
        'BPOM (Badan Pengawas Obat dan Makanan)',
        'Sertifikasi Organic',
        'Sertifikasi HACCP',
        'Sertifikasi GMP (Good Manufacturing Practice)',
    ];

    const businessTypes = [
        'UMKM Makanan & Minuman',
        'UMKM Fashion',
        'UMKM Kerajinan',
        'UMKM Kosmetik',
        'UMKM Pertanian',
        'UMKM Perikanan',
        'UMKM Jasa',
        'Lainnya',
    ];

    const handleSubmit = async () => {
        if (!formData.businessName || !formData.businessType || !formData.productName ||
            !formData.productCategory || !formData.certificationType || !formData.productionProcess ||
            !formData.ingredients || !formData.phone || !formData.email) {
            Alert.alert('Error', 'Mohon lengkapi semua field yang wajib diisi');
            return;
        }

        setIsSubmitting(true);

        try {
            const submission = {
                ...formData,
                id: Date.now().toString(),
                type: 'sertifikasi',
                status: 'pending',
                submittedAt: new Date().toISOString(),
            };

            const existingSubmissions = await AsyncStorage.getItem('sertifikasiSubmissions');
            const submissions = existingSubmissions ? JSON.parse(existingSubmissions) : [];
            submissions.push(submission);
            await AsyncStorage.setItem('sertifikasiSubmissions', JSON.stringify(submissions));

            Alert.alert(
                'Pengajuan Diterima! 📜',
                `Nomor Registrasi: ${submission.id}\n\nPengajuan sertifikasi Anda telah diterima. Tim kami akan menghubungi Anda dalam 1-3 hari kerja untuk proses selanjutnya.`,
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (error) {
            Alert.alert('Error', 'Gagal mengirim pengajuan. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(74, 144, 226, 0.2)', 'rgba(58, 123, 213, 0.2)']}
                style={styles.header}
            >
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerIcon}>📜</Text>
                    <Text style={styles.headerTitle}>Pengajuan Sertifikasi</Text>
                    <Text style={styles.headerSubtitle}>
                        Dapatkan sertifikasi Halal, SNI, dan standar lainnya untuk produk Anda
                    </Text>
                </View>
            </LinearGradient>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.infoBanner}>
                    <Ionicons name="information-circle" size={24} color="#4a90e2" />
                    <Text style={styles.infoBannerText}>
                        Sertifikasi meningkatkan kredibilitas produk dan membuka peluang pasar yang lebih luas
                    </Text>
                </View>

                {/* Informasi Perusahaan */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informasi Perusahaan</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nama Usaha/Perusahaan <Text style={styles.required}>*</Text></Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="business-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <TextInput
                                style={styles.input}
                                placeholder="Nama lengkap usaha/perusahaan"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.businessName}
                                onChangeText={(text) => setFormData({ ...formData, businessName: text })}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Jenis Usaha <Text style={styles.required}>*</Text></Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="cube-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <TextInput
                                style={styles.input}
                                placeholder="Pilih jenis usaha"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.businessType}
                                onChangeText={(text) => setFormData({ ...formData, businessType: text })}
                            />
                        </View>
                        <Text style={styles.hint}>
                            Contoh: {businessTypes.slice(0, 3).join(', ')}
                        </Text>
                    </View>
                </View>

                {/* Informasi Produk */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informasi Produk</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nama Produk <Text style={styles.required}>*</Text></Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="pricetag-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <TextInput
                                style={styles.input}
                                placeholder="Nama produk yang akan disertifikasi"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.productName}
                                onChangeText={(text) => setFormData({ ...formData, productName: text })}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Kategori Produk <Text style={styles.required}>*</Text></Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="list-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <TextInput
                                style={styles.input}
                                placeholder="Contoh: Makanan, Minuman, Kosmetik, dll"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.productCategory}
                                onChangeText={(text) => setFormData({ ...formData, productCategory: text })}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Jenis Sertifikasi <Text style={styles.required}>*</Text></Text>
                        <TouchableOpacity
                            style={styles.inputContainer}
                            onPress={() => setShowCertificationDropdown(!showCertificationDropdown)}
                        >
                            <Ionicons name="document-text-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <Text style={[styles.input, { paddingVertical: 14, color: formData.certificationType ? '#fff' : 'rgba(255,255,255,0.4)' }]}>
                                {formData.certificationType || 'Pilih jenis sertifikasi'}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="rgba(255,255,255,0.5)" />
                        </TouchableOpacity>
                        {showCertificationDropdown && (
                            <ScrollView style={styles.dropdown} nestedScrollEnabled>
                                {certificationTypes.map((type, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setFormData({ ...formData, certificationType: type });
                                            setShowCertificationDropdown(false);
                                        }}
                                    >
                                        <Text style={styles.dropdownItemText}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Proses Produksi <Text style={styles.required}>*</Text></Text>
                        <View style={[styles.inputContainer, styles.textAreaContainer]}>
                            <Ionicons name="build-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.textAreaIcon} />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Jelaskan proses produksi produk Anda"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.productionProcess}
                                onChangeText={(text) => setFormData({ ...formData, productionProcess: text })}
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Bahan Baku/Komposisi <Text style={styles.required}>*</Text></Text>
                        <View style={[styles.inputContainer, styles.textAreaContainer]}>
                            <Ionicons name="flask-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.textAreaIcon} />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Daftar semua bahan baku/komposisi produk"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.ingredients}
                                onChangeText={(text) => setFormData({ ...formData, ingredients: text })}
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                    </View>
                </View>

                {/* Status Sertifikasi */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Status Sertifikasi</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Sudah Memiliki Sertifikasi Sebelumnya?</Text>
                        <View style={styles.radioGroup}>
                            <TouchableOpacity
                                style={[styles.radioButton, formData.hasCertification === 'ya' && styles.radioButtonActive]}
                                onPress={() => setFormData({ ...formData, hasCertification: 'ya' })}
                            >
                                <View style={styles.radioCircle}>
                                    {formData.hasCertification === 'ya' && <View style={styles.radioCircleInner} />}
                                </View>
                                <Text style={[styles.radioLabel, formData.hasCertification === 'ya' && styles.radioLabelActive]}>
                                    Ya, sudah ada
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.radioButton, formData.hasCertification === 'tidak' && styles.radioButtonActive]}
                                onPress={() => setFormData({ ...formData, hasCertification: 'tidak', previousCertification: '' })}
                            >
                                <View style={styles.radioCircle}>
                                    {formData.hasCertification === 'tidak' && <View style={styles.radioCircleInner} />}
                                </View>
                                <Text style={[styles.radioLabel, formData.hasCertification === 'tidak' && styles.radioLabelActive]}>
                                    Belum ada
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {formData.hasCertification === 'ya' && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Sertifikasi yang Dimiliki</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="ribbon-outline" size={20} color="rgba(255,255,255,0.5)" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Jenis sertifikasi yang sudah dimiliki"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    value={formData.previousCertification}
                                    onChangeText={(text) => setFormData({ ...formData, previousCertification: text })}
                                />
                            </View>
                        </View>
                    )}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Fasilitas Produksi</Text>
                        <View style={[styles.inputContainer, styles.textAreaContainer]}>
                            <Ionicons name="business-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.textAreaIcon} />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Deskripsi fasilitas dan peralatan produksi"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.facilityDescription}
                                onChangeText={(text) => setFormData({ ...formData, facilityDescription: text })}
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Skala Produksi</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="stats-chart-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <TextInput
                                style={styles.input}
                                placeholder="Contoh: 1000 unit/bulan, 500 kg/bulan"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.productionScale}
                                onChangeText={(text) => setFormData({ ...formData, productionScale: text })}
                            />
                        </View>
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
                    <LinearGradient colors={['#4a90e2', '#3a7bd5']} style={styles.submitButtonGradient}>
                        <Ionicons name="send" size={20} color="#fff" />
                        <Text style={styles.submitButtonText}>
                            {isSubmitting ? 'Mengirim...' : 'Ajukan Sertifikasi'}
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
    infoBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(74, 144, 226, 0.15)', borderRadius: 12, padding: 16, marginBottom: 24, gap: 12, borderWidth: 1, borderColor: 'rgba(74, 144, 226, 0.3)' },
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
    radioButtonActive: { backgroundColor: 'rgba(74, 144, 226, 0.15)', borderColor: '#4a90e2' },
    radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)', justifyContent: 'center', alignItems: 'center' },
    radioCircleInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4a90e2' },
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
});