import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";

import { AnnonceItem } from "@/Components/AnnonceItem";
import { useRouter } from "expo-router";
import { Colors } from "@/Components/Colors";
import { FontAwesome6 } from "@expo/vector-icons";
import useAuth from "@/assets/hooks/useAuth";

import useAnnonce_Data from "@/assets/hooks/useAnnonce_Data";

export default function Annonces() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const { listAppartments, isLoadingAnnonces } = useAnnonce_Data();

  // Écran de chargement pour l'authentification
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  // Si pas authentifié, ne rien afficher
  if (!isAuthenticated || !user) {
    return null;
  }

  // Écran de chargement pour les annonces
  if (isLoadingAnnonces) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Chargement des annonces...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Scrollable Section */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container_annonce}>
          {/* ✅ CORRECTION MAJEURE: utiliser listAppartments au lieu de Data_Appartements */}
          {listAppartments.length === 0 ? (
            <View style={styles.noAnnonceContainer}>
              <FontAwesome6 name="house" size={50} color={Colors.gray} />
              <Text style={styles.noAnnonceText}>Aucune annonce trouvée</Text>
              <Text style={styles.noAnnonceSubText}>
                Créez votre première annonce pour commencer
              </Text>
            </View>
          ) : (
            listAppartments.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.annonce}
                onPress={() => router.push(`/annonces/${item.id}`)}
              >
                <AnnonceItem item={item} />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/annonces/CreateAnnonce")}
      >
        <FontAwesome6 name="add" size={25} color="white" />
        <Text style={styles.text}>Créer une annonce</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  scrollContainer: {
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 100,
  },

  container_annonce: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    justifyContent: "space-between",
  },

  annonce: {
    height: 185,
    width: "45%",
  },

  // ✅ Styles pour l'état vide
  noAnnonceContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    width: "100%",
  },

  noAnnonceText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.dark,
    marginTop: 20,
    textAlign: "center",
  },

  noAnnonceSubText: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 20,
  },

  button: {
    borderRadius: 30,
    position: "absolute",
    zIndex: 20,
    bottom: 0,
    right: 10,
    width: 170,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 15,
    gap: 8,
    backgroundColor: Colors.primary,

    // Ombre pour iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,

    // Ombre pour Android
    elevation: 5,
  },

  text: {
    color: "white",
    fontWeight: "500",
    fontSize: 14,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.gray,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
});
