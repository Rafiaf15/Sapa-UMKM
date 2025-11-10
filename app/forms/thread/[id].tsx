import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput,
    TouchableOpacity, Alert, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
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

interface Reply {
    id: string;
    content: string;
    author: string;
    timestamp: string;
    likes: number;
}

export default function ThreadDetail() {
    const { id } = useLocalSearchParams();
    const [thread, setThread] = useState<Thread | null>(null);
    const [replies, setReplies] = useState<Reply[]>([]);
    const [newReply, setNewReply] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadThreadData();
    }, [id]);

    const loadThreadData = async () => {
        try {
            setIsLoading(true);
            const savedThreads = await AsyncStorage.getItem('forumThreads');
            const savedReplies = await AsyncStorage.getItem(`threadReplies_${id}`);
            
            if (savedThreads) {
                const threads: Thread[] = JSON.parse(savedThreads);
                const currentThread = threads.find((t: Thread) => t.id === id);
                setThread(currentThread || null);
            }
            
            if (savedReplies) {
                setReplies(JSON.parse(savedReplies));
            }
        } catch (error) {
            console.error('Error loading thread:', error);
            Alert.alert('Error', 'Gagal memuat diskusi');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddReply = async () => {
        if (!newReply.trim()) {
            Alert.alert('Error', 'Balasan tidak boleh kosong');
            return;
        }

        const reply: Reply = {
            id: Date.now().toString(),
            content: newReply,
            author: 'Anda - UMKM Anda',
            timestamp: 'Baru saja',
            likes: 0
        };

        const updatedReplies = [...replies, reply];
        setReplies(updatedReplies);
        await AsyncStorage.setItem(`threadReplies_${id}`, JSON.stringify(updatedReplies));
        
        setNewReply('');
        Alert.alert('Berhasil', 'Balasan berhasil ditambahkan');
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Memuat diskusi...</Text>
            </View>
        );
    }

    if (!thread) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Diskusi tidak ditemukan</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={['rgba(250, 112, 154, 0.2)', 'rgba(254, 225, 64, 0.2)']} style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Diskusi</Text>
            </LinearGradient>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {/* Thread Content */}
                <View style={styles.threadCard}>
                    <View style={styles.threadHeader}>
                        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(thread.category) }]}>
                            <Text style={styles.categoryText}>{thread.category}</Text>
                        </View>
                        <Text style={styles.timestamp}>{thread.timestamp}</Text>
                    </View>
                    
                    <Text style={styles.threadTitle}>{thread.title}</Text>
                    <Text style={styles.threadContent}>{thread.content}</Text>
                    
                    <View style={styles.threadFooter}>
                        <Text style={styles.author}>{thread.author}</Text>
                        <View style={styles.threadStats}>
                            <View style={styles.stat}>
                                <Ionicons name="chatbubble-outline" size={16} color="rgba(255,255,255,0.6)" />
                                <Text style={styles.statText}>{replies.length}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Replies Section */}
                <View style={styles.repliesSection}>
                    <Text style={styles.repliesTitle}>
                        {replies.length} Balasan
                    </Text>
                    
                    {replies.length === 0 ? (
                        <View style={styles.emptyReplies}>
                            <Ionicons name="chatbubble-outline" size={48} color="rgba(255,255,255,0.3)" />
                            <Text style={styles.emptyRepliesText}>Jadilah yang pertama membalas</Text>
                        </View>
                    ) : (
                        replies.map((reply) => (
                            <View key={reply.id} style={styles.replyCard}>
                                <Text style={styles.replyContent}>{reply.content}</Text>
                                <View style={styles.replyFooter}>
                                    <Text style={styles.replyAuthor}>{reply.author}</Text>
                                    <Text style={styles.replyTimestamp}>{reply.timestamp}</Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>

            {/* Reply Input */}
            <View style={styles.replyInputContainer}>
                <TextInput
                    style={styles.replyInput}
                    placeholder="Tulis balasan Anda..."
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={newReply}
                    onChangeText={setNewReply}
                    multiline
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleAddReply}>
                    <Ionicons name="send" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

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

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0e27' },
    header: { 
        paddingTop: Platform.OS === 'ios' ? 60 : 40, 
        paddingBottom: 20, 
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    backButton: { 
        width: 40, 
        height: 40, 
        borderRadius: 20, 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginRight: 16 
    },
    headerTitle: { 
        fontSize: 20, 
        fontWeight: '700', 
        color: '#fff' 
    },
    scrollView: { flex: 1 },
    content: { padding: 20 },
    threadCard: { 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        borderRadius: 12, 
        padding: 16, 
        marginBottom: 20, 
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
        fontSize: 18, 
        fontWeight: '700', 
        marginBottom: 12 
    },
    threadContent: { 
        color: 'rgba(255,255,255,0.8)', 
        fontSize: 15, 
        lineHeight: 22, 
        marginBottom: 16 
    },
    threadFooter: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
    },
    author: { 
        color: 'rgba(255,255,255,0.6)', 
        fontSize: 14 
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
        fontSize: 14 
    },
    repliesSection: { marginBottom: 100 },
    repliesTitle: { 
        color: '#fff', 
        fontSize: 18, 
        fontWeight: '700', 
        marginBottom: 16 
    },
    emptyReplies: { 
        alignItems: 'center', 
        padding: 40 
    },
    emptyRepliesText: { 
        color: 'rgba(255,255,255,0.5)', 
        marginTop: 12,
        fontSize: 14 
    },
    replyCard: { 
        backgroundColor: 'rgba(255,255,255,0.03)', 
        borderRadius: 8, 
        padding: 12, 
        marginBottom: 12,
        borderLeftWidth: 3,
        borderLeftColor: '#fa709a'
    },
    replyContent: { 
        color: 'rgba(255,255,255,0.8)', 
        fontSize: 14, 
        lineHeight: 20, 
        marginBottom: 8 
    },
    replyFooter: { 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    replyAuthor: { 
        color: 'rgba(255,255,255,0.5)', 
        fontSize: 12 
    },
    replyTimestamp: { 
        color: 'rgba(255,255,255,0.4)', 
        fontSize: 12 
    },
    replyInputContainer: { 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        flexDirection: 'row', 
        backgroundColor: 'rgba(10, 14, 39, 0.9)', 
        padding: 16, 
        borderTopWidth: 1, 
        borderTopColor: 'rgba(255,255,255,0.1)' 
    },
    replyInput: { 
        flex: 1, 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        borderRadius: 20, 
        paddingHorizontal: 16, 
        paddingVertical: 12, 
        color: '#fff', 
        fontSize: 14,
        maxHeight: 100 
    },
    sendButton: { 
        width: 44, 
        height: 44, 
        borderRadius: 22, 
        backgroundColor: '#fa709a', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginLeft: 12 
    },
    loadingText: { 
        color: 'rgba(255,255,255,0.7)', 
        textAlign: 'center', 
        marginTop: 20 
    },
    errorText: { 
        color: '#fa709a', 
        textAlign: 'center', 
        marginTop: 20,
        fontSize: 16 
    },
});