import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    FlatList, Alert, Linking, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Program {
    id: string;
    title: string;
    description: string;
    category: string;
    deadline: string;
    status: 'Buka' | 'Tutup' | 'Segera';
    quota: string;
    requirements: string[];
    contact: string;
    link: string;
    isBookmarked: boolean;
}

const programCategories = [
    'Semua Program',
    'Pendanaan & Kredit',
    'Pelatihan & Kapasitas',
    'Pemasaran & Ekspor',
    'Teknologi & Digital',
    'Regulasi & Sertifikasi'
];

const initialPrograms: Program[] = [
    {
        id: '1',
        title: 'Kredit Usaha Rakyat (KUR)',
        description: 'Program pembiayaan modal kerja dan investasi untuk UMKM dengan subsidi bunga dari pemerintah',
        category: 'Pendanaan & Kredit',
        deadline: '31 Desember 2024',
        status: 'Buka',
        quota: 'Rp 500 juta per debitur',
        requirements: [
            'Warga Negara Indonesia',
            'Memiliki usaha produktif',
            'Tidak sedang menerima kredit program lainnya',
            'Memiliki NPWP'
        ],
        contact: '021-1234567',
        link: 'https://kur.kemenkopukm.go.id',
        isBookmarked: false
    },
    {
        id: '2',
        title: 'Program Ultra Mikro (UMi)',
        description: 'Pembiayaan ultra mikro dengan plafon hingga Rp 10 juta untuk usaha mikro',
        category: 'Pendanaan & Kredit',
        deadline: '31 Desember 2024',
        status: 'Buka',
        quota: 'Rp 10 juta per debitur',
        requirements: [
            'Usaha mikro dengan omset < Rp 100 juta/tahun',
            'Tidak memiliki akses ke perbankan',
            'Usaha sudah berjalan minimal 6 bulan'
        ],
        contact: '021-1234568',
        link: 'https://umi.kemenkopukm.go.id',
        isBookmarked: true
    },
    {
        id: '3',
        title: 'Digitalisasi UMKM',
        description: 'Program pendampingan dan bantuan teknologi untuk transformasi digital UMKM',
        category: 'Teknologi & Digital',
        deadline: '30 Juni 2024',
        status: 'Buka',
        quota: '10.000 UMKM',
        requirements: [
            'Memiliki usaha yang sudah berjalan',
            'Bersedia mengikuti pelatihan digital',
            'Memiliki smartphone/android'
        ],
        contact: '021-1234569',
        link: 'https://digital.kemenkopukm.go.id',
        isBookmarked: false
    },
    {
        id: '4',
        title: 'Pelatihan Manajemen Keuangan',
        description: 'Pelatihan gratis pengelolaan keuangan usaha untuk UMKM',
        category: 'Pelatihan & Kapasitas',
        deadline: '15 Agustus 2024',
        status: 'Segera',
        quota: '5.000 peserta',
        requirements: [
            'Pemilik/pengelola UMKM',
            'Bersedia mengikuti pelatihan penuh',
            'Memiliki usaha yang aktif'
        ],
        contact: '021-1234570',
        link: 'https://pelatihan.kemenkopukm.go.id',
        isBookmarked: false
    },
    {
        id: '5',
        title: 'Bantuan Ekspor Produk UMKM',
        description: 'Pendampingan dan fasilitasi ekspor produk UMKM ke pasar internasional',
        category: 'Pemasaran & Ekspor',
        deadline: '30 April 2024',
        status: 'Buka',
        quota: '2.000 UMKM',
        requirements: [
            'Produk memenuhi standar ekspor',
            'Memiliki izin usaha',
            'Bersedia mengikuti pembinaan'
        ],
        contact: '021-1234571',
        link: 'https://ekspor.kemenkopukm.go.id',
        isBookmarked: false
    }
];

export default function ProgramKemenkopUKM() {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('Semua Program');
    const [bookmarkedPrograms, setBookmarkedPrograms] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadPrograms();
    }, []);

    const loadPrograms = async () => {
        try {
            setIsLoading(true);
            const savedPrograms = await AsyncStorage.getItem('kemenkopPrograms');
            const savedBookmarks = await AsyncStorage.getItem('programBookmarks');
            
            if (savedPrograms) {
                setPrograms(JSON.parse(savedPrograms));
            } else {
                setPrograms(initialPrograms);
                await AsyncStorage.setItem('kemenkopPrograms', JSON.stringify(initialPrograms));
            }

            if (savedBookmarks) {
                setBookmarkedPrograms(JSON.parse(savedBookmarks));
            }
        } catch (error) {
            console.error('Error loading programs:', error);
            Alert.alert('Error', 'Gagal memuat program');
        } finally {
            setIsLoading(false);
        }
    };

    const saveBookmarks = async (bookmarks: string[]) => {
        try {
            await AsyncStorage.setItem('programBookmarks', JSON.stringify(bookmarks));
        } catch (error) {
            console.error('Error saving bookmarks:', error);
        }
    };

    const toggleBookmark = async (programId: string) => {
        const updatedBookmarks = bookmarkedPrograms.includes(programId)
            ? bookmarkedPrograms.filter(id => id !== programId)
            : [...bookmarkedPrograms, programId];
        
        setBookmarkedPrograms(updatedBookmarks);
        await saveBookmarks(updatedBookmarks);

        // Update program isBookmarked status
        const updatedPrograms = programs.map(program => 
            program.id === programId 
                ? { ...program, isBookmarked: !program.isBookmarked }
                : program
        );
        setPrograms(updatedPrograms);
        await AsyncStorage.setItem('kemenkopPrograms', JSON.stringify(updatedPrograms));
    };

    const filteredPrograms = programs.filter(program => {
        const matchesCategory = selectedCategory === 'Semua Program' || program.category === selectedCategory;
        return matchesCategory;
    });

    const handleContact = (phone: string) => {
        Linking.openURL(`tel:${phone}`);
    };

    const handleOpenLink = async (link: string) => {
        const supported = await Linking.canOpenURL(link);
        if (supported) {
            await Linking.openURL(link);
        } else {
            Alert.alert('Error', 'Tidak dapat membuka link');
        }
    };

    const getStatusColor = (status: Program['status']) => {
        const colors = {
            'Buka': '#4CD964',
            'Tutup': '#FF3B30',
            'Segera': '#FFCC00'
        };
        return colors[status];
    };

    const renderProgram = ({ item }: { item: Program }) => (
        <View style={styles.programCard}>
            <View style={styles.programHeader}>
                <View style={styles.categoryContainer}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                    <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                <TouchableOpacity onPress={() => toggleBookmark(item.id)}>
                    <Ionicons 
                        name={item.isBookmarked ? "bookmark" : "bookmark-outline"} 
                        size={24} 
                        color={item.isBookmarked ? "#fa709a" : "rgba(255,255,255,0.5)"} 
                    />
                </TouchableOpacity>
            </View>

            <Text style={styles.programTitle}>{item.title}</Text>
            <Text style={styles.programDescription}>{item.description}</Text>

            <View style={styles.programDetails}>
                <View style={styles.detailItem}>
                    <Ionicons name="calendar-outline" size={16} color="rgba(255,255,255,0.6)" />
                    <Text style={styles.detailText}>Tutup: {item.deadline}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Ionicons name="people-outline" size={16} color="rgba(255,255,255,0.6)" />
                    <Text style={styles.detailText}>Kuota: {item.quota}</Text>
                </View>
            </View>

            <View style={styles.requirements}>
                <Text style={styles.requirementsTitle}>Persyaratan:</Text>
                {item.requirements.map((requirement, index) => (
                    <View key={index} style={styles.requirementItem}>
                        <Ionicons name="checkmark-circle" size={16} color="#4CD964" />
                        <Text style={styles.requirementText}>{requirement}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.actionButtons}>
                <TouchableOpacity 
                    style={styles.contactButton}
                    onPress={() => handleContact(item.contact)}
                >
                    <Ionicons name="call-outline" size={16} color="#fff" />
                    <Text style={styles.contactButtonText}>Hubungi</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.detailButton}
                    onPress={() => handleOpenLink(item.link)}
                >
                    <Ionicons name="open-outline" size={16} color="#fa709a" />
                    <Text style={styles.detailButtonText}>Info Detail</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={['rgba(250, 112, 154, 0.2)', 'rgba(254, 225, 64, 0.2)']} style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerIcon}>🏛️</Text>
                    <Text style={styles.headerTitle}>Program KemenKopUKM</Text>
                    <Text style={styles.headerSubtitle}>
                        Akses informasi program bantuan, pendanaan, dan pelatihan dari Kementerian Koperasi dan UKM
                    </Text>
                </View>
            </LinearGradient>

            {/* Categories */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
                {programCategories.map((category, index) => (
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

            {/* Program List */}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Memuat program...</Text>
                </View>
            ) : filteredPrograms.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="business-outline" size={64} color="rgba(255,255,255,0.3)" />
                    <Text style={styles.emptyTitle}>Tidak ada program</Text>
                    <Text style={styles.emptySubtitle}>
                        {selectedCategory !== 'Semua Program' 
                            ? 'Tidak ada program dalam kategori ini' 
                            : 'Belum ada program yang tersedia'}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredPrograms}
                    renderItem={renderProgram}
                    keyExtractor={item => item.id}
                    style={styles.programsList}
                    contentContainerStyle={styles.programsContent}
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
    
    // Categories
    categoriesContainer: { paddingHorizontal: 20, marginBottom: 16, marginTop: 10 },
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
    
    // Programs List
    programsList: { flex: 1 },
    programsContent: { padding: 20, paddingTop: 0 },
    
    // Program Card
    programCard: { 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        borderRadius: 12, 
        padding: 16, 
        marginBottom: 16, 
        borderWidth: 1, 
        borderColor: 'rgba(255,255,255,0.1)' 
    },
    programHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        marginBottom: 12 
    },
    categoryContainer: { flex: 1 },
    statusBadge: { 
        paddingHorizontal: 8, 
        paddingVertical: 4, 
        borderRadius: 6, 
        alignSelf: 'flex-start',
        marginBottom: 4
    },
    statusText: { 
        color: '#fff', 
        fontSize: 12, 
        fontWeight: '600' 
    },
    categoryText: { 
        color: 'rgba(255,255,255,0.6)', 
        fontSize: 12 
    },
    programTitle: { 
        color: '#fff', 
        fontSize: 18, 
        fontWeight: '700', 
        marginBottom: 8 
    },
    programDescription: { 
        color: 'rgba(255,255,255,0.8)', 
        fontSize: 14, 
        lineHeight: 20, 
        marginBottom: 12 
    },
    programDetails: { 
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
    requirements: { 
        marginBottom: 16 
    },
    requirementsTitle: { 
        color: '#fff', 
        fontSize: 14, 
        fontWeight: '600', 
        marginBottom: 8 
    },
    requirementItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 8, 
        marginBottom: 4 
    },
    requirementText: { 
        color: 'rgba(255,255,255,0.7)', 
        fontSize: 12, 
        flex: 1 
    },
    actionButtons: { 
        flexDirection: 'row', 
        gap: 12 
    },
    contactButton: { 
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#fa709a', 
        paddingVertical: 10, 
        borderRadius: 8, 
        gap: 6 
    },
    contactButtonText: { 
        color: '#fff', 
        fontSize: 14, 
        fontWeight: '600' 
    },
    detailButton: { 
        flex: 1, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: 'rgba(250, 112, 154, 0.1)', 
        paddingVertical: 10, 
        borderRadius: 8, 
        gap: 6,
        borderWidth: 1,
        borderColor: '#fa709a'
    },
    detailButtonText: { 
        color: '#fa709a', 
        fontSize: 14, 
        fontWeight: '600' 
    },
});