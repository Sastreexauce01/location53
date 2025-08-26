import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
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

  const handleEditSearch = () => {
    router.push("/annonces/SearchScreen");
  };

  const handleItemPress = (item: AnnonceType) => {
    // Navigation vers le détail de l'annonce
    router.push(`/annonces/${item.id}`);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Barre de recherche modifiable */}
      {/* <Pressable style={styles.searchContainer} onPress={handleEditSearch}>
        <View style={styles.searchContent}>
          <MaterialIcons name="search" size={20} color={Colors.gray} />
          <Text style={styles.searchText} numberOfLines={1}>
            {queryString || "Rechercher..."}
          </Text>
        </View>
        <MaterialIcons name="edit" size={18} color={Colors.primary} />
      </Pressable> */}

      {/* Statistiques des résultats */}
      <View style={styles.statsContainer}>
        <View style={styles.statsContent}>
          <MaterialIcons name="location-on" size={16} color={Colors.primary} />
          <Text style={styles.statsText}>
            {Appartement_filtre.length} propriété
            {Appartement_filtre.length > 1 ? "s" : ""} trouvée
            {Appartement_filtre.length > 1 ? "s" : ""}
          </Text>
        </View>

        {/* Filtres rapides */}
        <View style={styles.quickFilters}>
          <Pressable style={styles.filterButton}>
            <MaterialIcons name="tune" size={16} color={Colors.primary} />
            <Text style={styles.filterText}>Filtres</Text>
          </Pressable>

          <Pressable style={styles.sortButton}>
            <MaterialIcons name="sort" size={16} color={Colors.gray} />
            <Text style={styles.sortText}>Trier</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  const renderItem = ({
    item,
    index,
  }: {
    item: AnnonceType;
    index: number;
  }) => (
    <View style={styles.itemWrapper}>
      <TouchableOpacity
        style={[styles.itemContainer, { marginTop: index === 0 ? 0 : 16 }]}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.95}
      >
        <AppartementItem item={item} />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="search-off" size={48} color={Colors.gray} />
      <Text style={styles.emptyTitle}>Aucun résultat trouvé</Text>
      <Text style={styles.emptySubtitle}>
        Essayez de modifier vos critères de recherche
      </Text>
      <Pressable style={styles.newSearchButton} onPress={handleEditSearch}>
        <MaterialIcons name="refresh" size={16} color="white" />
        <Text style={styles.newSearchText}>Nouvelle recherche</Text>
      </Pressable>
    </View>
  );

  if (Appartement_filtre.length === 0) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        {renderEmptyState()}
        {/* Bouton Map */}
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => setOpen(false)}
        >
          <Feather name="map" size={18} color="white" />
          <Text style={styles.mapButtonText}>Voir sur la carte</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header fixe en haut */}
      {renderHeader()}
      
      <FlatList
        data={Appartement_filtre}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={5}
      />

      {/* Bouton Map flottant */}
      <TouchableOpacity style={styles.mapButton} onPress={() => setOpen(false)}>
        <Feather name="map" size={18} color="white" />
        <Text style={styles.mapButtonText}>Carte</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ListResults;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },

  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    backgroundColor: 'white',
    // Assure que le header prend toute la largeur
    alignSelf: 'stretch',
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.light,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },

  searchContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  searchText: {
    flex: 1,
    fontSize: 14,
    color: Colors.dark,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statsContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  statsText: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: "500",
  },

  quickFilters: {
    flexDirection: "row",
    gap: 8,
  },

  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.primary + "10",
    borderRadius: 16,
  },

  filterText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "500",
  },

  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.light,
    borderRadius: 16,
  },

  sortText: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: "500",
  },

  listContainer: {
    paddingBottom: 100,
    // Centrage des éléments
    alignItems: 'center',
  },

  itemWrapper: {
    // Container pour centrer chaque item
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  itemContainer: {
    // L'item lui-même, peut avoir une largeur fixe ou responsive
    width: '100%',
    maxWidth: 400, // Optionnel: largeur max pour les grands écrans
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 64,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.dark,
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },

  emptySubtitle: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },

  newSearchButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },

  newSearchText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },

  mapButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  mapButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});