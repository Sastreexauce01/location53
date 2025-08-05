import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { WebView } from "react-native-webview";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { AnnonceType } from "@/assets/Types/type";


interface VirtualTourViewerProps {
  annonce: AnnonceType;
}

export const VirtualTourViewer: React.FC<VirtualTourViewerProps> = ({ annonce }) => {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  // Vérifier si des espaces virtuels existent
  if (!annonce.virtualSpace || annonce.virtualSpace.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#E0DEF7" />
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <Ionicons name="cube-outline" size={20} color="#4A90E2" />
            </View>
            <Text style={styles.apartmentName}>{annonce.nomAnnonce}</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.noVirtualSpaceContainer}>
          <View style={styles.emptyStateIcon}>
            <Ionicons name="camera-outline" size={64} color="#001459" />
          </View>
          <Text style={styles.noVirtualSpaceTitle}>Aucun espace virtuel</Text>
          <Text style={styles.noVirtualSpaceText}>
            Cette annonce ne dispose pas encore de visite virtuelle
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Construire l'URL avec toutes les données de l'annonce
  const tourData = {
    ...annonce,
    // On peut ajouter des métadonnées utiles
    totalScenes: annonce.virtualSpace.length,
    timestamp: Date.now()
  };

  const galleryUrl = `https://panorama-gallery.netlify.app?data=${encodeURIComponent(
    JSON.stringify(tourData)
  )}`;

  return (
    <SafeAreaView style={styles.container}>
              <StatusBar barStyle="dark-content" backgroundColor="#E0DEF7" />
      
      {/* Header élégant */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name="cube-outline" size={20} color="#7065F0" />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.apartmentName} numberOfLines={1}>
              {annonce.nomAnnonce}
            </Text>
            <Text style={styles.subtitle}>
              Visite virtuelle • {annonce.virtualSpace.length} scène{annonce.virtualSpace.length > 1 ? 's' : ''}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Ionicons name="close" size={22} color="#001459" />
        </TouchableOpacity>
      </View>

      {/* WebView avec overlay de chargement */}
      <View style={styles.webViewContainer}>
        <WebView
          source={{ uri: galleryUrl }}
          style={styles.webView}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          allowsInlineMediaPlayback={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <View style={styles.loadingContent}>
                <View style={styles.loadingIcon}>
                  <Ionicons name="refresh-outline" size={32} color="#7065F0" />
                </View>
                <Text style={styles.loadingTitle}>Chargement de la visite</Text>
                <Text style={styles.loadingText}>
                  Préparation de l&apos;expérience immersive...
                </Text>
              </View>
            </View>
          )}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.log('WebView error:', nativeEvent);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0DEF7", // light color en arrière-plan
  },

  // Header redesigné
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "rgba(224, 222, 247, 0.95)", // light color
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 20, 89, 0.15)", // dark color avec transparence
    shadowColor: "#001459", // dark color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(112, 101, 240, 0.15)", // primary color avec transparence
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  apartmentName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#001459", // dark color pour le texte
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: "rgba(0, 20, 89, 0.7)", // dark color avec transparence
    fontWeight: "500",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 20, 89, 0.1)", // dark color avec transparence
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
  },

  // WebView
  webViewContainer: {
    flex: 1,
    backgroundColor: "#E0DEF7", // light color
  },
  webView: {
    flex: 1,
    backgroundColor: "#E0DEF7", // light color
  },

  // Loading amélioré
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0DEF7", // light color
    paddingHorizontal: 40,
  },
  loadingContent: {
    alignItems: "center",
  },
  loadingIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(112, 101, 240, 0.15)", // primary color avec transparence
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#001459", // dark color pour le texte
    marginBottom: 8,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "rgba(0, 20, 89, 0.7)", // dark color avec transparence
    textAlign: "center",
    lineHeight: 20,
  },

  // État vide redesigné
  noVirtualSpaceContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    backgroundColor: "#E0DEF7", // light color
  },
  emptyStateIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(0, 20, 89, 0.1)", // dark color avec transparence
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  noVirtualSpaceTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#001459", // dark color pour le texte
    marginBottom: 12,
    textAlign: "center",
  },
  noVirtualSpaceText: {
    fontSize: 15,
    color: "rgba(0, 20, 89, 0.7)", // dark color avec transparence
    textAlign: "center",
    lineHeight: 22,
  },
});