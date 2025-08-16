import React, { useState, useEffect } from "react";
import {
  Modal,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import { WebView } from "react-native-webview";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../Colors";
import { Image360 } from "@/assets/Types/type";
import { Picker } from "@react-native-picker/picker";

interface EditModalProps {
  visible: boolean;
  imageData: Image360;
  images: Image360[];
  index: number;
  onClose: () => void;
  onSave: (updatedImage: Image360) => void;
  onDelete: () => void;
}

const EditModal: React.FC<EditModalProps> = ({
  visible,
  imageData,
  images,
  onClose,
  onSave,
  onDelete,
}) => {
  const [imageIndex, setImageIndex] = useState<Image360>(imageData);

  // Mettre à jour l'état local quand imageData change
  useEffect(() => {
    setImageIndex(imageData);
  }, [imageData]);

  // Encodage en string URL-safe demo data
  const encodedData = encodeURIComponent(JSON.stringify(imageData));
  const url = `http://192.168.0.2:3000/image360?data=${encodedData}`;
  
  console.log("✅Donnee ", imageIndex);

  const handleSave = () => {
    console.log("✅Donnee ", imageIndex);
    onSave(imageIndex);
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  const updateImageIndex = (field: string, value: any) => {
    if (field === "navigationTo") {
      setImageIndex((prev) => ({
        ...prev,
        links: [
          ...(prev.links || []),
          { nodeId: value, position: { yaw: 0, pitch: 0 } },
        ],
      }));
    }

    setImageIndex((prev) => ({
      ...prev,
      [field]: value,
    }));
    console.log("✅Donne", imageIndex);
  };

  if (!imageData) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        onPress={onClose}
        activeOpacity={1}
      >
        <TouchableOpacity
          style={styles.editModal}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.editHeader}>
            <Text style={styles.editModalTitle}>Modifier la scène 360°</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 1. WebView Panorama 360° */}
            <View style={styles.webViewContainer}>
              <Text style={styles.sectionTitle}>Aperçu 360°</Text>
              <View style={styles.webViewWrapper}>
                <WebView
                  source={{ uri: url }}
                  style={styles.webView}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  allowsInlineMediaPlayback={true}
                  mediaPlaybackRequiresUserAction={false}
                  scrollEnabled={false}
                  bounces={false}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </View>

            <View style={styles.editForm}>
              {/* 2. Titre */}
              <View style={styles.inputSection}>
                <View style={styles.labelContainer}>
                  <Ionicons name="text" size={20} color={Colors.primary} />
                  <Text style={styles.inputLabel}>Titre de la scène</Text>
                </View>
                <TextInput
                  style={styles.textInput}
                  value={imageIndex.name || ""}
                  onChangeText={(text) => updateImageIndex("name", text)}
                  placeholder="Entrez le nom de la scène"
                  placeholderTextColor="#999"
                />
              </View>

              {/* 3. Description */}
              <View style={styles.inputSection}>
                <View style={styles.labelContainer}>
                  <Ionicons
                    name="document-text"
                    size={20}
                    color={Colors.primary}
                  />
                  <Text style={styles.inputLabel}>Description</Text>
                </View>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={imageIndex.caption || ""}
                  onChangeText={(text) => updateImageIndex("caption", text)}
                  placeholder="Décrivez cette scène 360° (optionnel)"
                  placeholderTextColor="#999"
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              {/* 4. Navigation vers */}
              <View style={styles.inputSection}>
                <View style={styles.labelContainer}>
                  <Ionicons name="navigate" size={20} color={Colors.primary} />
                  <Text style={styles.inputLabel}>Navigation vers</Text>
                </View>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={""}
                    onValueChange={(itemValue) =>
                      updateImageIndex("navigationTo", itemValue)
                    }
                    style={styles.picker}
                  >
                    <Picker.Item
                      label="Aucune navigation"
                      value=""
                      color="#999"
                    />
                    {images
                      .filter((item) => item.id !== imageData.id) // Exclure l'image actuelle
                      .map((item) => (
                        <Picker.Item
                          label={item.name || `Scène ${item.id}`}
                          value={item.id}
                          key={item.id}
                          color="#333"
                        />
                      ))}
                  </Picker>
                </View>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
              >
                <Ionicons name="trash" size={20} color="#ff4444" />
                <Text style={styles.deleteButtonText}>Supprimer</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Ionicons name="checkmark" size={20} color="white" />
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  editModal: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "95%",
    paddingBottom: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  editHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  editModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 10,
  },
  webViewContainer: {
    marginBottom: 25,
  },
  webViewWrapper: {
    height: 300,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f8f8f8",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  webView: {
    flex: 1,
  },
  editForm: {
    marginBottom: 20,
  },
  inputSection: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
    color: "#333",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    backgroundColor: "#fafafa",
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    gap: 15,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#ff4444",
    flex: 1,
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "#ff4444",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    flex: 1,
    elevation: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default EditModal;
