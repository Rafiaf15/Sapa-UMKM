import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput,
    TouchableOpacity, Alert, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PelaporanForm() {
    const [formData, setFormData] = useState({
        businessName: '',
        period: '',
        revenue: '',
        employeeCount: '',
        newProducts: '',
        achievements: '',
        challenges: '',
        futurePlans: '',
        assistanceNeeded: '',
        phone: '',
        email: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const reportingPeriods = [
        'Triwulan I (Januari - Maret)',
        'Triwulan II (April - Juni)',
        'Triwulan III (Juli - September)',
        'Triwulan IV (Oktober - Desember)',
        'Laporan Tahunan',
        'Laporan Khusus',
    ];

    const handleSubmit = async () => {
        if (!formData.businessName || !formData.period || !formData.revenue ||
            !formData.employeeCount || !formData.achievements || !formData.challenges ||
            !formData.futurePlans || !formData.phone || !formData.email) {
            Alert.alert('Error', 'Mohon lengkapi semua field yang wajib diisi');
            return;
        }

        setIsSubmitting(true);

        try {
            const submission = {
                ...formData,
                id: Date.now().toString(),
                type: 'pelaporan',
                status: 'pending',
                submittedAt: new Date().toISOString(),
            };

            const existingSubmissions = await AsyncStorage.getItem('pelaporanSubmissions');
            const submissions = existingSubmissions ? JSON.parse(existingSubmissions) : [];
            submissions.push(submission);
            await AsyncStorage.setItem('pelaporanSubmissions', JSON.stringify(submissions));

            Alert.alert(
                'Laporan Diterima! 📊',
                `Nomor Laporan: ${submission.id}\n\nLaporan perkembangan usaha Anda telah diterima dan akan menjadi data penting untuk program pembinaan UMKM.`,
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (error) {
            Alert.alert('Error', 'Gagal mengirim laporan. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(108, 92, 231, 0.2)', 'rgba(146, 100, 228, 0.2)']}
                style={styles.header}
            >
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerIcon}>📊</Text>
                    <Text style={styles.headerTitle}>Pelaporan Perkembangan Usaha</Text>
                    <Text style={styles.headerSubtitle}>
                        Laporkan perkembangan usaha Anda untuk data pembinaan UMKM
                    </Text>
                </View>
            </LinearGradient>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.infoBanner}>
                    <Ionicons name="information-circle" size={24} color="#6c5ce7" />
                    <Text style={styles.infoBannerText}>
                        Data laporan Anda membantu pemerintah dalam menyusun program pembinaan UMKM yang tepat sasaran
                    </Text>
                </View>

                {/* Informasi Dasar */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informasi Dasar</Text>

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
                        <Text style={styles.label}>Periode Pelaporan <Text style={styles.required}>*</Text></Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="calendar-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <TextInput
                                style={styles.input}
                                placeholder="Pilih periode pelaporan"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.period}
                                onChangeText={(text) => setFormData({ ...formData, period: text })}
                            />
                        </View>
                        <Text style={styles.hint}>
                            Contoh: {reportingPeriods[0]}
                        </Text>
                    </View>
                </View>

                {/* Data Kinerja */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Data Kinerja</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Omset (Rp) <Text style={styles.required}>*</Text></Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="cash-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <Text style={styles.currencyPrefix}>Rp</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.revenue}
                                onChangeText={(text) => setFormData({ ...formData, revenue: text.replace(/[^0-9]/g, '') })}
                                keyboardType="number-pad"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Jumlah Karyawan <Text style={styles.required}>*</Text></Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="people-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.employeeCount}
                                onChangeText={(text) => setFormData({ ...formData, employeeCount: text.replace(/[^0-9]/g, '') })}
                                keyboardType="number-pad"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Produk/Jasa Baru</Text>
                        <View style={[styles.inputContainer, styles.textAreaContainer]}>
                            <Ionicons name="cube-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.textAreaIcon} />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Jelaskan produk/jasa baru yang diluncurkan"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.newProducts}
                                onChangeText={(text) => setFormData({ ...formData, newProducts: text })}
                                multiline
                                numberOfLines={2}
                            />
                        </View>
                    </View>
                </View>

                {/* Capaian & Tantangan */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Capaian & Tantangan</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Pencapaian Utama <Text style={styles.required}>*</Text></Text>
                        <View style={[styles.inputContainer, styles.textAreaContainer]}>
                            <Ionicons name="trophy-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.textAreaIcon} />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Jelaskan pencapaian penting dalam periode ini"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.achievements}
                                onChangeText={(text) => setFormData({ ...formData, achievements: text })}
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tantangan yang Dihadapi <Text style={styles.required}>*</Text></Text>
                        <View style={[styles.inputContainer, styles.textAreaContainer]}>
                            <Ionicons name="warning-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.textAreaIcon} />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Jelaskan tantangan utama yang dihadapi"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.challenges}
                                onChangeText={(text) => setFormData({ ...formData, challenges: text })}
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                    </View>
                </View>

                {/* Rencana & Kebutuhan */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Rencana & Kebutuhan</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Rencana Pengembangan <Text style={styles.required}>*</Text></Text>
                        <View style={[styles.inputContainer, styles.textAreaContainer]}>
                            <Ionicons name="bulb-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.textAreaIcon} />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Jelaskan rencana pengembangan usaha ke depan"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.futurePlans}
                                onChangeText={(text) => setFormData({ ...formData, futurePlans: text })}
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Bantuan yang Dibutuhkan</Text>
                        <View style={[styles.inputContainer, styles.textAreaContainer]}>
                            <Ionicons name="help-circle-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.textAreaIcon} />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Jenis bantuan/pendampingan yang dibutuhkan"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.assistanceNeeded}
                                onChangeText={(text) => setFormData({ ...formData, assistanceNeeded: text })}
                                multiline
                                numberOfLines={2}
                            />
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
                    <LinearGradient colors={['#6c5ce7', '#9264e4']} style={styles.submitButtonGradient}>
                        <Ionicons name="send" size={20} color="#fff" />
                        <Text style={styles.submitButtonText}>
                            {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
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
    infoBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(108, 92, 231, 0.15)', borderRadius: 12, padding: 16, marginBottom: 24, gap: 12, borderWidth: 1, borderColor: 'rgba(108, 92, 231, 0.3)' },
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
    hint: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
    submitButton: { borderRadius: 12, overflow: 'hidden', marginTop: 8 },
    submitButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
    submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});