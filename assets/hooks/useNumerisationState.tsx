import { useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image360 } from "../Types/type";
import { useAnnonce } from "./useAnnonce";

export const useNumerisationState = () => {

  
  const { annonce, saveAnnonce } = useAnnonce();

  // États pour les modals
  const [cameraVisible, setCameraVisible] = useState(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  // États pour les images
  const [selectedImages, setSelectedImages] = useState<Image360[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [editingImageIndex, setEditingImageIndex] = useState(0);

  // Utilitaires
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission requise",
        "Nous avons besoin de l'autorisation pour accéder à votre galerie.",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  // Actions pour les images
  const addImagesFromGallery = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 1,
        aspect: [2, 1],
        allowsEditing: false,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset, index) => ({
          uri: asset.uri,
          title: `Scène ${selectedImages.length + index + 1}`,
          description: "",
        }));
        setSelectedImages((prev) => [...prev, ...newImages]);
        return true;
      }
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la sélection des images.",
        [{ text: "OK" }]
      );
      console.error("Erreur lors de la sélection:", error);
      return false;
    }
    return false;
  };

  const updateImageMetadata = (
    index: number,
    title: string,
    description: string
  ) => {
    setSelectedImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, title, description } : img))
    );
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Actions pour la navigation
  const goToPreviousImage = () => {
    setSelectedImageIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNextImage = () => {
    setSelectedImageIndex((prev) =>
      Math.min(selectedImages.length - 1, prev + 1)
    );
  };

  const selectImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  // Actions pour les modals
  const openOptionsModal = () => setOptionsModalVisible(true);
  const closeOptionsModal = () => setOptionsModalVisible(false);

  const openPreviewModal = (index: number) => {
    setSelectedImageIndex(index);
    setPreviewModalVisible(true);
  };
  const closePreviewModal = () => setPreviewModalVisible(false);

  const openEditModal = (index: number) => {
    setEditingImageIndex(index);
    setEditModalVisible(true);
  };
  const closeEditModal = () => setEditModalVisible(false);

  const openCamera = () => {
    closeOptionsModal();
    setCameraVisible(true);
  };

  return {
    // États
    cameraVisible,
    setCameraVisible,
    optionsModalVisible,
    previewModalVisible,
    editModalVisible,
    selectedImages,
    selectedImageIndex,
    editingImageIndex,

    // Actions pour les images
    addImagesFromGallery,
    updateImageMetadata,
    removeImage,

    // Actions pour la navigation
    goToPreviousImage,
    goToNextImage,
    selectImage,

    // Actions pour les modals
    openOptionsModal,
    closeOptionsModal,
    openPreviewModal,
    closePreviewModal,
    openEditModal,
    closeEditModal,
    openCamera,
  };
};
