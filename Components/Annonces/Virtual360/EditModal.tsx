import React, { useState, useEffect } from 'react';
import {
  Modal,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  Image,
  StyleSheet,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '../../Colors';

interface ImageMetadata {
  uri: string;
  title: string;
  description: string;
}

interface EditModalProps {
  visible: boolean;
  imageData: ImageMetadata | null;
  onClose: () => void;
  onSave: (title: string, description: string) => void;
  onDelete: () => void;
}

const EditModal: React.FC<EditModalProps> = ({
  visible,
  imageData,
  onClose,
  onSave,
  onDelete,
}) => {
  const [tempTitle, setTempTitle] = useState('');
  const [tempDescription, setTempDescription] = useState('');

  useEffect(() => {
    if (imageData) {
      setTempTitle(imageData.title);
      setTempDescription(imageData.description);
    }
  }, [imageData]);

  const handleSave = () => {
    onSave(tempTitle, tempDescription);
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
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
          <View style={styles.editHeader}>
            <Text style={styles.editModalTitle}>Modifier l&apos;image</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.editImagePreview}>
            <Image
              source={{ uri: imageData.uri }}
              style={styles.editPreviewImage}
            />
          </View>

          <View style={styles.editForm}>
            <Text style={styles.inputLabel}>Titre</Text>
            <TextInput
              style={styles.textInput}
              value={tempTitle}
              onChangeText={setTempTitle}
              placeholder="Nom de la scène"
              placeholderTextColor="#999"
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={tempDescription}
              onChangeText={setTempDescription}
              placeholder="Description de la scène (optionnel)"
              placeholderTextColor="#999"
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.editActions}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Ionicons name="trash" size={20} color="#ff4444" />
              <Text style={styles.deleteButtonText}>Supprimer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
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
  editModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    padding: 20,
  },
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  editModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  editImagePreview: {
    alignItems: 'center',
    marginBottom: 20,
  },
  editPreviewImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  editForm: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
  deleteButtonText: {
    color: '#ff4444',
    fontWeight: '500',
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default EditModal;