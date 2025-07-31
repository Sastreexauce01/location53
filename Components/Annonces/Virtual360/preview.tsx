import React from "react";
import { Modal, TouchableOpacity, Text, View, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../Colors";
import VirtualTour from "@/app/annonces/VirtualTour";

interface ImageMetadata {
  uri: string;
  title: string;
  description: string;
}

interface PreviewModalProps {
  visible: boolean;
  images: ImageMetadata[];
  currentIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onEdit: () => void;
  onImageLoad?: () => void;
  onImageError?: (error: string) => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  visible,
  images,
  currentIndex,
  onClose,
  onPrevious,
  onNext,
  onEdit,
  onImageLoad,
  onImageError,
}) => {
  const currentImage = images[currentIndex];
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < images.length - 1;
  const hasMultipleImages = images.length > 1;

  if (!currentImage) return null;

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.previewModalContainer}>
        {/* Header */}
        <View style={styles.previewHeader}>
          <View style={styles.previewTitleContainer}>
            <Text style={styles.previewModalTitle}>
              {currentImage.title || `Scène ${currentIndex + 1}`}
            </Text>
            <Text style={styles.previewModalSubtitle}>
              {currentIndex + 1} / {images.length}
            </Text>
          </View>
          <TouchableOpacity style={styles.closePreviewButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Composant VirtualTour */}
        {/* <View style={styles.virtualTourContainer}>
          <VirtualTour
            imageMetadata={currentImage}
            showInfo={false}
            onLoad={onImageLoad}
            onError={onImageError}
          />
        </View> */}

        {/* Navigation */}
        {hasMultipleImages && (
          <View style={styles.previewNavigation}>
            <TouchableOpacity
              style={[
                styles.navButton,
                !canGoPrevious && styles.navButtonDisabled,
              ]}
              onPress={onPrevious}
              disabled={!canGoPrevious}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={!canGoPrevious ? "#666" : "white"}
              />
              <Text
                style={[
                  styles.navButtonText,
                  !canGoPrevious && styles.navButtonTextDisabled,
                ]}
              >
                Précédent
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.editButtonPreview} onPress={onEdit}>
              <Ionicons name="create" size={20} color={Colors.primary} />
              <Text style={styles.editButtonPreviewText}>Modifier</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navButton, !canGoNext && styles.navButtonDisabled]}
              onPress={onNext}
              disabled={!canGoNext}
            >
              <Text
                style={[
                  styles.navButtonText,
                  !canGoNext && styles.navButtonTextDisabled,
                ]}
              >
                Suivant
              </Text>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={!canGoNext ? "#666" : "white"}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Si une seule image, afficher seulement le bouton modifier */}
        {!hasMultipleImages && (
          <View style={styles.singleImageNavigation}>
            <TouchableOpacity style={styles.editButtonPreview} onPress={onEdit}>
              <Ionicons name="create" size={20} color={Colors.primary} />
              <Text style={styles.editButtonPreviewText}>Modifier</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  previewModalContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    zIndex: 1000,
  },
  previewTitleContainer: {
    flex: 1,
  },
  previewModalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  previewModalSubtitle: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 4,
  },
  closePreviewButton: {
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
  },
  virtualTourContainer: {
    flex: 1,
  },
  previewNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  singleImageNavigation: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
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
    color: "#666",
  },
  editButtonPreview: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  editButtonPreviewText: {
    color: Colors.primary,
    fontWeight: "500",
    marginLeft: 5,
  },
});

export default PreviewModal;
