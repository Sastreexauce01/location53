import React from "react";
import {
  Modal,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { WebView } from "react-native-webview";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../Colors";

interface SingleImagePreviewProps {
  visible: boolean;
  imageUrl: string;
  imageTitle?: string;
  onClose: () => void;
}

 const SingleImagePreview: React.FC<SingleImagePreviewProps> = ({
  visible,
  imageUrl,
  imageTitle = "Aperçu",
  onClose,
}) => {
  if (!visible || !imageUrl) return null;

  // URL de notre viewer simple avec juste l'image
  const viewerUrl = `https://panorama-gallery.netlify.app/viewer.html?img=${encodeURIComponent(
    "https://gnh97h9v3c.ufs.sh/f/LUi1c9wqAJMG2ELdJs8BsgvCqbN1LSjRVWkKZPc7dhwFr869"
  )}`;

  console.log("Preview URL:", viewerUrl);
  console.log(`image url`);

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.light} />

        {/* Header simple */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <Ionicons name="eye-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.title}>{imageTitle}</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={22} color={Colors.dark} />
          </TouchableOpacity>
        </View>

        {/* WebView avec le viewer simple */}
        <View style={styles.webViewContainer}>
          <WebView
            source={{ uri: viewerUrl }}
            style={styles.webView}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            allowsInlineMediaPlayback={true}
            mixedContentMode="compatibility"
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <View style={styles.loadingContent}>
                  <View style={styles.loadingIcon}>
                    <Ionicons
                      name="refresh-outline"
                      size={32}
                      color={Colors.primary}
                    />
                  </View>
                  <Text style={styles.loadingTitle}>Chargement...</Text>
                </View>
              </View>
            )}
            onLoadStart={() => {
              console.log("🚀 Début du chargement de l'image");
            }}
            onLoad={() => {
              console.log("✅ Image chargée avec succès");
            }}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.error("❌ Erreur chargement:", nativeEvent);
            }}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default SingleImagePreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.light,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 20, 89, 0.1)",
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
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
    backgroundColor: "rgba(112, 101, 240, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.dark,
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 20, 89, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  webView: {
    flex: 1,
    backgroundColor: Colors.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light,
    paddingHorizontal: 40,
  },
  loadingContent: {
    alignItems: "center",
  },
  loadingIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(112, 101, 240, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.dark,
    textAlign: "center",
  },
});
