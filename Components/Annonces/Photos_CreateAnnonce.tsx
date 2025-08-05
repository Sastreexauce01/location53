import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "../Colors";
import { Image } from "expo-image";
import { useAnnonce } from "@/assets/hooks/useAnnonce";

const { width } = Dimensions.get("window");
const CONTAINER_PADDING = 20;
const GAP = 12;
const IMAGES_PER_ROW = 3;
const IMAGE_SIZE =
  (width - CONTAINER_PADDING * 2 - GAP * (IMAGES_PER_ROW - 1)) / IMAGES_PER_ROW;

const Photos_CreateAnnonce = () => {
  const { annonce, saveAnnonce } = useAnnonce();
  const [loading, setLoading] = useState(false);

  // Fonction pour ouvrir la galerie et sélectionner une image
  const pickImage = async () => {
    try {
      setLoading(true);

      // Demander la permission d'accès aux photos de l'utilisateur
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission requise",
          "Nous avons besoin de la permission d'accéder à vos photos pour continuer.",
          [{ text: "OK" }]
        );
        return;
      }

      // Calculer le nombre d'images restantes à sélectionner
      const remainingSlots = 5 - annonce.image.length;

      // Ouvrir la galerie et sélectionner une image
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: remainingSlots,
        allowsEditing: false,
        quality: 0.8, // Optimiser la qualité pour réduire la taille
        aspect: [1, 1],
      });

      // Si des images sont sélectionnées, les ajouter à l'état de `annonce.image`
      if (!result.canceled && result.assets) {
        const selectedImages = result.assets.map((asset) => asset.uri);

        // Vérifier qu'on ne dépasse pas 5 images
        const totalImages = annonce.image.length + selectedImages.length;
        if (totalImages > 5) {
          Alert.alert(
            "Limite atteinte",
            "Vous ne pouvez sélectionner que 5 photos maximum.",
            [{ text: "OK" }]
          );
          return;
        }

        saveAnnonce({
          ...annonce,
          image: [...annonce.image, ...selectedImages],
        });
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Erreur",
        "Une erreur s'est produite lors de la sélection des images.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour prendre une photo avec la caméra
  const takePhoto = async () => {
    try {
      setLoading(true);

      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission requise",
          "Nous avons besoin de la permission d'accéder à votre caméra.",
          [{ text: "OK" }]
        );
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const newImage = result.assets[0].uri;

        if (annonce.image.length >= 5) {
          Alert.alert(
            "Limite atteinte",
            "Vous ne pouvez avoir que 5 photos maximum.",
            [{ text: "OK" }]
          );
          return;
        }

        saveAnnonce({
          ...annonce,
          image: [...annonce.image, newImage],
        });
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Erreur",
        "Une erreur s'est produite lors de la prise de photo.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer une photo sélectionnée
  const handleDelete = (index: number): void => {
    Alert.alert(
      "Supprimer la photo",
      "Êtes-vous sûr de vouloir supprimer cette photo ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            const updatedImages = annonce.image.filter((_, i) => i !== index);
            saveAnnonce({ ...annonce, image: updatedImages });
          },
        },
      ]
    );
  };

  // Fonction pour afficher les options d'ajout d'image
  const showImageOptions = () => {
    if (annonce.image.length >= 5) {
      Alert.alert(
        "Limite atteinte",
        "Vous avez atteint la limite de 5 photos maximum.",
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      "Ajouter une photo",
      "Comment souhaitez-vous ajouter une photo ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Galerie", onPress: pickImage },
        { text: "Caméra", onPress: takePhoto },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Section Title */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>
          Ajoutez quelques photos de votre propriété
        </Text>
        <Text style={styles.subtitle}>
          {annonce.image.length}/5 photos sélectionnées
        </Text>
      </View>

      {/* Section List image */}
      <View style={styles.contentSection}>
        <View style={styles.container_image}>
          {annonce.image.map((item, index) => (
            <View key={index} style={styles.imageWrapper}>
              {/* Section pour supprimer */}
              <Pressable
                style={styles.icone_delete}
                onPress={() => handleDelete(index)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Entypo name="cross" size={16} color={Colors.light} />
              </Pressable>

              <Image
                source={{ uri: item }}
                style={styles.image}
                contentFit="cover"
                transition={200}
              />

              {/* Indicateur de photo principale */}
              {index === 0 && (
                <View style={styles.mainPhotoIndicator}>
                  <Text style={styles.mainPhotoText}>Principal</Text>
                </View>
              )}
            </View>
          ))}

          {/* Section composant pour ajouter une image */}
          {annonce.image.length < 5 && (
            <Pressable
              onPress={showImageOptions}
              style={[
                styles.container_add_img,
                loading && styles.container_add_img_loading,
              ]}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <>
                  <MaterialIcons name="add" size={32} color={Colors.dark} />
                  <Text style={styles.addText}>Ajouter{"\n"}une photo</Text>
                </>
              )}
            </Pressable>
          )}
        </View>

        {/* Instructions */}
        <View style={styles.instructionsSection}>
          <Text style={styles.instructionsTitle}>
            Conseils pour de meilleures photos :
          </Text>
          <Text style={styles.instructionItem}>
            • La première photo sera utilisée comme photo principale
          </Text>
          <Text style={styles.instructionItem}>
            • Prenez des photos bien éclairées
          </Text>
          <Text style={styles.instructionItem}>
            • Montrez différents angles de votre propriété
          </Text>
          <Text style={styles.instructionItem}>
            • Évitez les photos floues ou trop sombres
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Photos_CreateAnnonce;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerSection: {
    marginBottom: 24,
  },

  title: {
    fontSize: 24,
    color: Colors.dark,
    fontWeight: "600",
    lineHeight: 32,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: "gray",
    fontWeight: "500",
  },

  contentSection: {
    flex: 1,
  },

  container_image: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
    marginBottom: 32,
  },

  imageWrapper: {
    position: "relative",
  },

  image: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
    borderRadius: 12,
    backgroundColor: Colors.light,
  },

  icone_delete: {
    position: "absolute",
    right: -6,
    top: -6,
    borderRadius: 12,
    zIndex: 10,
    backgroundColor: Colors.primary,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  mainPhotoIndicator: {
    position: "absolute",
    bottom: 4,
    left: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  mainPhotoText: {
    color: Colors.light,
    fontSize: 10,
    fontWeight: "600",
  },

  container_add_img: {
    backgroundColor: Colors.light,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "gray",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
    gap: 4,
  },

  container_add_img_loading: {
    opacity: 0.7,
  },

  addText: {
    fontSize: 12,
    color: Colors.dark,
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 16,
  },

  instructionsSection: {
    backgroundColor: Colors.light + "80",
    padding: 16,
    borderRadius: 12,
    gap: 6,
  },

  instructionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark,
    marginBottom: 4,
  },

  instructionItem: {
    fontSize: 14,
    color: Colors.dark,
    lineHeight: 20,
  },
});
