import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert, Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface Material {
    type: 'video' | 'pdf' | 'quiz' | 'assignment';
    title: string;
    duration?: string;
    completed: boolean;
}

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
    materials: Material[];
}

export default function ModuleDetail() {
    const { id } = useLocalSearchParams();
    const [module, setModule] = useState<Module | null>(null);
    const [currentMaterial, setCurrentMaterial] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadModuleData();
    }, [id]);

    const loadModuleData = async () => {
        try {
            setIsLoading(true);
            const savedModules = await AsyncStorage.getItem('eLearningModules');
            
            if (savedModules) {
                const modules: Module[] = JSON.parse(savedModules);
                const currentModule = modules.find(m => m.id === id);
                setModule(currentModule || null);
            }
        } catch (error) {
            console.error('Error loading module:', error);
            Alert.alert('Error', 'Gagal memuat modul');
        } finally {
            setIsLoading(false);
        }
    };

    const markMaterialComplete = async (materialIndex: number) => {
        if (!module) return;

        const updatedMaterials = [...module.materials];
        updatedMaterials[materialIndex] = {
            ...updatedMaterials[materialIndex],
            completed: true
        };

        const updatedModule: Module = {
            ...module,
            materials: updatedMaterials,
            completedLessons: updatedMaterials.filter(m => m.completed).length
        };

        setModule(updatedModule);

        // Update in storage
        const savedModules = await AsyncStorage.getItem('eLearningModules');
        if (savedModules) {
            const modules: Module[] = JSON.parse(savedModules);
            const updatedModules = modules.map(m => 
                m.id === module.id ? updatedModule : m
            );
            await AsyncStorage.setItem('eLearningModules', JSON.stringify(updatedModules));
        }

        Alert.alert('Berhasil', 'Materi ditandai sebagai selesai!');
    };

    const getMaterialIcon = (type: Material['type']): keyof typeof Ionicons.glyphMap => {
        const icons: Record<Material['type'], keyof typeof Ionicons.glyphMap> = {
            'video': 'play-circle',
            'pdf': 'document-text',
            'quiz': 'help-circle',
            'assignment': 'create'
        };
        return icons[type];
    };

    const getMaterialColor = (type: Material['type']) => {
        const colors = {
            'video': '#FF3B30',
            'pdf': '#007AFF',
            'quiz': '#FF9500',
            'assignment': '#4CD964'
        };
        return colors[type];
    };

    const handleMaterialAction = (material: Material) => {
        switch (material.type) {
            case 'video':
                Alert.alert('Video', `Memutar video: ${material.title}`);
                // Implement video player here
                break;
            case 'pdf':
                Alert.alert('PDF', `Membuka PDF: ${material.title}`);
                // Implement PDF viewer here
                break;
            case 'quiz':
                Alert.alert('Quiz', `Memulai quiz: ${material.title}`);
                // Implement quiz here
                break;
            case 'assignment':
                Alert.alert('Tugas', `Membuka tugas: ${material.title}`);
                // Implement assignment here
                break;
        }
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Memuat modul...</Text>
            </View>
        );
    }

    if (!module) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Modul tidak ditemukan</Text>
            </View>
        );
    }

    const progress = (module.completedLessons / module.materials.length) * 100;

    return (
        <View style={styles.container}>
            <LinearGradient colors={['rgba(250, 112, 154, 0.2)', 'rgba(254, 225, 64, 0.2)']} style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Modul Pembelajaran</Text>
            </LinearGradient>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {/* Module Header */}
                <View style={styles.moduleHeader}>
                    <Text style={styles.moduleTitle}>{module.title}</Text>
                    <Text style={styles.moduleDescription}>{module.description}</Text>
                    
                    <View style={styles.moduleMeta}>
                        <View style={styles.metaItem}>
                            <Ionicons name="person-outline" size={16} color="rgba(255,255,255,0.6)" />
                            <Text style={styles.metaText}>{module.instructor}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.6)" />
                            <Text style={styles.metaText}>{module.duration}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Ionicons name="play-circle-outline" size={16} color="rgba(255,255,255,0.6)" />
                            <Text style={styles.metaText}>{module.materials.length} materi</Text>
                        </View>
                    </View>

                    {/* Progress */}
                    <View style={styles.progressContainer}>
                        <View style={styles.progressHeader}>
                            <Text style={styles.progressLabel}>Progress Belajar</Text>
                            <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
                        </View>
                        <View style={styles.progressBar}>
                            <View 
                                style={[
                                    styles.progressFill, 
                                    { width: `${progress}%` }
                                ]} 
                            />
                        </View>
                        <Text style={styles.progressText}>
                            {module.completedLessons} dari {module.materials.length} materi selesai
                        </Text>
                    </View>
                </View>

                {/* Materials List */}
                <View style={styles.materialsSection}>
                    <Text style={styles.sectionTitle}>Materi Pembelajaran</Text>
                    
                    {module.materials.map((material, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.materialItem,
                                material.completed && styles.materialItemCompleted
                            ]}
                            onPress={() => handleMaterialAction(material)}
                        >
                            <View style={styles.materialLeft}>
                                <View 
                                    style={[
                                        styles.materialIcon,
                                        { backgroundColor: getMaterialColor(material.type) }
                                    ]}
                                >
                                    <Ionicons 
                                        name={getMaterialIcon(material.type)} 
                                        size={20} 
                                        color="#fff" 
                                    />
                                </View>
                                <View style={styles.materialInfo}>
                                    <Text style={styles.materialTitle}>{material.title}</Text>
                                    {material.duration && (
                                        <Text style={styles.materialDuration}>{material.duration}</Text>
                                    )}
                                </View>
                            </View>
                            
                            <View style={styles.materialRight}>
                                {material.completed ? (
                                    <Ionicons name="checkmark-circle" size={24} color="#4CD964" />
                                ) : (
                                    <TouchableOpacity 
                                        style={styles.completeButton}
                                        onPress={() => markMaterialComplete(index)}
                                    >
                                        <Ionicons name="checkmark" size={16} color="#fff" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity 
                        style={styles.continueButton}
                        onPress={() => {
                            const nextMaterial = module.materials.findIndex(m => !m.completed);
                            if (nextMaterial !== -1) {
                                handleMaterialAction(module.materials[nextMaterial]);
                            } else {
                                Alert.alert('Selamat!', 'Anda telah menyelesaikan semua materi dalam modul ini.');
                            }
                        }}
                    >
                        <Ionicons name="play" size={20} color="#fff" />
                        <Text style={styles.continueButtonText}>
                            {module.completedLessons === module.materials.length 
                                ? 'Modul Selesai' 
                                : 'Lanjutkan Belajar'
                            }
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

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
    
    // Module Header
    moduleHeader: { 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        borderRadius: 12, 
        padding: 16, 
        marginBottom: 20 
    },
    moduleTitle: { 
        color: '#fff', 
        fontSize: 22, 
        fontWeight: '700', 
        marginBottom: 8 
    },
    moduleDescription: { 
        color: 'rgba(255,255,255,0.8)', 
        fontSize: 15, 
        lineHeight: 22, 
        marginBottom: 16 
    },
    moduleMeta: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 16 
    },
    metaItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 6 
    },
    metaText: { 
        color: 'rgba(255,255,255,0.6)', 
        fontSize: 12 
    },
    
    // Progress
    progressContainer: { 
        backgroundColor: 'rgba(255,255,255,0.03)', 
        borderRadius: 8, 
        padding: 12 
    },
    progressHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 8 
    },
    progressLabel: { 
        color: 'rgba(255,255,255,0.7)', 
        fontSize: 14 
    },
    progressPercentage: { 
        color: '#fff', 
        fontSize: 14, 
        fontWeight: '600' 
    },
    progressBar: { 
        height: 6, 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        borderRadius: 3, 
        marginBottom: 6 
    },
    progressFill: { 
        height: '100%', 
        backgroundColor: '#fa709a', 
        borderRadius: 3 
    },
    progressText: { 
        color: 'rgba(255,255,255,0.5)', 
        fontSize: 12 
    },
    
    // Materials Section
    materialsSection: { 
        marginBottom: 20 
    },
    sectionTitle: { 
        color: '#fff', 
        fontSize: 18, 
        fontWeight: '700', 
        marginBottom: 16 
    },
    materialItem: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        backgroundColor: 'rgba(255,255,255,0.05)', 
        borderRadius: 8, 
        padding: 12, 
        marginBottom: 8 
    },
    materialItemCompleted: { 
        backgroundColor: 'rgba(76, 217, 100, 0.1)' 
    },
    materialLeft: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        flex: 1 
    },
    materialIcon: { 
        width: 40, 
        height: 40, 
        borderRadius: 8, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginRight: 12 
    },
    materialInfo: { 
        flex: 1 
    },
    materialTitle: { 
        color: '#fff', 
        fontSize: 14, 
        fontWeight: '600', 
        marginBottom: 2 
    },
    materialDuration: { 
        color: 'rgba(255,255,255,0.5)', 
        fontSize: 12 
    },
    materialRight: { 
        marginLeft: 12 
    },
    completeButton: { 
        width: 32, 
        height: 32, 
        borderRadius: 16, 
        backgroundColor: '#fa709a', 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    
    // Action Buttons
    actionButtons: { 
        marginBottom: 40 
    },
    continueButton: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#fa709a', 
        paddingVertical: 16, 
        borderRadius: 12, 
        gap: 8 
    },
    continueButtonText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: '600' 
    },
    
    // Loading & Error
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