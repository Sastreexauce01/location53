import React from 'react';
import {
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../Colors';

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
          <Text style={styles.modalTitle}>Choisir une option</Text>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={onCameraPress}
          >
            <Ionicons name="camera" size={24} color={Colors.primary} />
            <Text style={styles.optionText}>Capturer avec la caméra</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={onGalleryPress}
          >
            <Ionicons name="images" size={24} color={Colors.primary} />
            <Text style={styles.optionText}>Ajouter depuis la galerie</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
          >
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  optionsModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 5,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
});

export default OptionsModal;