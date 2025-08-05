
import { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Modal,
  Alert,
  TextInput,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";

import * as Location from "expo-location";
import _ from "lodash";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { Colors } from "./Colors";
import { useAnnonce } from "@/assets/hooks/useAnnonce";

type props = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
};

interface NominatimPlace {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
  class?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    state?: string;
    region?: string;
    country?: string;
    postcode?: string;
    road?: string;
    house_number?: string;
  };
}

interface RecentSearch {
  id: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
}

const Modal_Search = ({ modalVisible, setModalVisible }: props) => {
  const { annonce, saveAnnonce } = useAnnonce();
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [citySuggestions, setCitySuggestions] = useState<NominatimPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const textInputRef = useRef<TextInput>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Focus automatique sur l'input quand le modal s'ouvre
  useEffect(() => {
    if (modalVisible) {
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
      setError(null);
    } else {
      setSearchQuery("");
      setCitySuggestions([]);
      setIsSearching(false);
    }
  }, [modalVisible]);

  // Fonction pour récupérer la localisation actuelle
  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission requise",
          "Nous avons besoin d'accéder à votre localisation pour vous aider à trouver votre adresse.",
          [
            { text: "Annuler", style: "cancel" },
            { 
              text: "Paramètres", 
              onPress: () => {
                // Rediriger vers les paramètres de l'app
                Alert.alert("Information", "Veuillez activer la localisation dans les paramètres de votre appareil.");
              }
            }
          ]
        );
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setLocation(userLocation.coords);

      // Récupérer l'adresse
      const address = await getAddressFromCoords(
        userLocation.coords.latitude,
        userLocation.coords.longitude
      );

      if (address) {
        const newSearch: RecentSearch = {
          id: Date.now().toString(),
          address,
          coordinates: {
            latitude: userLocation.coords.latitude,
            longitude: userLocation.coords.longitude,
          },
          timestamp: Date.now(),
        };

        setRecentSearches(prev => [newSearch, ...prev.slice(0, 4)]);

        saveAnnonce({
          ...annonce,
          adresse: address,
          coordonnee: {
            latitude: userLocation.coords.latitude,
            longitude: userLocation.coords.longitude,
          },
        });

        setModalVisible(false);
      }
    } catch (error) {
      console.error("Erreur de géolocalisation:", error);
      setError("Impossible d'obtenir votre position. Vérifiez que la localisation est activée.");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer l'adresse à partir des coordonnées
  const getAddressFromCoords = async (latitude: number, longitude: number): Promise<string | null> => {
    try {
      const url = new URL("https://nominatim.openstreetmap.org/reverse");
      url.searchParams.append("lat", latitude.toString());
      url.searchParams.append("lon", longitude.toString());
      url.searchParams.append("format", "json");
      url.searchParams.append("addressdetails", "1");
      url.searchParams.append("accept-language", "fr,en");
      url.searchParams.append("zoom", "18");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(url.toString(), {
        method: "GET",
        signal: controller.signal,
        headers: {
          "User-Agent": "PropertyApp/1.0",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return formatAddress(data.address, data.display_name);
    } catch (error) {
      console.error("Erreur reverse geocoding:", error);
      return null;
    }
  };

  // Fonction pour formater l'adresse
  const formatAddress = (address: any, displayName: string): string => {
    if (!address) return displayName;

    const parts = [];
    
    // Numéro et rue
    if (address.house_number) parts.push(address.house_number);
    if (address.road) parts.push(address.road);
    
    // Ville
    const city = address.city || address.town || address.village || address.municipality;
    if (city) parts.push(city);
    
    // Région/État
    const region = address.state || address.region;
    if (region && region !== city) parts.push(region);
    
    // Pays
    if (address.country) parts.push(address.country);

    return parts.length > 0 ? parts.join(", ") : displayName;
  };

  // Fonction pour récupérer les suggestions
  const getCitySuggestions = async (query: string) => {
    if (query.length < 3) {
      setCitySuggestions([]);
      setIsSearching(false);
      return;
    }

    // Annuler la requête précédente
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsSearching(true);
    setError(null);
    abortControllerRef.current = new AbortController();

    try {
      const url = new URL("https://nominatim.openstreetmap.org/search");
      url.searchParams.append("q", query);
      url.searchParams.append("format", "json");
      url.searchParams.append("addressdetails", "1");
      url.searchParams.append("limit", "8");
      url.searchParams.append("accept-language", "fr,en");
      url.searchParams.append("countrycodes", "bj,fr,ci,sn,tg,gh,ng,ml,bf"); // Pays d'Afrique de l'Ouest

      const response = await fetch(url.toString(), {
        method: "GET",
        signal: abortControllerRef.current.signal,
        headers: {
          "User-Agent": "PropertyApp/1.0",
        },
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Trop de requêtes. Veuillez patienter quelques secondes.");
        }
        throw new Error(`Erreur ${response.status}`);
      }

      const data = await response.json();

      // Filtrer et trier les résultats
      const filteredResults = data
        .filter((place: NominatimPlace) => {
          // Privilégier les adresses avec des détails
          return place.address && (
            place.address.city || 
            place.address.town || 
            place.address.village || 
            place.address.municipality ||
            place.address.road
          );
        })
        .sort((a: NominatimPlace, b: NominatimPlace) => {
          // Trier par pertinence (les villes en premier)
          const aIsCity = !!(a.address?.city || a.address?.town);
          const bIsCity = !!(b.address?.city || b.address?.town);
          
          if (aIsCity && !bIsCity) return -1;
          if (!aIsCity && bIsCity) return 1;
          return 0;
        });

      setCitySuggestions(filteredResults);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Erreur lors de la recherche:", error);
        setError(error.message || "Erreur lors de la recherche");
        setCitySuggestions([]);
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce pour la recherche
  const debouncedFetchCities = _.debounce(getCitySuggestions, 600);

  useEffect(() => {
    debouncedFetchCities(searchQuery);
    return () => {
      debouncedFetchCities.cancel();
    };
  }, [debouncedFetchCities, searchQuery]);

  // Fonction de sélection d'une suggestion
  const handleCitySelect = (place: NominatimPlace) => {
    const formattedAddress = formatAddress(place.address, place.display_name);
    
    const newSearch: RecentSearch = {
      id: Date.now().toString(),
      address: formattedAddress,
      coordinates: {
        latitude: parseFloat(place.lat),
        longitude: parseFloat(place.lon),
      },
      timestamp: Date.now(),
    };

    setRecentSearches(prev => [newSearch, ...prev.filter(s => s.address !== formattedAddress).slice(0, 4)]);

    saveAnnonce({
      ...annonce,
      adresse: formattedAddress,
      coordonnee: {
        latitude: parseFloat(place.lat),
        longitude: parseFloat(place.lon),
      },
    });

    Keyboard.dismiss();
    setModalVisible(false);
  };

  // Fonction pour sélectionner une recherche récente
  const handleRecentSelect = (recent: RecentSearch) => {
    saveAnnonce({
      ...annonce,
      adresse: recent.address,
      coordonnee: recent.coordinates,
    });
    setModalVisible(false);
  };

  // Fonction pour supprimer une recherche récente
  const removeRecentSearch = (id: string) => {
    setRecentSearches(prev => prev.filter(search => search.id !== id));
  };

  // Fonction pour fermer le modal
  const closeModal = () => {
    Keyboard.dismiss();
    setModalVisible(false);
  };

  const formatDisplayName = (place: NominatimPlace): string => {
    return formatAddress(place.address, place.display_name);
  };

  const getLocationIcon = (place: NominatimPlace) => {
    if (place.address?.road) return "place";
    if (place.address?.city || place.address?.town) return "location-city";
    return "location-on";
  };

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={closeModal}
    >
      <SafeAreaView style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Rechercher une adresse</Text>
              <Pressable onPress={closeModal} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color={Colors.dark} />
              </Pressable>
            </View>

            {/* Barre de recherche */}
            <View style={styles.searchSection}>
              <View style={styles.container_input}>
                <MaterialIcons name="search" size={20} color={Colors.gray} />
                <TextInput
                  ref={textInputRef}
                  style={styles.input}
                  placeholder="Tapez votre adresse..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoCorrect={false}
                  autoCapitalize="words"
                  returnKeyType="search"
                  clearButtonMode="while-editing"
                />
                {searchQuery.length > 0 && (
                  <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
                    <MaterialIcons name="clear" size={20} color={Colors.gray} />
                  </Pressable>
                )}
              </View>

              {/* Bouton localisation actuelle */}
              {searchQuery.length < 1 && (
                <Pressable
                  style={styles.container_location_actuelle}
                  onPress={getCurrentLocation}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  ) : (
                    <MaterialIcons name="my-location" size={18} color={Colors.primary} />
                  )}
                  <Text style={styles.locationText}>
                    {loading ? "Localisation..." : "Utiliser ma position actuelle"}
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Contenu principal */}
            <View style={styles.contentSection}>
              {error && (
                <View style={styles.errorContainer}>
                  <MaterialIcons name="error-outline" size={20} color={Colors.error || '#FF6B6B'} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Recherches récentes */}
              {searchQuery.length < 1 && recentSearches.length > 0 && (
                <View style={styles.recentSection}>
                  <Text style={styles.sectionTitle}>Recherches récentes</Text>
                  {recentSearches.map((recent) => (
                    <View key={recent.id} style={styles.recentItem}>
                      <Pressable
                        style={styles.recentContent}
                        onPress={() => handleRecentSelect(recent)}
                      >
                        <MaterialIcons name="history" size={20} color={Colors.gray} />
                        <Text style={styles.recentText} numberOfLines={2}>
                          {recent.address}
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => removeRecentSearch(recent.id)}
                        hitSlop={8}
                        style={styles.removeButton}
                      >
                        <MaterialIcons name="close" size={16} color={Colors.gray} />
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}

              {/* Suggestions de recherche */}
              {searchQuery.length >= 3 && (
                <View style={styles.suggestionsSection}>
                  <Text style={styles.sectionTitle}>Suggestions</Text>
                  
                  {isSearching ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color={Colors.primary} />
                      <Text style={styles.loadingText}>Recherche en cours...</Text>
                    </View>
                  ) : citySuggestions.length > 0 ? (
                    <FlatList
                      data={citySuggestions}
                      keyExtractor={(item) => item.place_id.toString()}
                      renderItem={({ item }) => (
                        <Pressable
                          style={styles.suggestionItem}
                          onPress={() => handleCitySelect(item)}
                        >
                          <MaterialIcons 
                            name={getLocationIcon(item)} 
                            size={20} 
                            color={Colors.primary} 
                          />
                          <Text style={styles.suggestionText} numberOfLines={2}>
                            {formatDisplayName(item)}
                          </Text>
                          <MaterialIcons name="north-west" size={16} color={Colors.gray} />
                        </Pressable>
                      )}
                      showsVerticalScrollIndicator={false}
                      keyboardShouldPersistTaps="handled"
                    />
                  ) : searchQuery.length >= 3 && !isSearching ? (
                    <View style={styles.noResultsContainer}>
                      <MaterialIcons name="search-off" size={48} color={Colors.gray} />
                      <Text style={styles.noResultsText}>Aucun résultat trouvé</Text>
                      <Text style={styles.noResultsSubtext}>
                        Essayez avec des termes différents
                      </Text>
                    </View>
                  ) : null}
                </View>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default Modal_Search;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },

  container: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    minHeight: "60%",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.dark,
  },

  closeButton: {
    padding: 4,
  },

  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
  },

  container_input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.dark,
  },

  container_location_actuelle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 12,
    backgroundColor: Colors.primary + '10',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },

  locationText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "500",
  },

  contentSection: {
    flex: 1,
    paddingHorizontal: 20,
  },

  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    marginVertical: 8,
  },

  errorText: {
    flex: 1,
    fontSize: 14,
    color: Colors.error || '#FF6B6B',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark,
    marginVertical: 16,
  },

  recentSection: {
    paddingBottom: 16,
  },

  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },

  recentContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingRight: 12,
  },

  recentText: {
    flex: 1,
    fontSize: 15,
    color: Colors.dark,
  },

  removeButton: {
    padding: 4,
  },

  suggestionsSection: {
    flex: 1,
  },

  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.light,
  },

  suggestionText: {
    flex: 1,
    fontSize: 15,
    color: Colors.dark,
    lineHeight: 20,
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 20,
    justifyContent: "center",
  },

  loadingText: {
    fontSize: 14,
    color: Colors.gray,
  },

  noResultsContainer: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 8,
  },

  noResultsText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.gray,
    textAlign: "center",
  },

  noResultsSubtext: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: "center",
  },
});