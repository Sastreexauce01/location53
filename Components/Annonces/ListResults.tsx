import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Feather, EvilIcons } from "@expo/vector-icons";

import { router } from "expo-router";
import { Colors } from "@/Components/Colors";
import AppartementItem from "@/Components/home/AppartementItem";
import { AnnonceType } from "@/assets/Types/type";

interface ListResultsProps {
  setOpen: (value: boolean) => void;
  queryString: string;
  Appartement_filtre: AnnonceType[];
}

const ListResults: React.FC<ListResultsProps> = ({
  setOpen,
  queryString,
  Appartement_filtre,
}) => {
  return (
    <>
      <View style={styles.container_input}>
        <Text>{queryString}</Text>
        {/* Icône pour rediriger vers la barre de recherche */}
        <Pressable onPress={() => router.push("/annonces/SearchScreen")}>
          <EvilIcons name="pencil" size={20} color="black" />
        </Pressable>
      </View>

      {/* Liste des annonces filtrées */}
      <Text style={{ fontSize: 12, textAlign: "center", marginVertical: 15 }}>
        {Appartement_filtre.length} Propriété(s) trouvée(s)
      </Text>

      {Appartement_filtre.length > 0 ? (
        <FlatList
          data={Appartement_filtre}
          contentContainerStyle={styles.flatListContainer}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <AppartementItem item={item} />
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={true}
          style={{ flex: 1 }} // Permet à la FlatList de prendre toute la place
        />
      ) : (
        <Text style={styles.noResults}>Aucun résultat trouvé.</Text>
      )}

      {/* Section pour aller vers la carte */}
      <TouchableOpacity
        style={styles.container_maps}
        onPress={() => setOpen(false)} // Correctif ici !
      >
        <Feather name="map" size={20} color="black" />
        <Text>Map</Text>
      </TouchableOpacity>
    </>
  );
};

export default ListResults;

const styles = StyleSheet.create({
  container_input: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 0.5,
    borderColor: Colors.dark,
    borderRadius: 15,
    padding: 15,
    margin: 15,
  },

  flatListContainer: {
    gap: 20,
    alignItems: "center",
    paddingBottom: 100,
  },

  noResults: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 16,
    color: Colors.dark,
  },

  container_maps: {
    position: "absolute",
    alignSelf: "center",
    bottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderWidth: 1,
    borderColor: Colors.dark,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,

    // Ombre pour iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    // Ombre pour Android
    elevation: 5,
  },
});
