import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Data_Appartements from "@/Data/data-appartements.json";
import { AnnonceType } from "@/assets/Types/type";

import { Colors } from "@/Components/Colors";
// import VirtualTourViewer from "@/Components/Annonces/Virtual360/VirtualTourViewer";
import { testAnnonceData } from "@/Data/data";
import { VirtualTourViewer } from "@/Components/Annonces/Virtual360/VirtualTourViewer";

// Caster les données JSON
const Data_Appartements_Typed = Data_Appartements as AnnonceType[];

const VirtualTourPage = () => {
  const { id } = useLocalSearchParams();

  const Annonce_query: AnnonceType | undefined = Data_Appartements_Typed.find(
    (annonce) => annonce.id ===id
  );

  if (!Annonce_query) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Espace virtuel introuvable</Text>
      </View>
    );
  }

  return <VirtualTourViewer annonce={testAnnonceData} />;
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
});

export default VirtualTourPage;
