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

export default function PerizinanForm() {
    const [formData, setFormData] = useState({
        businessName: '',
        ownerName: '',
        nik: '',
        address: '',
        businessType: '',
        phone: '',
        email: '',
        izinType: 'NIB', // NIB, IUMK, SIUP
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const izinTypes = [
        { value: 'NIB', label: 'NIB (Nomor Induk Berusaha)' },
        { value: 'IUMK', label: 'IUMK (Izin Usaha Mikro Kecil)' },
        { value: 'SIUP', label: 'SIUP (Surat Izin Usaha Perdagangan)' },
        { value: 'TDP', label: 'TDP (Tanda Daftar Perusahaan)' },
    ];

    const handleSubmit = async () => {
        // Validation
        if (!formData.businessName || !formData.ownerName || !formData.nik ||
            !formData.address || !formData.phone || !formData.email) {
            Alert.alert('Error', 'Mohon lengkapi semua field yang wajib diisi');
            return;
        }

        // Validate NIK (16 digits)
        if (formData.nik.length !== 16) {
            Alert.alert('Error', 'NIK harus 16 digit');
            return;
        }

        // Validate phone
        if (formData.phone.length < 10) {
            Alert.alert('Error', 'Nomor telepon tidak valid');
            return;
        }

        setIsSubmitting(true);

        try {
            // Save to AsyncStorage
            const submission = {
                ...formData,
                id: Date.now().toString(),
                type: 'perizinan',
                status: 'pending',
                submittedAt: new Date().toISOString(),
            };

            const existingSubmissions = await AsyncStorage.getItem('perizinanSubmissions');
            const submissions = existingSubmissions ? JSON.parse(existingSubmissions) : [];
            submissions.push(submission);
            await AsyncStorage.setItem('perizinanSubmissions', JSON.stringify(submissions));

            Alert.alert(
                'Berhasil Dikirim! 🎉',
                `Permohonan ${formData.izinType} Anda telah diterima.\n\nNomor Registrasi: ${submission.id}\n\nTim kami akan menghubungi Anda dalam 1-3 hari kerja.`,
                [
                    {
                        text: 'OK',
                        onPress: () => router.back(),
                    },
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Gagal mengirim permohonan. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={['rgba(102, 126, 234, 0.2)', 'rgba(118, 75, 162, 0.2)']}
                style={styles.header}
            >
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerIcon}>📋</Text>
                    <Text style={styles.headerTitle}>Perizinan Usaha</Text>
                    <Text style={styles.headerSubtitle}>
                        Urus NIB, IUMK, dan berbagai izin usaha lainnya
                    </Text>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Info Banner */}
                <View style={styles.infoBanner}>
                    <Ionicons name="information-circle" size={24} color="#667eea" />
                    <Text style={styles.infoBannerText}>
                        Proses permohonan izin akan memakan waktu 1-3 hari kerja
                    </Text>
                </View>

                {/* Jenis Izin */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Jenis Izin <Text style={styles.required}>*</Text></Text>
                    <View style={styles.radioGroup}>
                        {izinTypes.map((type) => (
                            <TouchableOpacity
                                key={type.value}
                                style={[
                                    styles.radioButton,
                                    formData.izinType === type.value && styles.radioButtonActive,
                                ]}
                                onPress={() => setFormData({ ...formData, izinType: type.value })}
                            >
                                <View style={styles.radioCircle}>
                                    {formData.izinType === type.value && (
                                        <View style={styles.radioCircleInner} />
                                    )}
                                </View>
                                <Text style={[
                                    styles.radioLabel,
                                    formData.izinType === type.value && styles.radioLabelActive,
                                ]}>
                                    {type.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Form Fields */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informasi Usaha</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Nama Usaha <Text style={styles.required}>*</Text>
                        </Text>
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
                        <Text style={styles.label}>
                            Jenis Usaha <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="briefcase-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <TextInput
                                style={styles.input}
                                placeholder="Contoh: Toko Kelontong, Warung Makan, dll"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.businessType}
                                onChangeText={(text) => setFormData({ ...formData, businessType: text })}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Alamat Usaha <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={[styles.inputContainer, styles.textAreaContainer]}>
                            <Ionicons name="location-outline" size={20} color="rgba(255,255,255,0.5)" style={styles.textAreaIcon} />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Alamat lengkap usaha"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.address}
                                onChangeText={(text) => setFormData({ ...formData, address: text })}
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                    </View>
                </View>

                {/* Informasi Pemilik */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informasi Pemilik</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            Nama Pemilik <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <TextInput
                                style={styles.input}
                                placeholder="Nama lengkap sesuai KTP"
                                placeholderTextColor="rgba(255,255,255,0.4)"
                                value={formData.ownerName}
                                onChangeText={(text) => setFormData({ ...formData, ownerName: text })}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>
                            NIK <Text style={styles.required}>*</Text>
                        </Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="card-outline" size={20} color="rgba(255,255,255,0.5)" />
                            <TextInput
                                style={styles.input}
                                placeholder="16 digit NIK"
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
                        <Text style={styles.label}>
                            No. Telepon <Text style={styles.required}>*</Text>
                        </Text>
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
                        <Text style={styles.label}>
                            Email <Text style={styles.required}>*</Text>
                        </Text>
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

                {/* Submit Button */}
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={styles.submitButtonGradient}
                    >
                        <Ionicons name="send" size={20} color="#fff" />
                        <Text style={styles.submitButtonText}>
                            {isSubmitting ? 'Mengirim...' : 'Ajukan Permohonan'}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0e27',
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 24,
        paddingHorizontal: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerContent: {
        alignItems: 'center',
    },
    headerIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(102, 126, 234, 0.15)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        gap: 12,
        borderWidth: 1,
        borderColor: 'rgba(102, 126, 234, 0.3)',
    },
    infoBannerText: {
        flex: 1,
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13,
        lineHeight: 18,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 16,
    },
    radioGroup: {
        gap: 12,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        gap: 12,
    },
    radioButtonActive: {
        backgroundColor: 'rgba(102, 126, 234, 0.15)',
        borderColor: '#667eea',
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioCircleInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#667eea',
    },
    radioLabel: {
        flex: 1,
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
    },
    radioLabelActive: {
        color: '#fff',
        fontWeight: '600',
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
    textAreaContainer: {
        alignItems: 'flex-start',
        paddingVertical: 12,
    },
    textAreaIcon: {
        marginTop: 4,
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    hint: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        marginTop: 4,
    },
    submitButton: {
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 8,
    },
    submitButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});