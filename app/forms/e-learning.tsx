import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    FlatList, Alert, Platform, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Module {
    id: string;
    title: string;
    description: string;
    category: string;
    duration: string;
    level: 'Pemula' | 'Menengah' | 'Lanjutan';
    instructor: string;
    progress: number;
    totalLessons: number;
    completedLessons: number;
    rating: number;
    isEnrolled: boolean;
    materials: {
        type: 'video' | 'pdf' | 'quiz' | 'assignment';
        title: string;
        duration?: string;
        completed: boolean;
    }[];
}

const moduleCategories = [
    'Semua Kategori',
    'Manajemen Keuangan',
    'Pemasaran Digital',
    'Operasional & Produksi',
    'Legalitas & Hukum',
    'Teknologi & Digital',
    'Leadership & SDM'
];

const initialModules: Module[] = [
    {
        id: '1',
        title: 'Dasar-Dasar Manajemen Keuangan UMKM',
        description: 'Pelajari cara mengelola keuangan usaha dengan baik, dari pencatatan sederhana hingga analisis laporan keuangan',
        category: 'Manajemen Keuangan',
        duration: '2 jam 30 menit',
        level: 'Pemula',
        instructor: 'Dr. Ahmad Wijaya, M.Ak',
        progress: 0,
        totalLessons: 8,
        completedLessons: 0,
        rating: 4.8,
        isEnrolled: false,
        materials: [
            { type: 'video', title: 'Pengenalan Manajemen Keuangan', duration: '15:30', completed: false },
            { type: 'pdf', title: 'Template Buku Kas Sederhana', completed: false },
            { type: 'video', title: 'Cara Mencatat Pemasukan & Pengeluaran', duration: '20:15', completed: false },
            { type: 'quiz', title: 'Quiz Manajemen Kas', completed: false },
            { type: 'video', title: 'Membaca Laporan Laba Rugi', duration: '25:40', completed: false },
            { type: 'pdf', title: 'Contoh Laporan Keuangan UMKM', completed: false },
            { type: 'assignment', title: 'Praktik Pembuatan Laporan', completed: false },
            { type: 'video', title: 'Tips Pengelolaan Arus Kas', duration: '18:20', completed: false }
        ]
    },
    {
        id: '2',
        title: 'Strategi Pemasaran Digital untuk UMKM',
        description: 'Kuasi teknik pemasaran digital untuk menjangkau customer lebih luas melalui platform online',
        category: 'Pemasaran Digital',
        duration: '3 jam 15 menit',
        level: 'Menengah',
        instructor: 'Sarah Mustika, M.M',
        progress: 0,
        totalLessons: 10,
        completedLessons: 0,
        rating: 4.9,
        isEnrolled: true,
        materials: [
            { type: 'video', title: 'Memahami Customer Digital', duration: '18:45', completed: true },
            { type: 'video', title: 'Strategi Konten Instagram', duration: '22:30', completed: true },
            { type: 'pdf', title: 'Template Content Calendar', completed: true },
            { type: 'video', title: 'Facebook Ads untuk Pemula', duration: '28:15', completed: false },
            { type: 'quiz', title: 'Quiz Digital Marketing', completed: false },
            { type: 'video', title: 'Email Marketing yang Efektif', duration: '20:10', completed: false },
            { type: 'pdf', title: 'Studi Kasus Campaign Sukses', completed: false },
            { type: 'assignment', title: 'Rencana Pemasaran Digital', completed: false },
            { type: 'video', title: 'Analisis ROI Campaign', duration: '25:20', completed: false },
            { type: 'video', title: 'Building Brand Awareness', duration: '19:35', completed: false }
        ]
    },
    {
        id: '3',
        title: 'Legalitas Usaha dan Perizinan UMKM',
        description: 'Panduan lengkap mengurus perizinan usaha dari NIB, merk, hingga sertifikasi halal',
        category: 'Legalitas & Hukum',
        duration: '1 jam 45 menit',
        level: 'Pemula',
        instructor: 'Bambang Sutrisno, S.H.',
        progress: 0,
        totalLessons: 6,
        completedLessons: 0,
        rating: 4.7,
        isEnrolled: false,
        materials: [
            { type: 'video', title: 'Jenis-jenis Legalitas UMKM', duration: '16:20', completed: false },
            { type: 'pdf', title: 'Checklist Dokumen NIB', completed: false },
            { type: 'video', title: 'Cara Daftar Merek Dagang', duration: '22:45', completed: false },
            { type: 'video', title: 'Proses Sertifikasi Halal', duration: '19:30', completed: false },
            { type: 'pdf', title: 'Template Surat Perizinan', completed: false },
            { type: 'quiz', title: 'Quiz Legalitas Usaha', completed: false }
        ]
    },
    {
        id: '4',
        title: 'Optimasi Produksi dan Operasional',
        description: 'Tingkatkan efisiensi produksi dan kelola operasional usaha dengan biaya optimal',
        category: 'Operasional & Produksi',
        duration: '2 jam 10 menit',
        level: 'Menengah',
        instructor: 'Ir. Dian Permata, M.T.',
        progress: 0,
        totalLessons: 7,
        completedLessons: 0,
        rating: 4.6,
        isEnrolled: false,
        materials: [
            { type: 'video', title: 'Prinsip Lean Manufacturing', duration: '21:15', completed: false },
            { type: 'pdf', title: 'Template Production Planning', completed: false },
            { type: 'video', title: 'Manajemen Inventory', duration: '18:40', completed: false },
            { type: 'video', title: 'Quality Control Produk', duration: '16:25', completed: false },
            { type: 'assignment', title: 'Analisis Proses Produksi', completed: false },
            { type: 'pdf', title: 'Checklist Quality Assurance', completed: false },
            { type: 'quiz', title: 'Quiz Manajemen Operasional', completed: false }
        ]
    }
];

export default function ELearning() {
    const [modules, setModules] = useState<Module[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
    const [enrolledModules, setEnrolledModules] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadModules();
    }, []);

    const loadModules = async () => {
        try {
            setIsLoading(true);
            const savedModules = await AsyncStorage.getItem('eLearningModules');
            const savedEnrollments = await AsyncStorage.getItem('moduleEnrollments');
            
            if (savedModules) {
                setModules(JSON.parse(savedModules));
            } else {
                setModules(initialModules);
                await AsyncStorage.setItem('eLearningModules', JSON.stringify(initialModules));
            }

            if (savedEnrollments) {
                setEnrolledModules(JSON.parse(savedEnrollments));
            }
        } catch (error) {
            console.error('Error loading modules:', error);
            Alert.alert('Error', 'Gagal memuat modul');
        } finally {
            setIsLoading(false);
        }
    };

    const saveEnrollments = async (enrollments: string[]) => {
        try {
            await AsyncStorage.setItem('moduleEnrollments', JSON.stringify(enrollments));
        } catch (error) {
            console.error('Error saving enrollments:', error);
        }
    };

    const toggleEnrollment = async (moduleId: string) => {
        const updatedEnrollments = enrolledModules.includes(moduleId)
            ? enrolledModules.filter(id => id !== moduleId)
            : [...enrolledModules, moduleId];
        
        setEnrolledModules(updatedEnrollments);
        await saveEnrollments(updatedEnrollments);

        // Update module isEnrolled status
        const updatedModules = modules.map(module => 
            module.id === moduleId 
                ? { ...module, isEnrolled: !module.isEnrolled }
                : module
        );
        setModules(updatedModules);
        await AsyncStorage.setItem('eLearningModules', JSON.stringify(updatedModules));

        Alert.alert(
            'Berhasil',
            updatedEnrollments.includes(moduleId) 
                ? 'Anda berhasil mendaftar modul!' 
                : 'Anda berhasil membatalkan pendaftaran modul!'
        );
    };

    const filteredModules = modules.filter(module => {
        const matchesCategory = selectedCategory === 'Semua Kategori' || module.category === selectedCategory;
        return matchesCategory;
    });

    const getLevelColor = (level: Module['level']) => {
        const colors = {
            'Pemula': '#4CD964',
            'Menengah': '#FF9500',
            'Lanjutan': '#FF3B30'
        };
        return colors[level];
    };

    const calculateProgress = (module: Module) => {
        const completed = module.materials.filter(material => material.completed).length;
        return (completed / module.materials.length) * 100;
    };

    const renderModule = ({ item }: { item: Module }) => {
        const progress = calculateProgress(item);
        
        return (
            <TouchableOpacity 
                style={styles.moduleCard}
                onPress={() => router.push(`/module/${item.id}`as any)}
            >
                <View style={styles.moduleHeader}>
                    <View style={styles.categoryContainer}>
                        <View style={[styles.levelBadge, { backgroundColor: getLevelColor(item.level) }]}>
                            <Text style={styles.levelText}>{item.level}</Text>
                        </View>
                        <Text style={styles.categoryText}>{item.category}</Text>
                    </View>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={16} color="#FFCC00" />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                </View>

                <Text style={styles.moduleTitle}>{item.title}</Text>
                <Text style={styles.moduleDescription}>{item.description}</Text>

                <View style={styles.moduleDetails}>
                    <View style={styles.detailItem}>
                        <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.6)" />
                        <Text style={styles.detailText}>{item.duration}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Ionicons name="person-outline" size={14} color="rgba(255,255,255,0.6)" />
                        <Text style={styles.detailText}>{item.instructor}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Ionicons name="play-circle-outline" size={14} color="rgba(255,255,255,0.6)" />
                        <Text style={styles.detailText}>{item.totalLessons} materi</Text>
                    </View>
                </View>

                {item.isEnrolled && (
                    <View style={styles.progressContainer}>
                        <View style={styles.progressHeader}>
                            <Text style={styles.progressText}>Progress: {Math.round(progress)}%</Text>
                            <Text style={styles.progressText}>
                                {item.materials.filter(m => m.completed).length}/{item.materials.length} selesai
                            </Text>
                        </View>
                        <View style={styles.progressBar}>
                            <View 
                                style={[
                                    styles.progressFill, 
                                    { width: `${progress}%` }
                                ]} 
                            />
                        </View>
                    </View>
                )}

                <TouchableOpacity 
                    style={[
                        styles.enrollButton,
                        item.isEnrolled ? styles.enrolledButton : styles.notEnrolledButton
                    ]}
                    onPress={() => toggleEnrollment(item.id)}
                >
                    <Ionicons 
                        name={item.isEnrolled ? "checkmark-circle" : "add-circle-outline"} 
                        size={20} 
                        color={item.isEnrolled ? "#fff" : "#fa709a"} 
                    />
                    <Text style={[
                        styles.enrollButtonText,
                        item.isEnrolled ? styles.enrolledButtonText : styles.notEnrolledButtonText
                    ]}>
                        {item.isEnrolled ? 'Terdaftar' : 'Daftar Modul'}
                    </Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['rgba(250, 112, 154, 0.2)', 'rgba(254, 225, 64, 0.2)']} style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerIcon}>📚</Text>
                    <Text style={styles.headerTitle}>E-Learning UMKM</Text>
                    <Text style={styles.headerSubtitle}>
                        Tingkatkan kompetensi bisnis Anda dengan modul pembelajaran mandiri
                    </Text>
                </View>
            </LinearGradient>

            {/* Stats Overview */}
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{modules.filter(m => m.isEnrolled).length}</Text>
                    <Text style={styles.statLabel}>Modul Diikuti</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                        {modules.reduce((total, module) => total + module.completedLessons, 0)}
                    </Text>
                    <Text style={styles.statLabel}>Materi Selesai</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{modules.length}</Text>
                    <Text style={styles.statLabel}>Total Modul</Text>
                </View>
            </View>

            {/* Categories */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
                {moduleCategories.map((category, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.categoryButton,
                            selectedCategory === category && styles.categoryButtonActive
                        ]}
                        onPress={() => setSelectedCategory(category)}
                    >
                        <Text style={[
                            styles.categoryButtonText,
                            selectedCategory === category && styles.categoryButtonTextActive
                        ]}>
                            {category}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Modules List */}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Memuat modul...</Text>
                </View>
            ) : filteredModules.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="school-outline" size={64} color="rgba(255,255,255,0.3)" />
                    <Text style={styles.emptyTitle}>Tidak ada modul</Text>
                    <Text style={styles.emptySubtitle}>
                        {selectedCategory !== 'Semua Kategori' 
                            ? 'Tidak ada modul dalam kategori ini' 
                            : 'Belum ada modul yang tersedia'}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredModules}
                    renderItem={renderModule}
                    keyExtractor={item => item.id}
                    style={styles.modulesList}
                    contentContainerStyle={styles.modulesContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
    
    // Stats
    statsContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        padding: 20, 
        backgroundColor: 'rgba(255,255,255,0.03)',
        marginHorizontal: 20,
        borderRadius: 12,
        marginBottom: 16
    },
    statItem: { alignItems: 'center' },
    statNumber: { 
        color: '#fff', 
        fontSize: 24, 
        fontWeight: '700', 
        marginBottom: 4 
    },
    statLabel: { 
        color: 'rgba(255,255,255,0.6)', 
        fontSize: 12 
    },
    
    // Categories
    categoriesContainer: { paddingHorizontal: 20, marginBottom: 16 },
    categoryButton: { 
        paddingHorizontal: 20, 
        paddingVertical: 10, 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        borderRadius: 20, 
        marginRight: 8, 
        borderWidth: 1, 
        borderColor: 'rgba(255,255,255,0.1)' 
    },
    categoryButtonActive: { 
        backgroundColor: 'rgba(250, 112, 154, 0.2)', 
        borderColor: '#fa709a' 
    },
    categoryButtonText: { 
        color: 'rgba(255,255,255,0.7)', 
        fontSize: 14, 
        fontWeight: '500' 
    },
    categoryButtonTextActive: { 
        color: '#fff', 
        fontWeight: '600' 
    },
    
    // Loading & Empty States
    loadingContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    loadingText: { 
        color: 'rgba(255,255,255,0.7)', 
        fontSize: 16 
    },
    emptyContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 40 
    },
    emptyTitle: { 
        color: '#fff', 
        fontSize: 18, 
        fontWeight: '600', 
        marginTop: 16, 
        marginBottom: 8 
    },
    emptySubtitle: { 
        color: 'rgba(255,255,255,0.6)', 
        textAlign: 'center',
        fontSize: 14 
    },
    
    // Modules List
    modulesList: { flex: 1 },
    modulesContent: { padding: 20, paddingTop: 0 },
    
    // Module Card
    moduleCard: { 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        borderRadius: 12, 
        padding: 16, 
        marginBottom: 16, 
        borderWidth: 1, 
        borderColor: 'rgba(255,255,255,0.1)' 
    },
    moduleHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        marginBottom: 12 
    },
    categoryContainer: { flex: 1 },
    levelBadge: { 
        paddingHorizontal: 8, 
        paddingVertical: 4, 
        borderRadius: 6, 
        alignSelf: 'flex-start',
        marginBottom: 4
    },
    levelText: { 
        color: '#fff', 
        fontSize: 12, 
        fontWeight: '600' 
    },
    categoryText: { 
        color: 'rgba(255,255,255,0.6)', 
        fontSize: 12 
    },
    ratingContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 4 
    },
    ratingText: { 
        color: '#fff', 
        fontSize: 14, 
        fontWeight: '600' 
    },
    moduleTitle: { 
        color: '#fff', 
        fontSize: 18, 
        fontWeight: '700', 
        marginBottom: 8 
    },
    moduleDescription: { 
        color: 'rgba(255,255,255,0.8)', 
        fontSize: 14, 
        lineHeight: 20, 
        marginBottom: 12 
    },
    moduleDetails: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 12 
    },
    detailItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 6 
    },
    detailText: { 
        color: 'rgba(255,255,255,0.6)', 
        fontSize: 12 
    },
    progressContainer: { 
        marginBottom: 12 
    },
    progressHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 6 
    },
    progressText: { 
        color: 'rgba(255,255,255,0.7)', 
        fontSize: 12 
    },
    progressBar: { 
        height: 6, 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        borderRadius: 3 
    },
    progressFill: { 
        height: '100%', 
        backgroundColor: '#fa709a', 
        borderRadius: 3 
    },
    enrollButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingVertical: 12, 
        borderRadius: 8, 
        gap: 8 
    },
    notEnrolledButton: { 
        backgroundColor: 'rgba(250, 112, 154, 0.1)', 
        borderWidth: 1, 
        borderColor: '#fa709a' 
    },
    enrolledButton: { 
        backgroundColor: '#fa709a' 
    },
    enrollButtonText: { 
        fontSize: 16, 
        fontWeight: '600' 
    },
    notEnrolledButtonText: { 
        color: '#fa709a' 
    },
    enrolledButtonText: { 
        color: '#fff' 
    },
});