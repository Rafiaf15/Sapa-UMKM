import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput,
    TouchableOpacity, Alert, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UMiForm() {
    const [formData, setFormData] = useState({
        businessName: '',
        businessType: '',
        businessAddress: '',
        businessDuration: '',
        monthlyRevenue: '',
        loanAmount: '',
        loanPurpose: '',
        phone: '',
        email: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const businessTypes = [
        'Warung/Kedai',
        'Jasa (Laundry, Servis, dll)',
        'Kerajinan Tangan',
        'Pertanian Rakyat',
        'Perikanan Rakyat',
        'Peternakan Rakyat',
        'Lainnya',
    ];

    const handleSubmit = async () => {
        if (!formData.businessName || !formData.businessType || !formData.businessAddress ||
            !formData.businessDuration || !formData.monthlyRevenue || !formData.loanAmount ||
            !formData.loanPurpose || !formData.phone || !formData.email) {
            Alert.alert('Error', 'Mohon lengkapi semua field yang wajib diisi');
            return;
        }

        setIsSubmitting(true);

        try {
            const submission = {
                ...formData,
                id: Date.now().toString(),
                type: 'umi',
                status: 'pending',
                submittedAt: new Date().toISOString(),
            };

            const existingSubmissions = await AsyncStorage.getItem('umiSubmissions');
            const submissions = existingSubmissions ? JSON.parse(existingSubmissions) : [];
            submissions.push(submission);
            await AsyncStorage.setItem('umiSubmissions', JSON.stringify(submissions));

            Alert.alert(
                'Pendaftaran UMi Diterima! 🌟',
                `Nomor Registrasi: ${submission.id}\n\nTim kami akan menghubungi Anda dalam 1-3 hari kerja untuk proses verifikasi dan penjelasan lebih lanjut.`,
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (error) {
            Alert.alert('Error', 'Gagal mengirim pendaftaran. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(131, 58, 180, 0.2)', 'rgba(253, 29, 29, 0.2)']}
                style={styles.header}
            >
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerIcon}>🌟</Text>
                    <Text style={styles.headerTitle}>Pembiayaan Ultra Mikro (UMi)</Text>
                    <Text style={styles.headerSubtitle}>
                        Bantuan pembiayaan untuk usaha ultra mikro dengan proses cepat dan mudah
                    </Text>
                </View>
            </LinearGradient>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.infoBanner}>
                    <Ionicons name="information-circle" size={24} color="#833ab4" />
                    <Text style={styles.infoBannerText}>
                        UMi khusus untuk usaha ultra mikro dengan plafon hingga Rp 10 juta
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

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Alamat Usaha <Text style={styles.required}>*</Text></Text>
                        <View style={[styles.inputContainer, styles.textAreaContainer]}>
                            <Ionicons name="location-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.textAreaIcon} />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Alamat lengkap usaha"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.businessAddress}
                                onChangeText={(text) => setFormData({ ...formData, businessAddress: text })}
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Lama Usaha (Bulan) <Text style={styles.required}>*</Text></Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="calendar-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <TextInput
                                style={styles.input}
                                placeholder="Contoh: 6 bulan"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.businessDuration}
                                onChangeText={(text) => setFormData({ ...formData, businessDuration: text })}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Omset Usaha (Rp/Bulan) <Text style={styles.required}>*</Text></Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="cash-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <Text style={styles.currencyPrefix}>Rp</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.monthlyRevenue}
                                onChangeText={(text) => setFormData({ ...formData, monthlyRevenue: text.replace(/[^0-9]/g, '') })}
                                keyboardType="number-pad"
                            />
                        </View>
                    </View>
                </View>

                {/* Informasi Pembiayaan */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informasi Pembiayaan</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Jumlah Pembiayaan (Rp) <Text style={styles.required}>*</Text></Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="card-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <Text style={styles.currencyPrefix}>Rp</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.loanAmount}
                                onChangeText={(text) => setFormData({ ...formData, loanAmount: text.replace(/[^0-9]/g, '') })}
                                keyboardType="number-pad"
                            />
                        </View>
                        <Text style={styles.hint}>Plafon UMi: Rp 1 juta - Rp 10 juta</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tujuan Penggunaan Pembiayaan <Text style={styles.required}>*</Text></Text>
                        <View style={[styles.inputContainer, styles.textAreaContainer]}>
                            <Ionicons name="document-text-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.textAreaIcon} />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Jelaskan untuk apa pembiayaan akan digunakan"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.loanPurpose}
                                onChangeText={(text) => setFormData({ ...formData, loanPurpose: text })}
                                multiline
                                numberOfLines={3}
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
                    <LinearGradient colors={['#833ab4', '#fd1d1d']} style={styles.submitButtonGradient}>
                        <Ionicons name="send" size={20} color="#fff" />
                        <Text style={styles.submitButtonText}>
                            {isSubmitting ? 'Mengirim...' : 'Ajukan UMi'}
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
    infoBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(131, 58, 180, 0.15)', borderRadius: 12, padding: 16, marginBottom: 24, gap: 12, borderWidth: 1, borderColor: 'rgba(131, 58, 180, 0.3)' },
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
    radioGroup: { gap: 12 },
    radioButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', gap: 12 },
    radioButtonActive: { backgroundColor: 'rgba(131, 58, 180, 0.15)', borderColor: '#833ab4' },
    radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)', justifyContent: 'center', alignItems: 'center' },
    radioCircleInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#833ab4' },
    radioLabel: { flex: 1, color: 'rgba(255,255,255,0.7)', fontSize: 14 },
    radioLabelActive: { color: '#fff', fontWeight: '600' },
    submitButton: { borderRadius: 12, overflow: 'hidden', marginTop: 8 },
    submitButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
    submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});