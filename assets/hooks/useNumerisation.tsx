import { useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Image360 } from "../Types/type";
import { useAnnonce } from "./useAnnonce";
import { supabase } from "@/utils/supabase";
import * as FileSystem from "expo-file-system";
import { Buffer } from "buffer";



export const uploadImage = async (imgUri: string): Promise<string> => {
    try {
      if (!imgUri) return "";

      // Extraire l'extension et créer un nom unique
      const fileExt = imgUri.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}.${fileExt}`;

      // Lire le fichier local en base64
      const base64 = await FileSystem.readAsStringAsync(imgUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convertir Base64 en Uint8Array
      const uint8Array = new Uint8Array(Buffer.from(base64, "base64"));

      // Upload vers Supabase Storage
      const { data, error } = await supabase.storage
        .from("publics")
        .upload(fileName, uint8Array, {
          contentType: `image/${fileExt}`,
          upsert: false,
        });

      if (error) {
        console.error("❌ Erreur Supabase:", error);
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error("Pas de données retournées");
      }

      // Obtenir l'URL publique
      const { data: publicData } = supabase.storage
        .from("publics")
        .getPublicUrl(data.path);

      console.log(`✅ Image uploadée: ${publicData.publicUrl}`);

      return publicData.publicUrl;
    } catch (err) {
      console.error("❌ Erreur upload :", err);
      return ""; // Retourner null en cas d'erreur
    }
  };

  
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
  const generateId = () =>
    Date.now().toString() + Math.random().toString(36).substr(2, 9);

  // Fonction utilitaire pour synchroniser les images avec l'annonce
  const syncWithAnnonce = (newImages: Image360[]) => {
    setSelectedImages(newImages);
    saveAnnonce({
      ...annonce,
      virtualSpace: newImages,
    });
  };

  // Utilitaires
  const requestPermission = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
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

// export const uploadImage = async (imgUri: string): Promise<string> => {
//     try {
//       if (!imgUri) return "";

//       // Extraire l'extension et créer un nom unique
//       const fileExt = imgUri.split(".").pop()?.toLowerCase() || "jpg";
//       const fileName = `${Date.now()}-${Math.random()
//         .toString(36)
//         .substr(2, 9)}.${fileExt}`;

//       // Lire le fichier local en base64
//       const base64 = await FileSystem.readAsStringAsync(imgUri, {
//         encoding: FileSystem.EncodingType.Base64,
//       });

//       // Convertir Base64 en Uint8Array
//       const uint8Array = new Uint8Array(Buffer.from(base64, "base64"));

//       // Upload vers Supabase Storage
//       const { data, error } = await supabase.storage
//         .from("publics")
//         .upload(fileName, uint8Array, {
//           contentType: `image/${fileExt}`,
//           upsert: false,
//         });

//       if (error) {
//         console.error("❌ Erreur Supabase:", error);
//         throw new Error(error.message);
//       }

//       if (!data) {
//         throw new Error("Pas de données retournées");
//       }

//       // Obtenir l'URL publique
//       const { data: publicData } = supabase.storage
//         .from("publics")
//         .getPublicUrl(data.path);

//       console.log(`✅ Image uploadée: ${publicData.publicUrl}`);

//       return publicData.publicUrl;
//     } catch (err) {
//       console.error("❌ Erreur upload :", err);
//       return ""; // Retourner null en cas d'erreur
//     }
//   };




  // Actions pour les images
  const addImagesFromGallery = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return false;

    setIsLoading(true);

    try {
      // clearAllImages();
      // resetToAnnonceData();

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 0.8,
        aspect: [2, 1],
        allowsEditing: false,
      });

      if (!result.canceled && result.assets) {
        const newImages: Image360[] = await Promise.all(
          result.assets.map(async (asset, index) => {
            const imgSupabase = await uploadImage(asset.uri);

            return {
              id: generateId(),
              panorama: imgSupabase || "", // URL de l'image uploadée
              thumbnail: imgSupabase, // Miniature générée
              name: `Scène ${selectedImages.length + index + 1}`, // Nom donné par l'utilisateur
              caption: "", // Description
              links: [
                {
                  nodeId: "",
                  position: {
                    yaw: 0,
                    pitch: 0,
                  },
                },
              ],
            };
          })
        );

        const updatedImages = [...selectedImages, ...newImages];
        syncWithAnnonce(updatedImages);
        console.log("Donnee nouvelle image ✅", newImages);

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
  const updateImageMetadata = (image360: Image360) => {
    const updatedImages = selectedImages.map((img) =>
      img.id === image360.id ? { ...img, ...image360 } : img
    );
    syncWithAnnonce(updatedImages);
    console.log("✅ image mise a jour");
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
    syncWithAnnonce([]);
    // Alert.alert(
    //   "Effacer tout",
    //   "Êtes-vous sûr de vouloir supprimer toutes les images ?",
    //   [
    //     { text: "Annuler", style: "cancel" },
    //     {
    //       text: "Effacer",
    //       style: "destructive",
    //       onPress: () => {
    //         syncWithAnnonce([]);
    //       },
    //     },
    //   ]
    // );
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
      virtualSpace: selectedImages,
    });
  };

  // Réinitialiser aux données de l'annonce
  const resetToAnnonceData = () => {
    setSelectedImages(annonce.virtualSpace || []);
  };

  return {
    // chargement

    isLoading,

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

    // Actions pour les images
    addImagesFromGallery,

    updateImageMetadata,
    updateImageById,
    removeImage,
    removeImageById,
    reorderImages,
    // duplicateImage,
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
