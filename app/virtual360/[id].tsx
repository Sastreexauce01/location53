import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { AnnonceType } from "@/assets/Types/type";
import { Colors } from "@/Components/Colors";
import { VirtualTourViewer } from "@/Components/Annonces/Virtual360/VirtualTourViewer";
import useAnnonce_Data from "@/assets/hooks/useAnnonce_Data";

const VirtualTourPage = () => {
  const { id } = useLocalSearchParams();
  
  const { listAppartments, isLoadingAnnonces } = useAnnonce_Data();

  const Annonce_query: AnnonceType | undefined = listAppartments.find(
    (annonce) => annonce.id === id
  );

  // console.log("✅ Annonce   virtuelle ", Annonce_query);
  
  // Écran de chargement pour les annonces
  if (isLoadingAnnonces) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Chargement ...</Text>
      </View>
    );
  }

  if (!Annonce_query) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Espace virtuel introuvable</Text>
      </View>
    );
  }

  return <VirtualTourViewer annonce={Annonce_query} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "white",
    fontSize: 18,
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

export default VirtualTourPage;
