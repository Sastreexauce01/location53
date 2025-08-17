import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Colors } from "../../Colors";
import { Image360 } from "@/assets/Types/type";
import { Image } from "expo-image";

interface ImagesGridProps {
  images: Image360[];
  onImagePress: (index: number) => void;
  onImageOptions: (index: number) => void;
  onAddMore: () => void;
}

const ImagesGrid: React.FC<ImagesGridProps> = ({
  images,
  onImagePress,
  onImageOptions,
  onAddMore,
}) => {
  if (images.length === 0) {
    return (
      <View style={styles.emptyStateContainer}>
        <Ionicons name="camera-outline" size={56} color="#ccc" />
        <Text style={styles.instructionText}>
          Vos numérisations apparaîtront ici. Appuyez sur le bouton de la caméra
          pour commencer à numériser avec votre iPhone ou sélectionnez des
          images 360° depuis votre galerie
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.imagesPreviewContainer}>
      <Text style={styles.previewTitle}>
        Images 360° sélectionnées ({images.length})
      </Text>
      <View style={styles.imagesGrid}>
        {images.map((imageData, index) => (
          <View key={index} style={styles.imagePreviewWrapper}>
            <TouchableOpacity
              onPress={() => onImagePress(index)}
              style={styles.imageContainer}
            >
              <Image
                source={{ uri: imageData.panorama }}
                style={styles.imagePreview}
                contentFit="cover"
                transition={200}
              />
              <View style={styles.imageIndex}>
                <Text style={styles.imageIndexText}>{index + 1}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionsButton}
              onPress={() => onImageOptions(index)}
            >
              <SimpleLineIcons name="options-vertical" size={16} color="#666" />
            </TouchableOpacity>

            <View style={styles.imageName}>
              <Text style={styles.imageNameText} numberOfLines={1}>
                {imageData.name || `Scène ${index + 1}`}
              </Text>
            </View>
          </View>
        ))}

        {/* Bouton pour ajouter plus d'images */}
        <View style={styles.imagePreviewWrapper}>
          <TouchableOpacity style={styles.addMoreButton} onPress={onAddMore}>
            <Ionicons name="add" size={32} color={Colors.primary} />
            <Text style={styles.addMoreText}>Ajouter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  instructionText: {
    textAlign: "center",
    fontSize: 12,
    color: "#666",
    lineHeight: 22,
    marginTop: 16,
  },
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
    width: "30%",
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
  optionsButton: {
    position: "absolute",
    top: -6,
    right: -8,
    backgroundColor: "white",
    borderRadius: 40,
    padding: 3,
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
});

export default ImagesGrid;
