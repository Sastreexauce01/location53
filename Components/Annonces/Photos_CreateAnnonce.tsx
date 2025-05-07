import React from "react";
import { Text, View, StyleSheet, Pressable, Alert } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Colors } from "../Colors";
import { Image } from "expo-image";
import { useAnnonce } from "@/assets/hooks/useAnnonce";


const Photos_CreateAnnonce = () => {

  const { annonce, saveAnnonce } = useAnnonce();

  // Fonction pour ouvrir la galerie et sélectionner une image
  const pickImage = async () => {
    // Demander la permission d'accès aux photos de l'utilisateur
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission de la galerie refusée",
        "Nous avons besoin de la permission d'accéder à vos photos."
      );
      return;
    }

    // Ouvrir la galerie et sélectionner une image
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true, // Permet la sélection multiple
      selectionLimit: 5,
      allowsEditing: false,
      quality: 1,
    });

    // Si des images sont sélectionnées, les ajouter à l'état de `annonce.image`
    if (!result.canceled && result.assets) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      saveAnnonce({
        ...annonce,
        image: [...annonce.image, ...selectedImages], // Ajouter les nouvelles images à l'état
      });
    }
  };

  //Fonction pour supprimer une photo selectionne
  const HandleDelete = (index: number): void => {
    const updatedImages = annonce.image.filter((_, i) => i !== index);
    saveAnnonce({ ...annonce, image: updatedImages }); // Met à jour l'état sans l'image supprimée
  };

  return (
    <View style={styles.container}>
      {/* Section Title */}
      <View>
        <Text style={styles.title}>
          Ajoutez quelques photos de votre propriete
        </Text>
      </View>

      {/* Section List image */}
      <View style={styles.container_image}>
        {annonce.image.map((item, index) => (
          <View key={index}>
            {/* Section pour supprimer */}
            <Pressable
              style={styles.icone_delete}
              onPress={() => HandleDelete(index)}
            >
              <Entypo name="cross" size={24} color={Colors.light} />
            </Pressable>
            <Image source={{ uri: item }} style={styles.image} />
          </View>
        ))}
      </View>

      {/* Section composant pour ajouter une image */}
      <Pressable
        onPress={() =>
          annonce.image.length === 5
            ? alert("Vous ne pouvez choisir que 5 photos ")
            : pickImage()
        }
        style={styles.container_add_img}
      >
        <MaterialIcons name="add" size={100} color={Colors.dark} />
      </Pressable>

      {/* Section Button */}
    </View>
  );
};

export default Photos_CreateAnnonce;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderWidth: 1,
    gap: 20,
    padding: 10,
  },
  title: {
    fontSize: 25,
    color: Colors.dark,
  },
  container_image: {
    flexDirection: "row",
    flexWrap: "wrap",

    gap: 20,
  },
  image: {
    height: 150,
    width: 150,
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  icone_delete: {
    position: "absolute",
    right: 0,
    top: -5,
    borderRadius: 5,
    zIndex: 10,
    backgroundColor: Colors.primary,
  },
  container_add_img: {
    backgroundColor: Colors.light,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    width: 150,
  },
});
