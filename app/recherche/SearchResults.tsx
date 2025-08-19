import { Text, View, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { Fontisto, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/Components/Colors";
import { router, useLocalSearchParams } from "expo-router";
import ListResults from "@/Components/Annonces/ListResults";
import { useState, useMemo, useEffect } from "react";
import MapsResults from "@/Components/Annonces/MapsResults";
import { AnnonceType } from "@/assets/Types/type";
import useAnnonce_Data from "@/assets/hooks/useAnnonce_Data";

const SearchResults = () => {

  const [listAppartments, setListAppartments] = useState<AnnonceType[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);

  const { fetchdataAll } = useAnnonce_Data();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchdataAll();
        setListAppartments(data || []); // ✅ Gérer le cas où data est undefined
      } catch (error) {
        console.error("❌ Erreur lors du chargement:", error);
        setListAppartments([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchdataAll]); // ✅ Ajouter fetchdataAll dans les dépendances

  const [isListView, setIsListView] = useState(true);
  const { query } = useLocalSearchParams();

  // ✅ Fonction fuzzyMatch définie AVANT son utilisation
  const fuzzyMatch = (text: string, term: string): boolean => {
    if (term.length < 3) return false;
    // Vérifier si les 3 premières lettres correspondent
    return text.substring(0, 3) === term.substring(0, 3);
  };

  // Amélioration de la gestion des paramètres de recherche
  const queryString = useMemo(() => {
    if (!query) return "";

    try {
      // Si query est un tableau, prendre le premier élément
      const queryValue = Array.isArray(query) ? query[0] : query;

      // Décoder l'URI et nettoyer les espaces
      return decodeURIComponent(queryValue || "").trim();
    } catch (error) {
      console.warn("Erreur lors du décodage de la query:", error);
      return Array.isArray(query) ? query[0] || "" : query || "";
    }
  }, [query]);

  // Amélioration de l'algorithme de filtrage avec recherche intelligente
  const Appartement_filtre = useMemo(() => {
    if (!queryString.trim()) return listAppartments;

    // Diviser la requête en mots-clés et nettoyer
    const searchTerms = queryString
      .toLowerCase()
      .split(/[,\s]+/) // Diviser par virgules et espaces
      .map((term) => term.trim())
      .filter((term) => term.length > 0); // Supprimer les termes vides

    return listAppartments.filter((item) => {
      if (!item.adresse) return false;

      const adresseLower = item.adresse.toLowerCase();

      // Recherche flexible : au moins un terme doit correspondre
      return searchTerms.some((term) => {
        // Recherche exacte ou partielle
        return (
          adresseLower.includes(term) ||
          term.includes(adresseLower) ||
          // Recherche phonétique simple (optionnel)
          fuzzyMatch(adresseLower, term)
        );
      });
    });
  }, [queryString, listAppartments]); // ✅ Ajout de fuzzyMatch dans les dépendances

  // Amélioration de l'affichage du titre avec ellipsis intelligent
  const displayTitle = useMemo(() => {
    if (!queryString) return "Recherche";

    if (queryString.length <= 35) {
      return queryString;
    }

    // Tronquer au dernier mot complet si possible
    const truncated = queryString.substring(0, 32);
    const lastSpaceIndex = truncated.lastIndexOf(" ");

    if (lastSpaceIndex > 20) {
      return truncated.substring(0, lastSpaceIndex) + "...";
    }

    return truncated + "...";
  }, [queryString]);

  // Messages contextuels selon le type de recherche
  const getNoResultsMessage = () => {
    if (!queryString) {
      return "Veuillez effectuer une recherche";
    }

    if (queryString.length < 3) {
      return "Votre recherche est trop courte. Essayez avec au moins 3 caractères.";
    }

    return "Aucun appartement trouvé pour cette recherche. Essayez avec des termes différents ou une zone plus large.";
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  const handleNewSearch = () => {
    router.push("/recherche/SearchScreen"); // Rediriger vers la page de recherche
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header amélioré */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Pressable
              onPress={handleGoBack}
              style={styles.backButton}
              hitSlop={8}
            >
              <Fontisto name="angle-left" size={18} color={Colors.primary} />
            </Pressable>

            <View style={styles.titleSection}>
              <Text style={styles.title} numberOfLines={1}>
                {displayTitle}
              </Text>
              {Appartement_filtre.length > 0 && (
                <Text style={styles.resultCount}>
                  {Appartement_filtre.length} résultat
                  {Appartement_filtre.length > 1 ? "s" : ""} trouvé
                  {Appartement_filtre.length > 1 ? "s" : ""}
                </Text>
              )}
            </View>

            {/* Bouton de basculement Vue Liste/Carte */}
            {Appartement_filtre.length > 0 && (
              <Pressable
                onPress={() => setIsListView(!isListView)}
                style={styles.viewToggleButton}
                hitSlop={8}
              >
                <MaterialIcons
                  name={isListView ? "map" : "list"}
                  size={20}
                  color={Colors.primary}
                />
              </Pressable>
            )}
          </View>
        </View>

        {/* Contenu principal */}
        {Appartement_filtre.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <MaterialIcons
              name="search-off"
              size={64}
              color={Colors.gray}
              style={styles.noResultsIcon}
            />
            <Text style={styles.noResultsTitle}>Aucun résultat</Text>
            <Text style={styles.noResultsText}>{getNoResultsMessage()}</Text>

            <View style={styles.noResultsActions}>
              <Pressable
                style={styles.newSearchButton}
                onPress={handleNewSearch}
              >
                <MaterialIcons name="search" size={16} color="white" />
                <Text style={styles.newSearchText}>Nouvelle recherche</Text>
              </Pressable>

              <Pressable style={styles.backButton2} onPress={handleGoBack}>
                <Text style={styles.backButtonText}>Retour</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          // Affichage des résultats
          <>
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
          </>
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
    paddingTop: 50,
    padding: 1,
    backgroundColor: "white",
    justifyContent: "space-between",
  },

  header: {
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.light,
  },

  titleSection: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 16,
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
    fontWeight: "500",
  },

  viewToggleButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.primary + "10",
  },

  // Styles améliorés pour "aucun résultat"
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },

  noResultsIcon: {
    marginBottom: 16,
    opacity: 0.6,
  },

  noResultsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.dark,
    marginBottom: 12,
    textAlign: "center",
  },

  noResultsText: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 32,
    maxWidth: 280,
  },

  noResultsActions: {
    width: "100%",
    gap: 12,
  },

  newSearchButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  newSearchText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  backButton2: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray,
    alignItems: "center",
  },

  backButtonText: {
    color: Colors.gray,
    fontSize: 16,
    fontWeight: "500",
  },
});
