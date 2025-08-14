import {
  Text,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { Colors } from "./Colors";
import { useEffect, useRef } from "react";

type props = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  onModifier?: () => void;
  onSupprimer?: () => void;
};

const { height: screenHeight } = Dimensions.get("window");

const Options_Modal = ({
  modalVisible,
  setModalVisible,
  onModifier,
  onSupprimer,
}: props) => {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    if (modalVisible) {
      // Animation d'entrée - slide du bas vers le haut
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      // Animation de sortie - slide vers le bas
      Animated.timing(slideAnim, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible, slideAnim]);

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleModifier = () => {
    closeModal();
    onModifier && onModifier();
  };

  const handleSupprimer = () => {
    closeModal();
    onSupprimer && onSupprimer();
  };

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={closeModal}
        />

        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <View style={styles.dragIndicator} />
            <Text style={styles.modalTitle}>Options</Text>
          </View>

          <View style={styles.modalContent}>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleModifier}
              activeOpacity={0.7}
            >
              <Text style={styles.actionText}>Modifier</Text>
            </TouchableOpacity>

            

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleSupprimer}
              activeOpacity={0.7}
            >
              <Text style={[styles.actionText, styles.deleteText]}>
                Supprimer
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={closeModal}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>Annuler</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default Options_Modal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },

  overlayTouchable: {
    flex: 1,
  },

  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: screenHeight * 0.6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },

  modalHeader: {
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
    marginBottom: 15,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.dark,
  },

  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  actionButton: {
    paddingVertical: 18,
    alignItems: "center",
  },

  actionText: {
    fontSize: 16,
    color: Colors.dark,
    fontWeight: "500",
  },

  deleteText: {
    color: "#ff4757",
  },

  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginHorizontal: -20,
  },

  cancelButton: {
    marginTop: 10,
    marginHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    alignItems: "center",
  },

  cancelText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "500",
  },
});
