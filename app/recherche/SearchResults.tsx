import { Text, View, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { Colors } from "@/Components/Colors";
import { router, useLocalSearchParams } from "expo-router";
import ListResults from "@/Components/Annonces/ListResults";
import { useState, useMemo } from "react";
import MapsResults from "@/Components/Annonces/MapsResults";
import Data_Appartements from "@/Data/data-appartements.json";

const SearchResults = () => {
  const [isListView, setIsListView] = useState(true);

  const { query } = useLocalSearchParams();

  // Vérification et conversion de `query` avec gestion des erreurs
  const queryString = useMemo(() => {
    if (!query) return "";

    // Si query est un tableau, prendre le premier élément
    if (Array.isArray(query)) {
      return query[0] || "";
    }

    // Si query est une string, la décoder si nécessaire
    try {
      return decodeURIComponent(query);
    } catch (error) {
      console.warn("Erreur lors du décodage de la query:", error);
      return query;
    }
  }, [query]);

  // Filtrer les appartements par adresse avec recherche améliorée
  const Appartement_filtre = useMemo(() => {
    if (!queryString.trim()) return Data_Appartements;

    const searchTerms = queryString
      .toLowerCase()
      .split(",")
      .map((term) => term.trim());

    return Data_Appartements.filter((item) => {
      if (!item.adresse) return false;

      const adresseLower = item.adresse.toLowerCase();

      // Recherche si au moins un terme de recherche est trouvé dans l'adresse
      return searchTerms.some((term) => term && adresseLower.includes(term));
    });
  }, [queryString]);

  // Titre affiché avec limitation de caractères
  const displayTitle = useMemo(() => {
    if (queryString.length > 30) {
      return queryString.substring(0, 27) + "...";
    }
    return queryString;
  }, [queryString]);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header avec titre de recherche */}
        <View style={styles.container_head}>
          <View style={styles.container_title}>
            <Pressable
              onPress={handleGoBack}
              style={styles.backButton}
              hitSlop={8}
            >
              <Fontisto name="angle-left" size={16} color={Colors.primary} />
            </Pressable>

            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {displayTitle || "Recherche"}
              </Text>
              {Appartement_filtre.length > 0 && (
                <Text style={styles.resultCount}>
                  {Appartement_filtre.length} résultat
                  {Appartement_filtre.length > 1 ? "s" : ""}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Affichage conditionnel des résultats */}
        {Appartement_filtre.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsTitle}>Aucun résultat trouvé</Text>
            <Text style={styles.noResultsText}>
              Essayez de modifier votre recherche ou de chercher dans une autre
              zone.
            </Text>
            <Pressable style={styles.newSearchButton} onPress={handleGoBack}>
              <Text style={styles.newSearchText}>Nouvelle recherche</Text>
            </Pressable>
          </View>
        ) : // Affichage en fonction de l'état `isListView`
        isListView ? (
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
    backgroundColor: "white",
  },

  container: {
    flex: 1,
    paddingVertical: 10,
  },

  container_head: {
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.light,
    marginBottom: 10,
  },

  container_title: {
    padding: 4,
    flexDirection: "row",
    alignItems: "center",
  },

  backButton: {
    padding: 8,
    marginRight: 8,
  },

  titleContainer: {
    flex: 1,
    alignItems: "center",
    paddingRight: 32, // Compenser l'espace du bouton retour pour centrer
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark,
    textAlign: "center",
  },

  resultCount: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 2,
    textAlign: "center",
  },

  // Styles pour l'état "aucun résultat"
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  noResultsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.dark,
    marginBottom: 12,
    textAlign: "center",
  },

  noResultsText: {
    fontSize: 14,
    color: Colors.error,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },

  newSearchButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },

  newSearchText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
