import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput,
    TouchableOpacity, Alert, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const jenisPelatihan = [
    { value: 'teknis_produksi', label: 'Teknis Produksi & Kualitas' },
    { value: 'manajemen_usaha', label: 'Manajemen Usaha' },
    { value: 'keuangan_akuntansi', label: 'Keuangan & Akuntansi' },
    { value: 'pemasaran_digital', label: 'Pemasaran Digital' },
    { value: 'export_import', label: 'Export & Import' },
    { value: 'teknologi_digitalisasi', label: 'Teknologi & Digitalisasi' },
    { value: 'legalitas_perizinan', label: 'Legalitas & Perizinan' },
    { value: 'kepemimpinan', label: 'Kepemimpinan & SDM' }
];

const tingkatKemampuan = [
    { value: 'pemula', label: 'Pemula - Baru memulai' },
    { value: 'menengah', label: 'Menengah - Sudah berjalan 1-3 tahun' },
    { value: 'lanjut', label: 'Lanjut - Sudah berkembang >3 tahun' }
];

const formatPelatihan = [
    'Online (Webinar/Video)',
    'Offline (Tatap Muka)',
    'Hybrid (Online + Offline)',
    'Workshop Praktik',
    'Coaching/Mentoring'
];

export default function PelatihanForm() {
    const [formData, setFormData] = useState({
        businessName: '',
        ownerName: '',
        productCategory: '',
        businessAge: '',
        currentLevel: 'pemula',
        trainingType: '',
        specificNeeds: '',
        previousTraining: 'tidak',
        previousTrainingDesc: '',
        preferredFormats: [] as string[],
        availableTime: '',
        budgetAvailable: 'tidak',
        budgetAmount: '',
        phone: '',
        email: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showTrainingDropdown, setShowTrainingDropdown] = useState(false);

    const toggleFormat = (format: string) => {
        const currentFormats = [...formData.preferredFormats];
        const index = currentFormats.indexOf(format);
        
        if (index > -1) {
            currentFormats.splice(index, 1);
        } else {
            currentFormats.push(format);
        }
        
        setFormData({ ...formData, preferredFormats: currentFormats });
    };

    const formatCurrency = (value: string) => {
        const number = value.replace(/[^0-9]/g, '');
        return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const handleSubmit = async () => {
        if (!formData.businessName || !formData.ownerName || !formData.productCategory ||
            !formData.trainingType || !formData.specificNeeds ||
            formData.preferredFormats.length === 0 ||
            !formData.phone || !formData.email) {
            Alert.alert('Error', 'Mohon lengkapi semua field yang wajib diisi');
            return;
        }

        setIsSubmitting(true);

        try {
            const submission = {
                ...formData,
                id: Date.now().toString(),
                type: 'pelatihan',
                status: 'pending',
                submittedAt: new Date().toISOString(),
            };

            const existingSubmissions = await AsyncStorage.getItem('pelatihanSubmissions');
            const submissions = existingSubmissions ? JSON.parse(existingSubmissions) : [];
            submissions.push(submission);
            await AsyncStorage.setItem('pelatihanSubmissions', JSON.stringify(submissions));

            Alert.alert(
                'Pendaftaran Berhasil! 📚',
                `Nomor Registrasi: ${submission.id}\n\nTerima kasih telah mendaftar! Tim kami akan mengirimkan informasi jadwal pelatihan dan materi dalam 2-3 hari kerja.`,
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
                colors={['rgba(56, 189, 248, 0.2)', 'rgba(99, 102, 241, 0.2)']}
                style={styles.header}
            >
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerIcon}>📚</Text>
                    <Text style={styles.headerTitle}>Peningkatan Kompetensi</Text>
                    <Text style={styles.headerSubtitle}>
                        Akses pelatihan teknis dan manajemen dari KemenKopUKM
                    </Text>
                </View>
            </LinearGradient>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.infoBanner}>
                    <Ionicons name="information-circle" size={24} color="#38bdf8" />
                    <Text style={styles.infoBannerText}>
                        Program pelatihan gratis dan berbayar tersedia. Sertifikat resmi dari KemenKopUKM.
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
                        <Text style={styles.label}>Nama Peserta <Text style={styles.required}>*</Text></Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <TextInput
                                style={styles.input}
                                placeholder="Nama lengkap yang akan mengikuti pelatihan"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.ownerName}
                                onChangeText={(text) => setFormData({ ...formData, ownerName: text })}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Kategori Usaha <Text style={styles.required}>*</Text></Text>
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
                        <Text style={styles.label}>Tingkat Kemampuan Saat Ini <Text style={styles.required}>*</Text></Text>
                        <View style={styles.radioGroup}>
                            {tingkatKemampuan.map((tingkat) => (
                                <TouchableOpacity
                                    key={tingkat.value}
                                    style={[
                                        styles.radioButton,
                                        formData.currentLevel === tingkat.value && styles.radioButtonActive,
                                    ]}
                                    onPress={() => setFormData({ ...formData, currentLevel: tingkat.value })}
                                >
                                    <View style={styles.radioCircle}>
                                        {formData.currentLevel === tingkat.value && <View style={styles.radioCircleInner} />}
                                    </View>
                                    <Text style={[
                                        styles.radioLabel,
                                        formData.currentLevel === tingkat.value && styles.radioLabelActive,
                                    ]}>
                                        {tingkat.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Kebutuhan Pelatihan */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Kebutuhan Pelatihan</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Jenis Pelatihan yang Dibutuhkan <Text style={styles.required}>*</Text></Text>
                        <TouchableOpacity
                            style={styles.inputContainer}
                            onPress={() => setShowTrainingDropdown(!showTrainingDropdown)}
                        >
                            <Ionicons name="school-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <Text style={[styles.input, { paddingVertical: 14, color: formData.trainingType ? '#fff' : 'rgba(255,255,255,0.4)' }]}>
                                {formData.trainingType ? jenisPelatihan.find(j => j.value === formData.trainingType)?.label : 'Pilih jenis pelatihan'}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color="rgba(255,255,255,0.5)" />
                        </TouchableOpacity>
                        {showTrainingDropdown && (
                            <ScrollView style={styles.dropdown} nestedScrollEnabled>
                                {jenisPelatihan.map((jenis, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.dropdownItem}
                                        onPress={() => {
                                            setFormData({ ...formData, trainingType: jenis.value });
                                            setShowTrainingDropdown(false);
                                        }}
                                    >
                                        <Text style={styles.dropdownItemText}>{jenis.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Kebutuhan Spesifik <Text style={styles.required}>*</Text></Text>
                        <View style={[styles.inputContainer, styles.textAreaContainer]}>
                            <Ionicons name="list-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.textAreaIcon} />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Jelaskan topik atau skill spesifik yang ingin dipelajari"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.specificNeeds}
                                onChangeText={(text) => setFormData({ ...formData, specificNeeds: text })}
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Pernah Ikut Pelatihan Sebelumnya?</Text>
                        <View style={styles.radioGroup}>
                            <TouchableOpacity
                                style={[styles.radioButton, formData.previousTraining === 'ya' && styles.radioButtonActive]}
                                onPress={() => setFormData({ ...formData, previousTraining: 'ya' })}
                            >
                                <View style={styles.radioCircle}>
                                    {formData.previousTraining === 'ya' && <View style={styles.radioCircleInner} />}
                                </View>
                                <Text style={[styles.radioLabel, formData.previousTraining === 'ya' && styles.radioLabelActive]}>
                                    Ya, pernah
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.radioButton, formData.previousTraining === 'tidak' && styles.radioButtonActive]}
                                onPress={() => setFormData({ ...formData, previousTraining: 'tidak', previousTrainingDesc: '' })}
                            >
                                <View style={styles.radioCircle}>
                                    {formData.previousTraining === 'tidak' && <View style={styles.radioCircleInner} />}
                                </View>
                                <Text style={[styles.radioLabel, formData.previousTraining === 'tidak' && styles.radioLabelActive]}>
                                    Belum pernah
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {formData.previousTraining === 'ya' && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Pelatihan yang Pernah Diikuti</Text>
                            <View style={[styles.inputContainer, styles.textAreaContainer]}>
                                <Ionicons name="ribbon-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.textAreaIcon} />
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Sebutkan pelatihan dan penyelenggara"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    value={formData.previousTrainingDesc}
                                    onChangeText={(text) => setFormData({ ...formData, previousTrainingDesc: text })}
                                    multiline
                                    numberOfLines={2}
                                />
                            </View>
                        </View>
                    )}
                </View>

                {/* Preferensi & Ketersediaan */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferensi & Ketersediaan</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Format Pelatihan yang Diinginkan <Text style={styles.required}>*</Text></Text>
                        <View style={styles.checkboxGroup}>
                            {formatPelatihan.map((format, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.checkboxButton,
                                        formData.preferredFormats.includes(format) && styles.checkboxButtonActive
                                    ]}
                                    onPress={() => toggleFormat(format)}
                                >
                                    <View style={styles.checkbox}>
                                        {formData.preferredFormats.includes(format) && (
                                            <Ionicons name="checkmark" size={16} color="#38bdf8" />
                                        )}
                                    </View>
                                    <Text style={[
                                        styles.checkboxLabel,
                                        formData.preferredFormats.includes(format) && styles.checkboxLabelActive
                                    ]}>
                                        {format}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={styles.hint}>Pilih minimal 1 format</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Waktu yang Tersedia</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="calendar-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <TextInput
                                style={styles.input}
                                placeholder="Contoh: Weekday siang, Weekend, dll"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.availableTime}
                                onChangeText={(text) => setFormData({ ...formData, availableTime: text })}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Bersedia Mengikuti Pelatihan Berbayar?</Text>
                        <View style={styles.radioGroup}>
                            <TouchableOpacity
                                style={[styles.radioButton, formData.budgetAvailable === 'ya' && styles.radioButtonActive]}
                                onPress={() => setFormData({ ...formData, budgetAvailable: 'ya' })}
                            >
                                <View style={styles.radioCircle}>
                                    {formData.budgetAvailable === 'ya' && <View style={styles.radioCircleInner} />}
                                </View>
                                <Text style={[styles.radioLabel, formData.budgetAvailable === 'ya' && styles.radioLabelActive]}>
                                    Ya, ada budget
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.radioButton, formData.budgetAvailable === 'tidak' && styles.radioButtonActive]}
                                onPress={() => setFormData({ ...formData, budgetAvailable: 'tidak', budgetAmount: '' })}
                            >
                                <View style={styles.radioCircle}>
                                    {formData.budgetAvailable === 'tidak' && <View style={styles.radioCircleInner} />}
                                </View>
                                <Text style={[styles.radioLabel, formData.budgetAvailable === 'tidak' && styles.radioLabelActive]}>
                                    Hanya program gratis
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {formData.budgetAvailable === 'ya' && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Budget yang Tersedia (Rp)</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="cash-outline" size={20} color="rgba(255,255,255,0.5)" />
                                <Text style={styles.currencyPrefix}>Rp</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="0"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    value={formData.budgetAmount}
                                    onChangeText={(text) => setFormData({ ...formData, budgetAmount: formatCurrency(text) })}
                                    keyboardType="number-pad"
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
                    <LinearGradient colors={['#38bdf8', '#6366f1']} style={styles.submitButtonGradient}>
                        <Ionicons name="send" size={20} color="#fff" />
                        <Text style={styles.submitButtonText}>
                            {isSubmitting ? 'Mengirim...' : 'Daftar Pelatihan'}
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
    infoBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(56, 189, 248, 0.15)', borderRadius: 12, padding: 16, marginBottom: 24, gap: 12, borderWidth: 1, borderColor: 'rgba(56, 189, 248, 0.3)' },
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
    radioButtonActive: { backgroundColor: 'rgba(56, 189, 248, 0.15)', borderColor: '#38bdf8' },
    radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)', justifyContent: 'center', alignItems: 'center' },
    radioCircleInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#38bdf8' },
    radioLabel: { flex: 1, color: 'rgba(255,255,255,0.7)', fontSize: 14 },
    radioLabelActive: { color: '#fff', fontWeight: '600' },
    checkboxGroup: { gap: 12 },
    checkboxButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', gap: 12 },
    checkboxButtonActive: { backgroundColor: 'rgba(56, 189, 248, 0.15)', borderColor: '#38bdf8' },
    checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
    checkboxLabel: { flex: 1, color: 'rgba(255,255,255,0.7)', fontSize: 14 },
    checkboxLabelActive: { color: '#fff', fontWeight: '600' },
    submitButton: { borderRadius: 12, overflow: 'hidden', marginTop: 8 },
    submitButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
    submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    dropdown: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, marginTop: 8, maxHeight: 300, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    dropdownItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    dropdownItemText: { color: '#fff', fontSize: 15 },
});