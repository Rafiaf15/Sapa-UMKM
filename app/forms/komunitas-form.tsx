import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput,
    TouchableOpacity, FlatList, Alert, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define Types
interface Thread {
    id: string;
    title: string;
    author: string;
    content: string;
    category: string;
    replies: number;
    likes: number;
    timestamp: string;
    isLiked: boolean;
    createdAt?: string;
}

interface NewThread {
    title: string;
    content: string;
    category: string;
}

const categories = [
    'Semua Topik',
    'Pemasaran Digital',
    'Keuangan & Akuntansi',
    'Produksi & Operasional',
    'Export & Logistik',
    'Regulasi & Legalitas',
    'Networking & Kemitraan'
];

// Data default jika belum ada data
const defaultThreads: Thread[] = [
    {
        id: '1',
        title: 'Bagaimana strategi marketing di era digital?',
        author: 'Budi Santoso - UMKM Fashion',
        content: 'Saya punya usaha fashion lokal, tapi susah menjangkau customer muda. Ada tips?',
        category: 'Pemasaran Digital',
        replies: 15,
        likes: 8,
        timestamp: '2 jam yang lalu',
        isLiked: false
    },
    {
        id: '2',
        title: 'Pengalaman ekspor produk kerajinan ke luar negeri',
        author: 'Sari Wijaya - Kerajinan Handmade',
        content: 'Baru saja berhasil ekspor pertama ke Singapura. Mau berbagi pengalaman...',
        category: 'Export & Logistik',
        replies: 23,
        likes: 12,
        timestamp: '1 hari yang lalu',
        isLiked: true
    }
];

export default function ForumDiskusi() {
    const [threads, setThreads] = useState<Thread[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('Semua Topik');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreatingThread, setIsCreatingThread] = useState(false);
    const [newThread, setNewThread] = useState<NewThread>({
        title: '',
        content: '',
        category: 'Pemasaran Digital'
    });
    const [isLoading, setIsLoading] = useState(true);

    // Load threads dari AsyncStorage saat component mount
    useEffect(() => {
        loadThreads();
    }, []);

    const loadThreads = async () => {
        try {
            setIsLoading(true);
            const savedThreads = await AsyncStorage.getItem('forumThreads');
            console.log('Loaded threads from storage:', savedThreads);
            
            if (savedThreads) {
                setThreads(JSON.parse(savedThreads));
            } else {
                // Jika belum ada data, gunakan default threads
                setThreads(defaultThreads);
                await AsyncStorage.setItem('forumThreads', JSON.stringify(defaultThreads));
            }
        } catch (error) {
            console.error('Error loading threads:', error);
            Alert.alert('Error', 'Gagal memuat diskusi');
        } finally {
            setIsLoading(false);
        }
    };

    // Save threads ke AsyncStorage
    const saveThreads = async (newThreads: Thread[]) => {
        try {
            await AsyncStorage.setItem('forumThreads', JSON.stringify(newThreads));
            console.log('Saved threads to storage:', newThreads.length);
        } catch (error) {
            console.error('Error saving threads:', error);
            Alert.alert('Error', 'Gagal menyimpan diskusi');
        }
    };

    // Filter threads berdasarkan kategori dan pencarian
    const filteredThreads = threads.filter(thread => {
        const matchesCategory = selectedCategory === 'Semua Topik' || thread.category === selectedCategory;
        const matchesSearch = thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            thread.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            thread.author.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleCreateThread = async () => {
        if (!newThread.title.trim() || !newThread.content.trim()) {
            Alert.alert('Error', 'Judul dan konten diskusi harus diisi');
            return;
        }

        const thread: Thread = {
            id: Date.now().toString(),
            title: newThread.title,
            author: 'Anda - UMKM Anda',
            content: newThread.content,
            category: newThread.category,
            replies: 0,
            likes: 0,
            timestamp: 'Baru saja',
            isLiked: false,
            createdAt: new Date().toISOString()
        };

        const updatedThreads = [thread, ...threads];
        setThreads(updatedThreads);
        await saveThreads(updatedThreads);
        
        setNewThread({ title: '', content: '', category: 'Pemasaran Digital' });
        setIsCreatingThread(false);
        
        Alert.alert('Berhasil', 'Diskusi berhasil dibuat!', [
            { 
                text: 'OK',
                onPress: () => console.log('Thread created:', thread) 
            }
        ]);
    };

    const handleLike = async (threadId: string) => {
        const updatedThreads = threads.map(thread => 
            thread.id === threadId 
                ? { 
                    ...thread, 
                    likes: thread.isLiked ? thread.likes - 1 : thread.likes + 1,
                    isLiked: !thread.isLiked 
                  }
                : thread
        );
        
        setThreads(updatedThreads);
        await saveThreads(updatedThreads);
    };

    const handleDeleteThread = async (threadId: string) => {
        Alert.alert(
            'Hapus Diskusi',
            'Apakah Anda yakin ingin menghapus diskusi ini?',
            [
                { text: 'Batal', style: 'cancel' },
                { 
                    text: 'Hapus', 
                    style: 'destructive',
                    onPress: async () => {
                        const updatedThreads = threads.filter(thread => thread.id !== threadId);
                        setThreads(updatedThreads);
                        await saveThreads(updatedThreads);
                        Alert.alert('Berhasil', 'Diskusi berhasil dihapus');
                    }
                }
            ]
        );
    };

    const renderThread = ({ item }: { item: Thread }) => (
        <TouchableOpacity 
            style={styles.threadCard}
            onPress={() => {
                // Navigate to thread detail
                router.push({
                    pathname: '/forms/thread/[id]' as const,
                    params: { id: item.id }
                });
            }}
        >
            <View style={styles.threadHeader}>
                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
                    <Text style={styles.categoryText}>{item.category}</Text>
                </View>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
            
            <Text style={styles.threadTitle}>{item.title}</Text>
            <Text style={styles.threadContent} numberOfLines={2}>
                {item.content}
            </Text>
            
            <View style={styles.threadFooter}>
                <Text style={styles.author}>{item.author}</Text>
                <View style={styles.threadStats}>
                    <View style={styles.stat}>
                        <Ionicons name="chatbubble-outline" size={16} color="rgba(255,255,255,0.6)" />
                        <Text style={styles.statText}>{item.replies}</Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.stat}
                        onPress={() => handleLike(item.id)}
                    >
                        <Ionicons 
                            name={item.isLiked ? "heart" : "heart-outline"} 
                            size={16} 
                            color={item.isLiked ? "#fa709a" : "rgba(255,255,255,0.6)"} 
                        />
                        <Text style={[styles.statText, item.isLiked && styles.likedText]}>
                            {item.likes}
                        </Text>
                    </TouchableOpacity>
                    
                    {/* Delete button for user's own threads */}
                    {item.author.includes('Anda') && (
                        <TouchableOpacity 
                            style={styles.stat}
                            onPress={() => handleDeleteThread(item.id)}
                        >
                            <Ionicons name="trash-outline" size={16} color="rgba(255,255,255,0.4)" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    const getCategoryColor = (category: string): string => {
        const colors: { [key: string]: string } = {
            'Pemasaran Digital': '#fa709a',
            'Keuangan & Akuntansi': '#fee140',
            'Produksi & Operasional': '#4facfe',
            'Export & Logistik': '#43e97b',
            'Regulasi & Legalitas': '#a8edea',
            'Networking & Kemitraan': '#ff9a9e'
        };
        return colors[category] || '#666';
    };

    if (isCreatingThread) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={['rgba(250, 112, 154, 0.2)', 'rgba(254, 225, 64, 0.2)']} style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => setIsCreatingThread(false)}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Buat Diskusi Baru</Text>
                </LinearGradient>

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.createContent}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Kategori Diskusi</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                            {categories.filter(cat => cat !== 'Semua Topik').map((category, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.createCategoryBadge,
                                        { backgroundColor: getCategoryColor(category) },
                                        newThread.category === category && styles.selectedCategory
                                    ]}
                                    onPress={() => setNewThread({...newThread, category})}
                                >
                                    <Text style={styles.createCategoryText}>{category}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Judul Diskusi <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.createInput}
                            placeholder="Masukkan judul yang menarik..."
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            value={newThread.title}
                            onChangeText={(text) => setNewThread({...newThread, title: text})}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Isi Diskusi <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={[styles.createInput, styles.textArea]}
                            placeholder="Tulis pertanyaan atau topik yang ingin didiskusikan..."
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            value={newThread.content}
                            onChangeText={(text) => setNewThread({...newThread, content: text})}
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                        />
                    </View>

                    <TouchableOpacity style={styles.submitButton} onPress={handleCreateThread}>
                        <LinearGradient colors={['#fa709a', '#fee140']} style={styles.submitButtonGradient}>
                            <Ionicons name="send" size={20} color="#fff" />
                            <Text style={styles.submitButtonText}>Posting Diskusi</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={['rgba(250, 112, 154, 0.2)', 'rgba(254, 225, 64, 0.2)']} style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerIcon}>💬</Text>
                    <Text style={styles.headerTitle}>Forum Diskusi UMKM</Text>
                    <Text style={styles.headerSubtitle}>
                        Berdiskusi, berbagi pengalaman, dan bangun jaringan dengan sesama pelaku UMKM
                    </Text>
                </View>
            </LinearGradient>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="rgba(255,255,255,0.5)" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Cari topik diskusi..."
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery ? (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.5)" />
                    </TouchableOpacity>
                ) : null}
            </View>

            {/* Categories */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
                {categories.map((category, index) => (
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

            {/* Threads List */}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Memuat diskusi...</Text>
                </View>
            ) : filteredThreads.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="chatbubble-outline" size={64} color="rgba(255,255,255,0.3)" />
                    <Text style={styles.emptyTitle}>Belum ada diskusi</Text>
                    <Text style={styles.emptySubtitle}>
                        {searchQuery || selectedCategory !== 'Semua Topik' 
                            ? 'Coba ubah pencarian atau filter' 
                            : 'Jadilah yang pertama memulai diskusi!'}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredThreads}
                    renderItem={renderThread}
                    keyExtractor={item => item.id}
                    style={styles.threadsList}
                    contentContainerStyle={styles.threadsContent}
                    showsVerticalScrollIndicator={false}
                    refreshing={isLoading}
                    onRefresh={loadThreads}
                />
            )}

            {/* Create Thread Button */}
            <TouchableOpacity 
                style={styles.createButton}
                onPress={() => setIsCreatingThread(true)}
            >
                <LinearGradient colors={['#fa709a', '#fee140']} style={styles.createButtonGradient}>
                    <Ionicons name="add" size={24} color="#fff" />
                </LinearGradient>
            </TouchableOpacity>
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
    
    // Search
    searchContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        margin: 20, 
        padding: 16, 
        borderRadius: 12, 
        borderWidth: 1, 
        borderColor: 'rgba(255,255,255,0.1)' 
    },
    searchInput: { flex: 1, marginLeft: 12, color: '#fff', fontSize: 16 },
    
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
    
    // Threads List
    threadsList: { flex: 1 },
    threadsContent: { padding: 20, paddingTop: 0 },
    
    // Thread Card
    threadCard: { 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        borderRadius: 12, 
        padding: 16, 
        marginBottom: 12, 
        borderWidth: 1, 
        borderColor: 'rgba(255,255,255,0.1)' 
    },
    threadHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 12 
    },
    categoryBadge: { 
        paddingHorizontal: 12, 
        paddingVertical: 4, 
        borderRadius: 12 
    },
    categoryText: { 
        color: '#fff', 
        fontSize: 12, 
        fontWeight: '600' 
    },
    timestamp: { 
        color: 'rgba(255,255,255,0.5)', 
        fontSize: 12 
    },
    threadTitle: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: '700', 
        marginBottom: 8 
    },
    threadContent: { 
        color: 'rgba(255,255,255,0.7)', 
        fontSize: 14, 
        lineHeight: 20, 
        marginBottom: 12 
    },
    threadFooter: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
    },
    author: { 
        color: 'rgba(255,255,255,0.6)', 
        fontSize: 12 
    },
    threadStats: { 
        flexDirection: 'row', 
        gap: 16 
    },
    stat: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 4 
    },
    statText: { 
        color: 'rgba(255,255,255,0.6)', 
        fontSize: 12 
    },
    likedText: { 
        color: '#fa709a' 
    },
    
    // Create Thread
    scrollView: { flex: 1 },
    createContent: { padding: 20 },
    createInput: { 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        borderRadius: 12, 
        padding: 16, 
        color: '#fff', 
        fontSize: 16, 
        borderWidth: 1, 
        borderColor: 'rgba(255,255,255,0.1)' 
    },
    textArea: { 
        minHeight: 120, 
        textAlignVertical: 'top' 
    },
    categoryScroll: { marginBottom: 8 },
    createCategoryBadge: { 
        paddingHorizontal: 16, 
        paddingVertical: 8, 
        borderRadius: 20, 
        marginRight: 8 
    },
    selectedCategory: { 
        borderWidth: 2, 
        borderColor: '#fff' 
    },
    createCategoryText: { 
        color: '#fff', 
        fontSize: 14, 
        fontWeight: '500' 
    },
    
    // Buttons
    createButton: { 
        position: 'absolute', 
        bottom: 30, 
        right: 20, 
        borderRadius: 30, 
        overflow: 'hidden', 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.3, 
        shadowRadius: 8, 
        elevation: 8 
    },
    createButtonGradient: { 
        width: 60, 
        height: 60, 
        borderRadius: 30, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    submitButton: { 
        borderRadius: 12, 
        overflow: 'hidden', 
        marginTop: 20 
    },
    submitButtonGradient: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingVertical: 16, 
        gap: 8 
    },
    submitButtonText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: '700' 
    },
    
    // Input Groups
    inputGroup: { marginBottom: 20 },
    label: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 8 },
    required: { color: '#fa709a' },
});