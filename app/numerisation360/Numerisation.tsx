import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";


// Composants et hook
import { useNumerisationState } from "@/assets/hooks/useNumerisationState";
import ImagesGrid from "@/Components/Annonces/Virtual360/ImagesGrid";
import Panorama_captures from "@/Components/Annonces/Virtual360/Panorama_captures";
import EditModal from "@/Components/Annonces/Virtual360/EditModal";
import { Colors } from "react-native/Libraries/NewAppScreen";
import OptionsModal from "@/Components/Annonces/Virtual360/options";
import PreviewModal from "@/Components/Annonces/Virtual360/PreviewModal";

type NumerisationProps = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

const Numerisation = ({ visible, setVisible }: NumerisationProps) => {
  const {
    // États
    cameraVisible,
    setCameraVisible,
    optionsModalVisible,
    previewModalVisible,
    editModalVisible,
    selectedImages,
    selectedImageIndex,
    editingImageIndex,

    // Actions
    addImagesFromGallery,
    updateImageMetadata,
    removeImage,
    goToPreviousImage,
    goToNextImage,
    openOptionsModal,
    closeOptionsModal,
    openPreviewModal,
    closePreviewModal,
    openEditModal,
    closeEditModal,
    openCamera,
  } = useNumerisationState();

  // Handlers spécifiques
  const handleImageLoad = () => {
    console.log("Image 360° chargée avec succès !");
  };

  const handleImageError = (error: string) => {
    console.error("Erreur de chargement:", error);
  };

  const handleEditFromPreview = () => {
    closePreviewModal();
    openEditModal(selectedImageIndex);
  };

  const handleSaveEdit = (title: string, description: string) => {
    updateImageMetadata(editingImageIndex, title, description);
  };

  const handleDeleteImage = () => {
    removeImage(editingImageIndex);
  };

  return (
    <Modal visible={!visible} animationType="fade" style={styles.container}>
      {/* Header */}
      <View style={styles.head_container}>
        <Pressable onPress={() => setVisible(!visible)}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </Pressable>

        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          Sans titre
        </Text>

        <TouchableOpacity
          style={[
            styles.button,
            selectedImages.length === 0 && styles.buttonDisabled,
          ]}
          onPress={() =>
            selectedImages.length > 0 && console.log("Charger les images")
          }
          disabled={selectedImages.length === 0}
        >
          <Text style={styles.buttonText}>
            {selectedImages.length > 0
              ? `Charger (${selectedImages.length})`
              : "Charger"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Grille d'images */}
      <View style={styles.scenes_container}>
        <ImagesGrid
          images={selectedImages}
          onImagePress={openPreviewModal}
          onImageOptions={openEditModal}
          onAddMore={addImagesFromGallery}
        />
      </View>

      {/* Bouton caméra */}
      <View style={styles.options_container}>
        <Pressable style={styles.cercle_container} onPress={openOptionsModal}>
          <View style={styles.cercle}>
            <Ionicons name="camera" size={32} color="white" />
          </View>
        </Pressable>
      </View>

      {/* Modals */}
      <OptionsModal
        visible={optionsModalVisible}
        onClose={closeOptionsModal}
        onCameraPress={openCamera}
        onGalleryPress={() => {
          closeOptionsModal();
          addImagesFromGallery();
        }}
      />

      <EditModal
        visible={editModalVisible}
        imageData={selectedImages[editingImageIndex] || null}
        onClose={closeEditModal}
        onSave={handleSaveEdit}
        onDelete={handleDeleteImage}
      />

      <PreviewModal
        visible={previewModalVisible}
        images={selectedImages}
        currentIndex={selectedImageIndex}
        onClose={closePreviewModal}
        onPrevious={goToPreviousImage}
        onNext={goToNextImage}
        onEdit={handleEditFromPreview}
        onImageLoad={handleImageLoad}
        onImageError={handleImageError}
      />

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
});