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

  // États pour les images (synchronisé avec l'annonce)
  const [selectedImages, setSelectedImages] = useState<Image360[]>(
    annonce.virtualSpace || []
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [editingImageIndex, setEditingImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Génération d'ID unique pour chaque image
  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  // Fonction utilitaire pour synchroniser les images avec l'annonce
  const syncWithAnnonce = (newImages: Image360[]) => {
    setSelectedImages(newImages);
    saveAnnonce({
      ...annonce,
      virtualSpace: newImages
    });
  };

  // Utilitaires
  const requestPermission = async () => {
    try {
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
    } catch (error) {
      console.error("Erreur de permission:", error);
      return false;
    }
  };

  // Actions pour les images
  const addImagesFromGallery = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return false;

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        aspect: [2, 1],
        allowsEditing: false,
      });

      if (!result.canceled && result.assets) {
        const newImages: Image360[] = result.assets.map((asset, index) => ({
          id: generateId(),
          uri: asset.uri,
          title: `Scène ${selectedImages.length + index + 1}`,
          description: "",
        }));

        const updatedImages = [...selectedImages, ...newImages];
        syncWithAnnonce(updatedImages);

        // Message de succès
        Alert.alert(
          "Images ajoutées",
          `${newImages.length} image(s) ajoutée(s) avec succès`,
          [{ text: "OK" }]
        );

        return true;
      }
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la sélection des images.",
        [{ text: "OK" }]
      );
      console.error("Erreur lors de la sélection:", error);
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  // Mettre à jour les métadonnées d'une image par index
  const updateImageMetadata = (index: number, title: string, description: string) => {
    const updatedImages = selectedImages.map((img, i) => 
      i === index ? { ...img, title, description } : img
    );
    syncWithAnnonce(updatedImages);
  };

  // Mettre à jour une image par ID (plus sûr)
  const updateImageById = (id: string, title: string, description: string) => {
    const updatedImages = selectedImages.map((img) =>
      img.id === id ? { ...img, title, description } : img
    );
    syncWithAnnonce(updatedImages);
  };

  // Supprimer une image par index
  const removeImage = (index: number) => {
    Alert.alert(
      "Supprimer l'image",
      "Êtes-vous sûr de vouloir supprimer cette image ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            const updatedImages = selectedImages.filter((_, i) => i !== index);
            syncWithAnnonce(updatedImages);
          },
        },
      ]
    );
  };

  // Supprimer une image par ID
  const removeImageById = (id: string) => {
    Alert.alert(
      "Supprimer l'image",
      "Êtes-vous sûr de vouloir supprimer cette image ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            const updatedImages = selectedImages.filter((img) => img.id !== id);
            syncWithAnnonce(updatedImages);
          },
        },
      ]
    );
  };

  // Réorganiser les images (drag & drop)
  const reorderImages = (fromIndex: number, toIndex: number) => {
    const updatedImages = [...selectedImages];
    const [movedImage] = updatedImages.splice(fromIndex, 1);
    updatedImages.splice(toIndex, 0, movedImage);
    syncWithAnnonce(updatedImages);
  };

  // Effacer toutes les images
  const clearAllImages = () => {
    Alert.alert(
      "Effacer tout",
      "Êtes-vous sûr de vouloir supprimer toutes les images ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Effacer",
          style: "destructive",
          onPress: () => {
            syncWithAnnonce([]);
          },
        },
      ]
    );
  };

  // Ajouter une image depuis la caméra (à implémenter avec votre composant caméra)
  const addImageFromCamera = (imageUri: string, title?: string) => {
    const newImage: Image360 = {
      id: generateId(),
      uri: imageUri,
      title: title || `Scène ${selectedImages.length + 1}`,
      description: "",
    };

    const updatedImages = [...selectedImages, newImage];
    syncWithAnnonce(updatedImages);
  };

  // Dupliquer une image
  const duplicateImage = (index: number) => {
    const imageToDuplicate = selectedImages[index];
    if (!imageToDuplicate) return;

    const duplicatedImage: Image360 = {
      ...imageToDuplicate,
      id: generateId(),
      title: `${imageToDuplicate.title} (Copie)`,
    };

    const updatedImages = [...selectedImages];
    updatedImages.splice(index + 1, 0, duplicatedImage);
    syncWithAnnonce(updatedImages);
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

  // Sauvegarder explicitement l'annonce (optionnel, déjà fait automatiquement)
  const saveCurrentState = () => {
    saveAnnonce({
      ...annonce,
      virtualSpace: selectedImages
    });
  };

  // Réinitialiser aux données de l'annonce
  const resetToAnnonceData = () => {
    setSelectedImages(annonce.virtualSpace || []);
  };

  return {
    // Données
    annonce,
    
    // États
    cameraVisible,
    setCameraVisible,
    optionsModalVisible,
    previewModalVisible,
    editModalVisible,
    selectedImages,
    selectedImageIndex,
    editingImageIndex,
    isLoading,

    // Actions pour les images
    addImagesFromGallery,
    addImageFromCamera,
    updateImageMetadata,
    updateImageById,
    removeImage,
    removeImageById,
    reorderImages,
    duplicateImage,
    clearAllImages,

    // Actions pour les modals
    openOptionsModal,
    closeOptionsModal,
    openPreviewModal,
    closePreviewModal,
    openEditModal,
    closeEditModal,
    openCamera,

    // Utilitaires
    saveCurrentState,
    resetToAnnonceData,
    syncWithAnnonce,
  };
};