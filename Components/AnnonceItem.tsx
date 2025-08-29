import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ImageBackground,
  Pressable,
} from "react-native";

import { Colors } from "./Colors";
import { SimpleLineIcons } from "@expo/vector-icons";
import Options_Modal from "./Options_Modal";
import Loading from "@/assets/ui/Loading";
import { AnnonceType } from "@/assets/Types/type";
import useAnnonce_Data from "@/assets/hooks/useAnnonce_Data";
import { useRouter } from "expo-router";

type Props = {
  item: AnnonceType;
  onRefresh?: () => void; // Nouvelle prop pour le rafraîchissement
};

export const AnnonceItem = ({ item, onRefresh }: Props) => {
  const [isLoading, setIsLoading] = useState(true); // État de chargement
  const [modalVisible, setModalVisible] = useState(false); // État du modal
  const { handleUpdate, handleDelete } = useAnnonce_Data();
  
  const date_creation = new Date(item.date_creation).toLocaleDateString(
    "fr-FR",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const router = useRouter();

  // Fonction pour obtenir la couleur du badge selon le statut
  const getBadgeColor = (status: string) => {
    switch (status) {
      case "approved":
        return "#4CAF50"; // Vert
      case "rejected":
        return "#F44336"; // Rouge
      case "pending":
      default:
        return "#FF9800"; // Orange
    }
  };

  // Fonction pour obtenir le texte du badge selon le statut
  const getBadgeText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approuvée";
      case "rejected":
        return "Rejetée";
      case "pending":
      default:
        return "En attente";
    }
  };


  
  const handleDeleteAnnonce = async () => {
    try {
      const success = await handleDelete(item.id);
      if (success && onRefresh) {
        // Rafraîchir la page parent après suppression réussie
        onRefresh();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Image avec indicateur de chargement */}
      <View style={styles.imageContainer}>
        {isLoading && <Loading />}
        <ImageBackground
          source={{ uri: item.image[0] }}
          style={styles.image}
          resizeMode="cover"
          onLoadEnd={() => setIsLoading(false)}
        >
          <View style={styles.overlay}>
            {/* Badge de statut */}
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getBadgeColor(item.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getBadgeText(item.status)}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* Informations sur l'annonce */}
      <View style={styles.container_information}>
        <View style={styles.container_title_options}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {item.nomAnnonce}
          </Text>
          <Pressable onPress={() => setModalVisible(true)}>
            <SimpleLineIcons name="options" size={20} color={Colors.dark} />
          </Pressable>
        </View>

        <Text style={styles.date}>{date_creation}</Text>
      </View>

      {/* MODAL */}
      <Options_Modal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onModifier={() => {
          // Logique de modification
          console.log("Modifier action");
          handleUpdate(item.id);
          router.push("/annonces/CreateAnnonce");
        }}
        onSupprimer={handleDeleteAnnonce}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // borderRadius: 10,
    overflow: "hidden",
    gap: 5,
    height: "100%",
    width: "100%",
    justifyContent: "space-between",
  },

  imageContainer: {
    borderRadius: 10,
    position: "relative",
    height: 140,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
    overflow: "hidden",
  },

  loader: {
    position: "absolute",
    zIndex: 1,
  },

  image: {
    height: 140,
    width: "100%",
    justifyContent: "flex-start",
  },

  overlay: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop: 8,
    paddingHorizontal: 8,
  },

  // Styles pour le badge de statut
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },

  statusText: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
  },

  tag: {
    backgroundColor: Colors.light,
    padding: 4,
    borderRadius: 5,
  },

  container_title_options: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  container_information: {
    gap: 5,
    padding: 2,
    flexDirection: "column",
    justifyContent: "space-between",
  },

  title: {
    color: Colors.dark,
    fontSize: 15,
    fontWeight: "500",
    width: "75%",
  },

  date: {
    fontSize: 10,
    color: "back",
    opacity: 0.5,
  },

  /* Styles du modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalView: {
    width: 250,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },

  modalButton: {
    width: "100%",
    padding: 10,
    alignItems: "center",
  },

  modalText: {
    fontSize: 16,
    color: Colors.dark,
  },

  closeText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.primary,
  },
});