import React, { useState } from "react";
import { View, StyleSheet, Button, Text, FlatList, Image, Pressable } from "react-native";
import PanoramaCapture, { CaptureData } from "./PanoramaCapture";
import { MaterialIcons } from "@expo/vector-icons";

interface UploadResponse {
  success: boolean;
  message?: string;
  tourId?: string;
}

const VirtualTourCreator: React.FC = () => {
  const [cameraVisible, setCameraVisible] = useState<boolean>(false);
  const [captures, setCaptures] = useState<CaptureData[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  // Handle new capture from the PanoramaCapture component
  const handleCapture = (newCapture: CaptureData): void => {
    setCaptures(prevCaptures => [...prevCaptures, newCapture]);
  };
  
  // Delete a capture
  const deleteCapture = (index: number): void => {
    const newCaptures = [...captures];
    newCaptures.splice(index, 1);
    setCaptures(newCaptures);
  };
  
  // Upload captures to server
  const uploadCaptures = async (): Promise<void> => {
    // Implement your upload logic here
    setIsUploading(true);
    
    // Example implementation
    try {
      // Create a form data object
      const formData = new FormData();
      
      // Add each capture
      captures.forEach((capture, index) => {
        const fileName = `panorama_${index}_${capture.position}.jpg`;
        
        // Note: TypeScript may complain about this type so we need to cast
        formData.append('images', {
          uri: capture.uri,
          type: 'image/jpeg',
          name: fileName
        } as unknown as Blob);
        
        // Add position data
        formData.append('positions', JSON.stringify({
          index,
          angle: capture.position,
          rotation: capture.rotation
        }));
      });
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful response
      const mockResponse: UploadResponse = {
        success: true,
        tourId: 'tour_' + Date.now()
      };
      
      if (mockResponse.success) {
        alert('Visite virtuelle créée avec succès!');
        setCaptures([]);
      } else {
        alert('Erreur lors du téléchargement: ' + (mockResponse.message || 'Erreur inconnue'));
      }
    } catch (error) {
      alert('Erreur: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    } finally {
      setIsUploading(false);
    }
  };
  
  // Calculate completion percentage
  const completionPercentage = Math.min(Math.round((captures.length / 8) * 100), 100);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Créer une visite virtuelle 360°</Text>
        <Text style={styles.subtitle}>
          Prenez 8 photos panoramiques pour créer une visite immersive
        </Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${completionPercentage}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {captures.length}/8 captures ({completionPercentage}%)
        </Text>
      </View>
      
      {captures.length > 0 ? (
        <FlatList
          data={captures}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
          renderItem={({ item, index }) => (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.uri }} style={styles.image} />
              <View style={styles.imageOverlay}>
                <Text style={styles.imageAngle}>{Math.round(item.position)}°</Text>
                <Pressable onPress={() => deleteCapture(index)} style={styles.deleteButton}>
                  <MaterialIcons name="delete" size={20} color="white" />
                </Pressable>
              </View>
            </View>
          )}
          ListFooterComponent={
            <View style={styles.addButtonContainer}>
              <Pressable 
                onPress={() => setCameraVisible(true)}
                style={styles.addButton}
              >
                <MaterialIcons name="add-circle" size={40} color="#0066cc" />
                <Text style={styles.addButtonText}>Ajouter</Text>
              </Pressable>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <MaterialIcons name="view-in-ar" size={80} color="#cccccc" />
          <Text style={styles.emptyStateText}>
            Commencez à capturer des photos pour créer votre visite virtuelle 360°
          </Text>
          <Button 
            title="Commencer la capture" 
            onPress={() => setCameraVisible(true)} 
          />
        </View>
      )}
      
      {captures.length >= 4 && (
        <View style={styles.uploadContainer}>
          <Button 
            title={isUploading 
              ? "Création en cours..." 
              : `Créer la visite virtuelle (${captures.length} photos)`}
            onPress={uploadCaptures}
            disabled={isUploading}
            color="#28a745"
          />
        </View>
      )}
      
      <PanoramaCapture 
        visible={cameraVisible}
        setVisible={setCameraVisible}
        onCapture={handleCapture}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#6c757d",
  },
  progressContainer: {
    padding: 15,
    backgroundColor: "#ffffff",
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#e9ecef",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 5,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#0066cc",
  },
  progressText: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "right",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    textAlign: "center",
    marginVertical: 20,
    color: "#6c757d",
    fontSize: 16,
  },
  imageContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#e9ecef",
    aspectRatio: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  imageAngle: {
    color: "white",
    fontWeight: "bold",
  },
  deleteButton: {
    padding: 5,
  },
  addButtonContainer: {
    flex: 1,
    margin: 5,
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#dee2e6",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    alignItems: "center",
  },
  addButtonText: {
    marginTop: 5,
    color: "#0066cc",
  },
  uploadContainer: {
    padding: 15,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
});

export default VirtualTourCreator;


