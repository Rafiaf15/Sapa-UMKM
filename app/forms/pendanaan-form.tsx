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

export default function PendanaanForm() {
    const [formData, setFormData] = useState({
        businessName: '',
        ownerName: '',
        businessAge: '',
        monthlyRevenue: '',
        loanAmount: '',
        loanPurpose: '',
        hasCollateral: 'tidak',
        collateralDesc: '',
        phone: '',
        email: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formatCurrency = (value: string) => {
        const number = value.replace(/[^0-9]/g, '');
        return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const handleSubmit = async () => {
        if (!formData.businessName || !formData.ownerName || !formData.loanAmount ||
            !formData.loanPurpose || !formData.phone || !formData.email) {
            Alert.alert('Error', 'Mohon lengkapi semua field yang wajib diisi');
            return;
        }

        const loanAmountNum = parseInt(formData.loanAmount.replace(/\./g, ''));
        if (loanAmountNum < 1000000) {
            Alert.alert('Error', 'Jumlah pinjaman minimal Rp 1.000.000');
            return;
        }

        setIsSubmitting(true);

        try {
            const submission = {
                ...formData,
                id: Date.now().toString(),
                type: 'pendanaan',
                status: 'pending',
                submittedAt: new Date().toISOString(),
            };

            const existingSubmissions = await AsyncStorage.getItem('pendanaanSubmissions');
            const submissions = existingSubmissions ? JSON.parse(existingSubmissions) : [];
            submissions.push(submission);
            await AsyncStorage.setItem('pendanaanSubmissions', JSON.stringify(submissions));

            Alert.alert(
                'Permohonan Diterima! 💼',
                `Nomor Registrasi: ${submission.id}\n\nTim kami akan menghubungi Anda dalam 2-5 hari kerja untuk proses verifikasi dan penilaian kelayakan.`,
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
                    <Text style={styles.headerIcon}>💼</Text>
                    <Text style={styles.headerTitle}>Pendanaan UMKM</Text>
                    <Text style={styles.headerSubtitle}>
                        Akses modal usaha dari berbagai program pembiayaan
                    </Text>
                </View>
            </LinearGradient>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.infoBanner}>
                    <Ionicons name="information-circle" size={24} color="#f093fb" />
                    <Text style={styles.infoBannerText}>
                        Bunga kompetitif mulai dari 0,5% per bulan. Tenor hingga 3 tahun.
                    </Text>
                </View>

                {/* Informasi Usaha */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informasi Usaha</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nama Usaha <Text style={styles.required}>*</Text></Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="business-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <TextInput
                                style={styles.input}
                                placeholder="Nama usaha Anda"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.businessName}
                                onChangeText={(text) => setFormData({ ...formData, businessName: text })}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nama Pemilik <Text style={styles.required}>*</Text></Text>
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
                        <Text style={styles.label}>Lama Usaha Berjalan (tahun)</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="time-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <TextInput
                                style={styles.input}
                                placeholder="Contoh: 2"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.businessAge}
                                onChangeText={(text) => setFormData({ ...formData, businessAge: text.replace(/[^0-9]/g, '') })}
                                keyboardType="number-pad"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Omzet Per Bulan (Rp)</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="trending-up-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <Text style={styles.currencyPrefix}>Rp</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.monthlyRevenue}
                                onChangeText={(text) => setFormData({ ...formData, monthlyRevenue: formatCurrency(text) })}
                                keyboardType="number-pad"
                            />
                        </View>
                    </View>
                </View>

                {/* Pengajuan Pinjaman */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Pengajuan Pinjaman</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Jumlah Pinjaman (Rp) <Text style={styles.required}>*</Text></Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="cash-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <Text style={styles.currencyPrefix}>Rp</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Min. 1.000.000"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.loanAmount}
                                onChangeText={(text) => setFormData({ ...formData, loanAmount: formatCurrency(text) })}
                                keyboardType="number-pad"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tujuan Pinjaman <Text style={styles.required}>*</Text></Text>
                        <View style={[styles.inputContainer, styles.textAreaContainer]}>
                            <Ionicons name="document-text-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.textAreaIcon} />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Jelaskan untuk apa dana akan digunakan"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.loanPurpose}
                                onChangeText={(text) => setFormData({ ...formData, loanPurpose: text })}
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Memiliki Jaminan?</Text>
                        <View style={styles.radioGroup}>
                            <TouchableOpacity
                                style={[styles.radioButton, formData.hasCollateral === 'ya' && styles.radioButtonActive]}
                                onPress={() => setFormData({ ...formData, hasCollateral: 'ya' })}
                            >
                                <View style={styles.radioCircle}>
                                    {formData.hasCollateral === 'ya' && <View style={styles.radioCircleInner} />}
                                </View>
                                <Text style={[styles.radioLabel, formData.hasCollateral === 'ya' && styles.radioLabelActive]}>
                                    Ya, ada jaminan
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.radioButton, formData.hasCollateral === 'tidak' && styles.radioButtonActive]}
                                onPress={() => setFormData({ ...formData, hasCollateral: 'tidak', collateralDesc: '' })}
                            >
                                <View style={styles.radioCircle}>
                                    {formData.hasCollateral === 'tidak' && <View style={styles.radioCircleInner} />}
                                </View>
                                <Text style={[styles.radioLabel, formData.hasCollateral === 'tidak' && styles.radioLabelActive]}>
                                    Tidak ada jaminan
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {formData.hasCollateral === 'ya' && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Deskripsi Jaminan</Text>
                            <View style={[styles.inputContainer, styles.textAreaContainer]}>
                                <Ionicons name="home-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.textAreaIcon} />
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Contoh: Sertifikat tanah, BPKB kendaraan, dll"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    value={formData.collateralDesc}
                                    onChangeText={(text) => setFormData({ ...formData, collateralDesc: text })}
                                    multiline
                                    numberOfLines={2}
                                />
                            </View>
                        </View>
                    )}
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
                            {isSubmitting ? 'Mengirim...' : 'Ajukan Pinjaman'}
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
    currencyPrefix: { color: 'rgba(255,255,255,0.5)', fontSize: 15, fontWeight: '600' },
    textAreaContainer: { alignItems: 'flex-start', paddingVertical: 12 },
    textAreaIcon: { marginTop: 4 },
    textArea: { minHeight: 80, textAlignVertical: 'top' },
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
});