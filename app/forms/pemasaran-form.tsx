import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput,
    TouchableOpacity, Alert, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PemasaranForm() {
    const [formData, setFormData] = useState({
        businessName: '',
        productCategory: '',
        targetMarket: '',
        currentMarketing: '',
        budget: '',
        goals: '',
        hasWebsite: 'tidak',
        websiteUrl: '',
        hasSocialMedia: 'tidak',
        socialMediaAccounts: '',
        phone: '',
        email: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const marketingChannels = [
        'Media Sosial (Instagram, Facebook, TikTok)',
        'Marketplace (Tokopedia, Shopee, Bukalapak)',
        'Google My Business',
        'WhatsApp Business',
        'Website Sendiri',
        'Tidak Ada',
    ];

    const handleSubmit = async () => {
        if (!formData.businessName || !formData.productCategory ||
            !formData.goals || !formData.phone || !formData.email) {
            Alert.alert('Error', 'Mohon lengkapi semua field yang wajib diisi');
            return;
        }

        setIsSubmitting(true);

        try {
            const submission = {
                ...formData,
                id: Date.now().toString(),
                type: 'pemasaran',
                status: 'pending',
                submittedAt: new Date().toISOString(),
            };

            const existingSubmissions = await AsyncStorage.getItem('pemasaranSubmissions');
            const submissions = existingSubmissions ? JSON.parse(existingSubmissions) : [];
            submissions.push(submission);
            await AsyncStorage.setItem('pemasaranSubmissions', JSON.stringify(submissions));

            Alert.alert(
                'Permintaan Diterima! 🎯',
                `Nomor Registrasi: ${submission.id}\n\nTim digital marketing kami akan menghubungi Anda dalam 1-2 hari kerja untuk konsultasi strategi pemasaran.`,
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (error) {
            Alert.alert('Error', 'Gagal mengirim permintaan. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(67, 233, 123, 0.2)', 'rgba(56, 249, 215, 0.2)']}
                style={styles.header}
            >
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerIcon}>🏪</Text>
                    <Text style={styles.headerTitle}>Pemasaran Digital</Text>
                    <Text style={styles.headerSubtitle}>
                        Tingkatkan penjualan dengan strategi digital marketing
                    </Text>
                </View>
            </LinearGradient>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.infoBanner}>
                    <Ionicons name="information-circle" size={24} color="#43e97b" />
                    <Text style={styles.infoBannerText}>
                        Dapatkan konsultasi gratis dan strategi marketing yang tepat untuk bisnis Anda
                    </Text>
                </View>

                {/* Informasi Bisnis */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informasi Bisnis</Text>

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
                        <Text style={styles.label}>Kategori Produk/Jasa <Text style={styles.required}>*</Text></Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="pricetag-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <TextInput
                                style={styles.input}
                                placeholder="Contoh: Fashion, F&B, Kerajinan, dll"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.productCategory}
                                onChangeText={(text) => setFormData({ ...formData, productCategory: text })}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Target Pasar</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="people-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <TextInput
                                style={styles.input}
                                placeholder="Contoh: Remaja, Ibu Rumah Tangga, dll"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.targetMarket}
                                onChangeText={(text) => setFormData({ ...formData, targetMarket: text })}
                            />
                        </View>
                    </View>
                </View>

                {/* Status Marketing Saat Ini */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Marketing Saat Ini</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Channel Marketing yang Digunakan</Text>
                        <View style={[styles.inputContainer, styles.textAreaContainer]}>
                            <Ionicons name="megaphone-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.textAreaIcon} />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Pilih channel yang Anda gunakan saat ini"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.currentMarketing}
                                onChangeText={(text) => setFormData({ ...formData, currentMarketing: text })}
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                        <Text style={styles.hint}>
                            Contoh: {marketingChannels.slice(0, 2).join(', ')}
                        </Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Punya Website?</Text>
                        <View style={styles.radioGroup}>
                            <TouchableOpacity
                                style={[styles.radioButton, formData.hasWebsite === 'ya' && styles.radioButtonActive]}
                                onPress={() => setFormData({ ...formData, hasWebsite: 'ya' })}
                            >
                                <View style={styles.radioCircle}>
                                    {formData.hasWebsite === 'ya' && <View style={styles.radioCircleInner} />}
                                </View>
                                <Text style={[styles.radioLabel, formData.hasWebsite === 'ya' && styles.radioLabelActive]}>
                                    Ya, sudah ada
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.radioButton, formData.hasWebsite === 'tidak' && styles.radioButtonActive]}
                                onPress={() => setFormData({ ...formData, hasWebsite: 'tidak', websiteUrl: '' })}
                            >
                                <View style={styles.radioCircle}>
                                    {formData.hasWebsite === 'tidak' && <View style={styles.radioCircleInner} />}
                                </View>
                                <Text style={[styles.radioLabel, formData.hasWebsite === 'tidak' && styles.radioLabelActive]}>
                                    Belum ada
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {formData.hasWebsite === 'ya' && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>URL Website</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="globe-outline" size={20} color="rgba(255,255,255,0.5)" />
                                <TextInput
                                    style={styles.input}
                                    placeholder="https://website-anda.com"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    value={formData.websiteUrl}
                                    onChangeText={(text) => setFormData({ ...formData, websiteUrl: text })}
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>
                    )}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Punya Akun Media Sosial Bisnis?</Text>
                        <View style={styles.radioGroup}>
                            <TouchableOpacity
                                style={[styles.radioButton, formData.hasSocialMedia === 'ya' && styles.radioButtonActive]}
                                onPress={() => setFormData({ ...formData, hasSocialMedia: 'ya' })}
                            >
                                <View style={styles.radioCircle}>
                                    {formData.hasSocialMedia === 'ya' && <View style={styles.radioCircleInner} />}
                                </View>
                                <Text style={[styles.radioLabel, formData.hasSocialMedia === 'ya' && styles.radioLabelActive]}>
                                    Ya, sudah ada
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.radioButton, formData.hasSocialMedia === 'tidak' && styles.radioButtonActive]}
                                onPress={() => setFormData({ ...formData, hasSocialMedia: 'tidak', socialMediaAccounts: '' })}
                            >
                                <View style={styles.radioCircle}>
                                    {formData.hasSocialMedia === 'tidak' && <View style={styles.radioCircleInner} />}
                                </View>
                                <Text style={[styles.radioLabel, formData.hasSocialMedia === 'tidak' && styles.radioLabelActive]}>
                                    Belum ada
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {formData.hasSocialMedia === 'ya' && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Username/Link Akun</Text>
                            <View style={[styles.inputContainer, styles.textAreaContainer]}>
                                <Ionicons name="share-social-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.textAreaIcon} />
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Contoh: @tokoku_official, facebook.com/tokoku"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    value={formData.socialMediaAccounts}
                                    onChangeText={(text) => setFormData({ ...formData, socialMediaAccounts: text })}
                                    multiline
                                    numberOfLines={2}
                                />
                            </View>
                        </View>
                    )}
                </View>

                {/* Target Marketing */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Target Marketing</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Budget Marketing (Rp/bulan)</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="cash-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <Text style={styles.currencyPrefix}>Rp</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0 (opsional)"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.budget}
                                onChangeText={(text) => setFormData({ ...formData, budget: text.replace(/[^0-9]/g, '') })}
                                keyboardType="number-pad"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Tujuan Marketing <Text style={styles.required}>*</Text></Text>
                        <View style={[styles.inputContainer, styles.textAreaContainer]}>
                            <Ionicons name="flag-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.textAreaIcon} />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Contoh: Meningkatkan penjualan online, Brand awareness, dll"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.goals}
                                onChangeText={(text) => setFormData({ ...formData, goals: text })}
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
                    <LinearGradient colors={['#43e97b', '#38f9d7']} style={styles.submitButtonGradient}>
                        <Ionicons name="send" size={20} color="#fff" />
                        <Text style={styles.submitButtonText}>
                            {isSubmitting ? 'Mengirim...' : 'Minta Konsultasi'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

// Styles sama seperti form perizinan dan pendanaan
const styles = StyleSheet.create({
    // Copy semua styles dari perizinan-form.tsx
    // Ganti warna accent sesuai dengan layanan (gunakan #43e97b untuk pemasaran)
    container: { flex: 1, backgroundColor: '#0a0e27' },
    header: { paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 24, paddingHorizontal: 20 },
    backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    headerContent: { alignItems: 'center' },
    headerIcon: { fontSize: 48, marginBottom: 12 },
    headerTitle: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 8 },
    headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
    scrollView: { flex: 1 },
    content: { padding: 20 },
    infoBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(67, 233, 123, 0.15)', borderRadius: 12, padding: 16, marginBottom: 24, gap: 12, borderWidth: 1, borderColor: 'rgba(67, 233, 123, 0.3)' },
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
    radioButtonActive: { backgroundColor: 'rgba(67, 233, 123, 0.15)', borderColor: '#43e97b' },
    radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)', justifyContent: 'center', alignItems: 'center' },
    radioCircleInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#43e97b' },
    radioLabel: { flex: 1, color: 'rgba(255,255,255,0.7)', fontSize: 14 },
    radioLabelActive: { color: '#fff', fontWeight: '600' },
    submitButton: { borderRadius: 12, overflow: 'hidden', marginTop: 8 },
    submitButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
    submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});