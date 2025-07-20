import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from 'expo-image-picker';
import { Colors } from "../Colors";
import Panorama_captures from "./Panorama_captures";

type props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

const Numerisation = ({ visible, setVisible }: props) => {
  const [cameraVisible, setCameraVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleCameraPress = () => {
    setOptionsModalVisible(true);
  };

  const handleCaptureOption = () => {
    setOptionsModalVisible(false);
    setCameraVisible(true);
  };

  const handleImagePress = (index: number) => {
    setSelectedImageIndex(index);
    setPreviewModalVisible(true);
  };

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission requise',
        'Nous avons besoin de l\'autorisation pour accéder à votre galerie.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const handleGalleryOption = async () => {
    setOptionsModalVisible(false);
    
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
        aspect: [2, 1], // Format panoramique pour images 360°
        allowsEditing: false,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => asset.uri);
        setSelectedImages(prev => [...prev, ...newImages]);
      }
    } catch (error) {
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la sélection des images.',
        [{ text: 'OK' }]
      );
      console.error('Erreur lors de la sélection:', error);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setSelectedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const renderSelectedImages = () => {
    if (selectedImages.length === 0) return null;

    return (
      <View style={styles.imagesPreviewContainer}>
        <Text style={styles.previewTitle}>Images 360° sélectionnées ({selectedImages.length})</Text>
        <View style={styles.imagesGrid}>
          {selectedImages.map((imageUri, index) => (
            <View key={index} style={styles.imagePreviewWrapper}>
              <TouchableOpacity 
                onPress={() => handleImagePress(index)}
                style={styles.imageContainer}
              >
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                <View style={styles.imageIndex}>
                  <Text style={styles.imageIndexText}>{index + 1}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}
              >
                <Ionicons name="close-circle" size={24} color="#ff4444" />
              </TouchableOpacity>
              <View style={styles.imageName}>
                <Text style={styles.imageNameText}>Scène {index + 1}</Text>
              </View>
            </View>
          ))}
          {/* Bouton pour ajouter plus d'images */}
          <View style={styles.imagePreviewWrapper}>
            <TouchableOpacity 
              style={styles.addMoreButton}
              onPress={handleGalleryOption}
            >
              <Ionicons name="add" size={32} color={Colors.primary} />
              <Text style={styles.addMoreText}>Ajouter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={!visible} animationType="fade" style={styles.container}>
      {/* Section Header */}
      <View style={styles.head_container}>
        <Pressable onPress={() => setVisible(!visible)}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </Pressable>

        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          Sans tittre
        </Text>
        <TouchableOpacity 
          style={[styles.button, selectedImages.length === 0 && styles.buttonDisabled]} 
          onPress={() => selectedImages.length > 0 && console.log("Charger les images")}
          disabled={selectedImages.length === 0}
        >
          <Text style={styles.buttonText}>
            {selectedImages.length > 0 ? `Charger (${selectedImages.length})` : 'Charger'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Section All scenes */}
      <View style={styles.scenes_container}>
        {selectedImages.length > 0 ? (
          renderSelectedImages()
        ) : (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="camera-outline" size={64} color="#ccc" />
            <Text style={styles.instructionText}>
              Vos numérisations apparaîtront ici. Appuyez sur le bouton de la caméra
              pour commencer à numériser avec votre iPhone ou sélectionnez des
              images 360° depuis votre galerie
            </Text>
          </View>
        )}
      </View>

      {/* Section navigation or options */}
      <View style={styles.options_container}>
        <Pressable style={styles.cercle_container} onPress={handleCameraPress}>
          <View style={styles.cercle}>
            <Ionicons name="camera" size={32} color="white" />
          </View>
        </Pressable>
      </View>

      {/* Modal d'options */}
      <Modal
        visible={optionsModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setOptionsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setOptionsModalVisible(false)}
          activeOpacity={1}
        >
          <TouchableOpacity 
            style={styles.optionsModal}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Choisir une option</Text>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleCaptureOption}
            >
              <Ionicons name="camera" size={24} color={Colors.primary} />
              <Text style={styles.optionText}>Capturer avec la caméra</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleGalleryOption}
            >
              <Ionicons name="images" size={24} color={Colors.primary} />
              <Text style={styles.optionText}>Ajouter depuis la galerie</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setOptionsModalVisible(false)}
            >
              <Text style={styles.cancelText}>Annuler</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Modal de prévisualisation simple */}
      <Modal
        visible={previewModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPreviewModalVisible(false)}
      >
        <View style={styles.previewModalOverlay}>
          <View style={styles.previewModalContainer}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewModalTitle}>
                Scène {selectedImageIndex + 1} / {selectedImages.length}
              </Text>
              <TouchableOpacity
                style={styles.closePreviewButton}
                onPress={() => setPreviewModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.previewImageContainer}>
              <Image 
                source={{ uri: selectedImages[selectedImageIndex] }} 
                style={styles.previewImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.previewNavigation}>
              <TouchableOpacity
                style={[styles.navButton, selectedImageIndex === 0 && styles.navButtonDisabled]}
                onPress={() => {
                  if (selectedImageIndex > 0) {
                    setSelectedImageIndex(selectedImageIndex - 1);
                  }
                }}
                disabled={selectedImageIndex === 0}
              >
                <Ionicons 
                  name="chevron-back" 
                  size={24} 
                  color={selectedImageIndex === 0 ? "#ccc" : "white"} 
                />
                <Text style={[styles.navButtonText, selectedImageIndex === 0 && styles.navButtonTextDisabled]}>
                  Précédent
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  removeImage(selectedImageIndex);
                  if (selectedImages.length === 1) {
                    setPreviewModalVisible(false);
                  } else if (selectedImageIndex === selectedImages.length - 1) {
                    setSelectedImageIndex(selectedImageIndex - 1);
                  }
                }}
              >
                <Ionicons name="trash" size={20} color="#ff4444" />
                <Text style={styles.deleteButtonText}>Supprimer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.navButton, selectedImageIndex === selectedImages.length - 1 && styles.navButtonDisabled]}
                onPress={() => {
                  if (selectedImageIndex < selectedImages.length - 1) {
                    setSelectedImageIndex(selectedImageIndex + 1);
                  }
                }}
                disabled={selectedImageIndex === selectedImages.length - 1}
              >
                <Text style={[styles.navButtonText, selectedImageIndex === selectedImages.length - 1 && styles.navButtonTextDisabled]}>
                  Suivant
                </Text>
                <Ionicons 
                  name="chevron-forward" 
                  size={24} 
                  color={selectedImageIndex === selectedImages.length - 1 ? "#ccc" : "white"} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Composant pour la capture */}
      <Panorama_captures
        cameraVisible={cameraVisible}
        setCameraVisible={setCameraVisible}
      />
    </Modal>
  );
};

export default Numerisation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
  },

  head_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: "auto",
    padding: 10,
    alignItems: "center",
    backgroundColor: "#ccc",
  },

  title: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },

  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 100,
    alignItems: "center",
  },

  buttonDisabled: {
    backgroundColor: "#ccc",
  },

  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },

  scenes_container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },

  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  instructionText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
    marginTop: 16,
  },

  // Styles pour la prévisualisation des images
  imagesPreviewContainer: {
    flex: 1,
  },

  previewTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },

  imagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 12,
  },

  imagePreviewWrapper: {
    width: "30%", // 3 colonnes avec des gaps
    marginBottom: 12,
    position: "relative",
  },

  imageContainer: {
    position: "relative",
  },

  imagePreview: {
    width: "100%",
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },

  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "white",
    borderRadius: 12,
    zIndex: 10,
  },

  imageIndex: {
    position: "absolute",
    top: 4,
    left: 4,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },

  imageIndexText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },

  imageName: {
    marginTop: 4,
    alignItems: "center",
  },

  imageNameText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
    textAlign: "center",
  },

  addMoreButton: {
    width: "100%",
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },

  addMoreText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "500",
    marginTop: 4,
    textAlign: "center",
  },

  options_container: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    position: "absolute",
    bottom: 50,
    right: "40%",
  },

  cercle_container: {
    height: 80,
    width: 80,
    borderWidth: 2,
    borderRadius: 40,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  cercle: {
    height: "95%",
    width: "95%",
    borderRadius: 38,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  // Styles pour le modal d'options
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },

  optionsModal: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },

  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 5,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },

  optionText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#333",
    fontWeight: "500",
    flex: 1,
  },

  cancelButton: {
    marginTop: 10,
    paddingVertical: 15,
    alignItems: "center",
  },

  cancelText: {
    fontSize: 16,
    color: "#999",
    fontWeight: "500",
  },

  // Styles pour le modal de prévisualisation
  previewModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },

  previewModalContainer: {
    width: "90%",
    height: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: 20,
  },

  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  previewModalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },

  closePreviewButton: {
    padding: 8,
  },

  previewImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },

  previewNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    minWidth: 100,
    justifyContent: "center",
  },

  navButtonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },

  navButtonText: {
    color: "white",
    fontWeight: "500",
    marginHorizontal: 5,
  },

  navButtonTextDisabled: {
    color: "#ccc",
  },

  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "rgba(255, 68, 68, 0.2)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ff4444",
  },

  deleteButtonText: {
    color: "#ff4444",
    fontWeight: "500",
    marginLeft: 5,
  },
});