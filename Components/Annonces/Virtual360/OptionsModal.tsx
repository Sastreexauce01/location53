import React from "react";
import { Modal, TouchableOpacity, Text, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../Colors";

interface OptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onCameraPress: () => void;
  onGalleryPress: () => void;
}

const OptionsModal: React.FC<OptionsModalProps> = ({
  visible,
  onClose,
  onCameraPress,
  onGalleryPress,
}) => {
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
          style={styles.optionsModal}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={styles.modalTitle}>Ajouter une image</Text>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={onCameraPress}
          >
            <View style={styles.optionIcon}>
              <Ionicons name="camera" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.optionText}>Prendre une photo</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={onGalleryPress}
          >
            <View style={styles.optionIcon}>
              <Ionicons name="images" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.optionText}>Choisir dans la galerie</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Annuler</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 24,
    color: "#333",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 6,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  optionIcon: {
    width: 32,
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#333",
    fontWeight: "500",
    flex: 1,
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "#fff5f5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fed7d7",
  },
  cancelText: {
    fontSize: 16,
    color: "#e53e3e",
    fontWeight: "600",
  },
});

export default OptionsModal;
