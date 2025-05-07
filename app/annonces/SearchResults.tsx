import { Text, View, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { Colors } from "@/Components/Colors";
import { router, useLocalSearchParams } from "expo-router";
import ListResults from "@/Components/Annonces/ListResults";
import { useState } from "react";
import MapsResults from "@/Components/Annonces/MapsResults";
import Data_Appartements from "@/Data/data-appartements.json";



const SearchResults = () => {
  const [isListView, setIsListView] = useState(true); // Renommé en isListView pour plus de clarté

  const { query } = useLocalSearchParams();

  // Vérification et conversion de `query`
  const queryString = query ? (Array.isArray(query) ? query[0] : query) : "";

  // Filtrer les appartements par adresse
  const Appartement_filtre = Data_Appartements.filter(
    (item) =>
      item.adresse?.toLowerCase().includes(queryString.toLowerCase()) // Ajout de l'option de sécurité avec `?.`
  );

  // console.log(Appartement_filtre);
 
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Première section */}
        <View style={styles.container_head}>
          {/* Section Title */}
          <View style={styles.container_title}>
            <Pressable onPress={() => router.back()}>
              <Fontisto name="angle-left" size={16} color={Colors.primary} />
            </Pressable>

            <View style={styles.titleContainer}>
              <Text style={styles.title}>{queryString}</Text>
            </View>
          </View>
        </View>

        {/* Affichage en fonction de l'état `isListView` */}
        {isListView ? (
          <ListResults
            setOpen={setIsListView}
            queryString={queryString}
            Appartement_filtre={Appartement_filtre}
          />
        ) : (
          <MapsResults
            setOpen={setIsListView}
            Appartement_filtre={Appartement_filtre}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default SearchResults;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingVertical: 10,
  },

  container_title: {
    padding: 4,
    flexDirection: "row",
    alignItems: "center",
  },

  titleContainer: {
    flex: 1,
    alignItems: "center",
  },

  title: {
    fontSize: 14,
    fontWeight: "500",
  },

  container_head: {
    gap: 50,
    paddingBottom: 10,
  },
});
