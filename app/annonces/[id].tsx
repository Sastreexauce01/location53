import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AnnonceType } from "@/assets/Types/type";
import Detail_Annonce from "@/Components/Detail_Annonce";
import { Fontisto } from "@expo/vector-icons";
import { Colors } from "@/Components/Colors";
import useAnnonce_Data from "@/assets/hooks/useAnnonce_Data";

export default function Page_Detail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { listAppartments, isLoadingAnnonces } = useAnnonce_Data();

  const Annonce_query: AnnonceType | undefined = listAppartments.find(
    (annonce) => annonce.id === id
  );

  // Écran de chargement pour les annonces
  if (isLoadingAnnonces) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Chargement ...</Text>
      </View>
    );
  }

   console.log(Annonce_query);  // Vérifiez la structure de l'objet récupéré
  if (!Annonce_query) {
    return (
      <View style={styles.container}>
        <Text>Annonce introuvables</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Section Back */}
      <Pressable onPress={() => router.back()} style={styles.icone_back}>
        <Fontisto name="angle-left" size={15} color={Colors.primary} />
      </Pressable>
      <Detail_Annonce item={Annonce_query} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  icone_back: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: Colors.light,

    padding: 8,
    borderRadius: "100%",
    alignItems: "center",
    zIndex: 10,
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
