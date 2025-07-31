import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { AnnonceType, Image360, Hotspot } from '@/assets/Types/type';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface VirtualTourViewerProps {
  annonce: AnnonceType;
}

const VirtualTourViewer: React.FC<VirtualTourViewerProps> = ({ annonce }) => {
  const router = useRouter();
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const currentScene = annonce.virtualSpace[currentSceneIndex];

  const handleSceneChange = (index: number) => {
    setCurrentSceneIndex(index);
  };

  const handleSceneChangeFromHotspot = (targetSceneId: string) => {
    const sceneIndex = annonce.virtualSpace.findIndex(scene => scene.id === targetSceneId);
    if (sceneIndex !== -1) {
      setCurrentSceneIndex(sceneIndex);
    }
  };

  const handleClose = () => {
    router.back();
  };

  if (!annonce.virtualSpace || annonce.virtualSpace.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.apartmentName}>{annonce.nomAnnonce}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.noVirtualSpaceContainer}>
          <Ionicons name="camera-outline" size={64} color="#666" />
          <Text style={styles.noVirtualSpaceText}>
            Aucun espace virtuel disponible pour cette annonce
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* NIVEAU 1 - Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.apartmentName} numberOfLines={1}>
            {annonce.nomAnnonce}
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* NIVEAU 2 - Image 360° principale */}
      <View style={styles.mainImageContainer}>
        {currentScene ? (
          <View style={styles.imageViewer}>
            {/* Ici sera intégré Marzipano via WebView */}
            <View style={styles.marzipanoContainer}>
              <Text style={styles.placeholderText}>
                🌐 Marzipano WebView
              </Text>
              <Text style={styles.currentSceneTitle}>
                {currentScene.title}
              </Text>
              <Text style={styles.currentSceneDescription}>
                {currentScene.description}
              </Text>
              
              {/* Informations sur les hotspots */}
              {currentScene.hotspots && currentScene.hotspots.length > 0 && (
                <View style={styles.hotspotsInfo}>
                  <Text style={styles.hotspotsText}>
                    {currentScene.hotspots.length} point(s) de navigation
                  </Text>
                  {currentScene.hotspots.map((hotspot) => (
                    <TouchableOpacity
                      key={hotspot.id}
                      style={styles.hotspotButton}
                      onPress={() => handleSceneChangeFromHotspot(hotspot.targetSceneId)}
                    >
                      <Ionicons name="navigate" size={16} color="#fff" />
                      <Text style={styles.hotspotButtonText}>{hotspot.title}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            
            {/* Indicateur de scène actuelle */}
            <View style={styles.sceneIndicator}>
              <Text style={styles.sceneIndicatorText}>
                {currentSceneIndex + 1} / {annonce.virtualSpace.length}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.noSceneContainer}>
            <Ionicons name="camera-outline" size={64} color="#ccc" />
            <Text style={styles.noSceneText}>Aucune scène disponible</Text>
          </View>
        )}
      </View>

      {/* NIVEAU 3 - Carrousel des scènes */}
      {annonce.virtualSpace.length > 1 && (
        <View style={styles.carouselContainer}>
          <Text style={styles.carouselTitle}>Scènes disponibles</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContent}
            style={styles.carousel}
          >
            {annonce.virtualSpace.map((scene, index) => (
              <TouchableOpacity
                key={scene.id}
                style={[
                  styles.carouselItem,
                  index === currentSceneIndex && styles.carouselItemActive
                ]}
                onPress={() => handleSceneChange(index)}
              >
                <View style={styles.carouselImageContainer}>
                  <Image
                    source={{ uri: scene.uri }}
                    style={styles.carouselImage}
                    resizeMode="cover"
                  />
                  {index === currentSceneIndex && (
                    <View style={styles.activeOverlay}>
                      <Ionicons name="checkmark-circle" size={24} color="white" />
                    </View>
                  )}
                </View>
                <View style={styles.carouselItemInfo}>
                  <Text 
                    style={[
                      styles.carouselItemTitle,
                      index === currentSceneIndex && styles.carouselItemTitleActive
                    ]} 
                    numberOfLines={2}
                  >
                    {scene.title}
                  </Text>
                  {scene.hotspots && scene.hotspots.length > 0 && (
                    <Text style={styles.hotspotsIndicator}>
                      {scene.hotspots.length} connexion(s)
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Scène unique - Affichage simplifié */}
      {annonce.virtualSpace.length === 1 && (
        <View style={styles.singleSceneInfo}>
          <Text style={styles.singleSceneTitle}>{currentScene?.title}</Text>
          {currentScene?.hotspots && currentScene.hotspots.length > 0 && (
            <Text style={styles.singleSceneHotspots}>
              {currentScene.hotspots.length} point(s) d&apos;intérêt
            </Text>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  
  // NIVEAU 1 - Header
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  apartmentName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginRight: 15,
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },

  // NIVEAU 2 - Image principale
  mainImageContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  imageViewer: {
    flex: 1,
    position: 'relative',
  },
  marzipanoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  placeholderText: {
    fontSize: 24,
    color: '#666',
    marginBottom: 20,
  },
  currentSceneTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  currentSceneDescription: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 20,
  },
  hotspotsInfo: {
    alignItems: 'center',
    gap: 10,
  },
  hotspotsText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  hotspotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  hotspotButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  sceneIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  sceneIndicatorText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  noSceneContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noSceneText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
  },
  noVirtualSpaceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noVirtualSpaceText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
  },

  // NIVEAU 3 - Carrousel
  carouselContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    paddingTop: 20,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  carouselTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  carousel: {
    paddingHorizontal: 20,
  },
  carouselContent: {
    gap: 15,
  },
  carouselItem: {
    width: 120,
    alignItems: 'center',
  },
  carouselItemActive: {
    transform: [{ scale: 1.05 }],
  },
  carouselImageContainer: {
    width: 100,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  activeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 6,
  },
  carouselItemInfo: {
    marginTop: 8,
    alignItems: 'center',
  },
  carouselItemTitle: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'center',
    lineHeight: 16,
  },
  carouselItemTitleActive: {
    color: 'white',
    fontWeight: '600',
  },
  hotspotsIndicator: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },

  // Scène unique
  singleSceneInfo: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  singleSceneTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  singleSceneHotspots: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});

export default VirtualTourViewer;