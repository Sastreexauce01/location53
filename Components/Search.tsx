import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import _ from "lodash";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { Colors } from "@/Components/Colors";
import { useState, useEffect, useRef } from "react";

type SearchProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onLocationSelect?: (location: {
    address: string;
    coordinates: { latitude: number; longitude: number };
  }) => void;
  placeholder?: string;
  showCurrentLocation?: boolean;
  maxSuggestions?: number;
  countryCodes?: string;
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
  coordinates: { latitude: number; longitude: number };
  timestamp: number;
}

const Search: React.FC<SearchProps> = ({
  searchQuery,
  setSearchQuery,
  onLocationSelect,
  placeholder = "Rechercher votre lieu...",
  showCurrentLocation = true,
  maxSuggestions = 12,
  countryCodes,
}) => {
  const router = useRouter();
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [citySuggestions, setCitySuggestions] = useState<NominatimPlace[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<TextInput>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fonction pour formater l'adresse
  const formatAddress = (address: any, displayName: string): string => {
    if (!address) return displayName;

    const parts = [];

    // Numéro et rue
    if (address.house_number) parts.push(address.house_number);
    if (address.road) parts.push(address.road);

    // Ville
    const city =
      address.city || address.town || address.village || address.municipality;
    if (city) parts.push(city);

    // Région
    const region = address.state || address.region;
    if (region && region !== city) parts.push(region);

    // Pays
    if (address.country) parts.push(address.country);

    return parts.length > 0 ? parts.join(", ") : displayName;
  };

  // Obtenir l'adresse à partir des coordonnées GPS
  const getAddressFromCoords = async (
    latitude: number,
    longitude: number
  ): Promise<string | null> => {
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
          "User-Agent": "SearchApp/1.0",
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

  // Récupération de la localisation actuelle
  const getCurrentLocation = async () => {
    try {
      setLocationLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission requise",
          "Nous avons besoin d'accéder à votre localisation pour vous aider.",
          [
            { text: "Annuler", style: "cancel" },
            {
              text: "Paramètres",
              onPress: () => {
                Alert.alert(
                  "Information",
                  "Activez la localisation dans les paramètres de votre appareil."
                );
              },
            },
          ]
        );
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(userLocation.coords);

      const address = await getAddressFromCoords(
        userLocation.coords.latitude,
        userLocation.coords.longitude
      );

      if (address) {
        setSearchQuery(address);

        // Ajouter aux recherches récentes
        const newSearch: RecentSearch = {
          id: Date.now().toString(),
          address,
          coordinates: {
            latitude: userLocation.coords.latitude,
            longitude: userLocation.coords.longitude,
          },
          timestamp: Date.now(),
        };

        setRecentSearches((prev) => [newSearch, ...prev.slice(0, 4)]);

        // Callback si fourni
        if (onLocationSelect) {
          onLocationSelect({
            address,
            coordinates: {
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            },
          });
        }

        // Fermer le clavier et masquer les suggestions
        Keyboard.dismiss();
        setCitySuggestions([]);
        setIsFocused(false);

        // Navigation vers les résultats de recherche

        router.push(
          `/recherche/SearchResults?query=${encodeURIComponent(address)}`
        );
      }
    } catch (error) {
      console.error("Erreur de géolocalisation:", error);
      setError(
        "Impossible d'obtenir votre position. Vérifiez que la localisation est activée."
      );
    } finally {
      setLocationLoading(false);
    }
  };

  // Suggestions de villes avec Nominatim
  const getCitySuggestions = async (query: string) => {
    if (query.length < 3) {
      setCitySuggestions([]);
      return;
    }

    // Annuler la requête précédente
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setLoading(true);
    setError(null);
    abortControllerRef.current = new AbortController();

    try {
      const url = new URL("https://nominatim.openstreetmap.org/search");
      url.searchParams.append("q", query);
      url.searchParams.append("format", "json");
      url.searchParams.append("addressdetails", "1");
      url.searchParams.append("limit", maxSuggestions.toString());
      url.searchParams.append("accept-language", "fr,en");

      // Ajouter countryCodes seulement si fourni
      if (countryCodes) {
        url.searchParams.append("countrycodes", countryCodes);
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        signal: abortControllerRef.current.signal,
        headers: {
          "User-Agent": "SearchApp/1.0",
        },
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(
            "Trop de requêtes. Veuillez patienter quelques secondes."
          );
        }
        throw new Error(`Erreur ${response.status}`);
      }

      const data = await response.json();

      // Filtrer et trier les résultats
      const filteredResults = data
        .filter((place: NominatimPlace) => {
          return (
            place.address &&
            (place.address.city ||
              place.address.town ||
              place.address.village ||
              place.address.municipality ||
              place.address.road)
          );
        })
        .sort((a: NominatimPlace, b: NominatimPlace) => {
          // Trier par pertinence
          const aIsCity = !!(a.address?.city || a.address?.town);
          const bIsCity = !!(b.address?.city || b.address?.town);

          if (aIsCity && !bIsCity) return -1;
          if (!aIsCity && bIsCity) return 1;
          return 0;
        });

      setCitySuggestions(filteredResults);
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Erreur lors de la recherche:", error);
        setError(error.message || "Erreur lors de la recherche");
        setCitySuggestions([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Créer le debounce une seule fois avec useRef et useEffect
  const debouncedFetchCities = useRef<_.DebouncedFunc<
    (query: string) => void
  > | null>(null);

  useEffect(() => {
    if (!debouncedFetchCities.current) {
      debouncedFetchCities.current = _.debounce((query: string) => {
        getCitySuggestions(query);
      }, 600);
    }

    return () => {
      if (debouncedFetchCities.current) {
        debouncedFetchCities.current.cancel();
      }
    };
  }, []);

  // Exécute la recherche après 3 caractères
  useEffect(() => {
    if (isFocused && searchQuery.length >= 3 && debouncedFetchCities.current) {
      debouncedFetchCities.current(searchQuery);
    } else if (searchQuery.length < 3) {
      setCitySuggestions([]);
      if (debouncedFetchCities.current) {
        debouncedFetchCities.current.cancel();
      }
    }
  }, [searchQuery, isFocused]);

  const handleCitySelect = (place: NominatimPlace) => {
    const formattedAddress = formatAddress(place.address, place.display_name);
    setSearchQuery(formattedAddress);

    // Ajouter aux recherches récentes
    const newSearch: RecentSearch = {
      id: Date.now().toString(),
      address: formattedAddress,
      coordinates: {
        latitude: parseFloat(place.lat),
        longitude: parseFloat(place.lon),
      },
      timestamp: Date.now(),
    };

    setRecentSearches((prev) => [
      newSearch,
      ...prev.filter((s) => s.address !== formattedAddress).slice(0, 4),
    ]);

    // Callback si fourni
    if (onLocationSelect) {
      onLocationSelect({
        address: formattedAddress,
        coordinates: {
          latitude: parseFloat(place.lat),
          longitude: parseFloat(place.lon),
        },
      });
    }

    setCitySuggestions([]);
    setIsFocused(false);
    Keyboard.dismiss();

    // Navigation vers les résultats de recherche
    router.push(
      `/recherche/SearchResults?query=${encodeURIComponent(formattedAddress)}`
    );
  };

  const handleRecentSelect = (recent: RecentSearch) => {
    setSearchQuery(recent.address);

    if (onLocationSelect) {
      onLocationSelect({
        address: recent.address,
        coordinates: recent.coordinates,
      });
    }

    setCitySuggestions([]);
    setIsFocused(false);
    Keyboard.dismiss();

    // Navigation vers les résultats de recherche
    router.push(
      `/recherche/SearchResults?query=${encodeURIComponent(recent.address)}`
    );
  };

  const removeRecentSearch = (id: string) => {
    setRecentSearches((prev) => prev.filter((search) => search.id !== id));
  };

  const clearSearch = () => {
    setSearchQuery("");
    setCitySuggestions([]);
    setError(null);
    inputRef.current?.focus();
  };

  const formatDisplayName = (place: NominatimPlace): string => {
    return formatAddress(place.address, place.display_name);
  };

  const getLocationIcon = (place: NominatimPlace) => {
    if (place.address?.road) return "place";
    if (place.address?.city || place.address?.town) return "location-city";
    return "location-on";
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    setError(null);
  };

  const handleInputBlur = () => {
    // Ne pas masquer immédiatement pour permettre la sélection
    // setIsFocused sera géré par les actions de sélection
  };

  const handleTextChange = (text: string) => {
    setSearchQuery(text);
    setError(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      {/* Barre de recherche */}
      <View
        style={[
          styles.container_input,
          isFocused && styles.container_input_focused,
        ]}
      >
        <MaterialIcons
          name="search"
          size={20}
          color={isFocused ? Colors.primary : Colors.gray}
        />
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder}
          value={searchQuery}
          onChangeText={handleTextChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          autoCorrect={false}
          autoCapitalize="words"
          returnKeyType="search"
          clearButtonMode="never"
          editable={true}
          selectTextOnFocus={false}
          blurOnSubmit={false}
        />
        {searchQuery.length > 0 && (
          <Pressable
            onPress={clearSearch}
            hitSlop={8}
            style={styles.clearButton}
          >
            <MaterialIcons name="clear" size={18} color={Colors.gray} />
          </Pressable>
        )}
      </View>

      {/* Message d'erreur */}
      {error && (
        <View style={styles.errorContainer}>
          <MaterialIcons
            name="error-outline"
            size={16}
            color={Colors.error || "#FF6B6B"}
          />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Bouton de localisation actuelle */}
      {showCurrentLocation && searchQuery.length < 1 && !loading && (
        <TouchableOpacity
          style={styles.container_location_actuelle}
          onPress={getCurrentLocation}
          disabled={locationLoading}
        >
          {locationLoading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <MaterialIcons
              name="my-location"
              size={16}
              color={Colors.primary}
            />
          )}
          <Text style={styles.locationText}>
            {locationLoading
              ? "Localisation..."
              : "Utiliser ma position actuelle"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Recherches récentes */}
      {searchQuery.length < 1 && recentSearches.length > 0 && !loading && (
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recherches récentes</Text>
          {recentSearches.slice(0, 3).map((recent) => (
            <View key={recent.id} style={styles.recentItem}>
              <TouchableOpacity
                style={styles.recentContent}
                onPress={() => handleRecentSelect(recent)}
              >
                <MaterialIcons name="history" size={16} color={Colors.gray} />
                <Text style={styles.recentText} numberOfLines={1}>
                  {recent.address}
                </Text>
              </TouchableOpacity>
              <Pressable
                onPress={() => removeRecentSearch(recent.id)}
                hitSlop={8}
                style={styles.removeButton}
              >
                <MaterialIcons name="close" size={14} color={Colors.gray} />
              </Pressable>
            </View>
          ))}
        </View>
      )}

      {/* Indicateur de chargement */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>Recherche en cours...</Text>
        </View>
      )}

      {/* Suggestions */}
      {citySuggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
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
                  size={18}
                  color={Colors.primary}
                />
                <Text style={styles.suggestionText} numberOfLines={2}>
                  {formatDisplayName(item)}
                </Text>
                <MaterialIcons
                  name="north-west"
                  size={14}
                  color={Colors.gray}
                />
              </Pressable>
            )}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={citySuggestions.length > 10}
            style={styles.suggestionsList}
          />
        </View>
      )}

      {/* Pas de résultats */}
      {searchQuery.length >= 3 &&
        !loading &&
        citySuggestions.length === 0 &&
        !error && (
          <View style={styles.noResultsContainer}>
            <MaterialIcons name="search-off" size={32} color={Colors.gray} />
            <Text style={styles.noResultsText}>Aucun résultat trouvé</Text>
            <Text style={styles.noResultsSubtext}>
              Essayez avec des termes différents
            </Text>
          </View>
        )}
    </KeyboardAvoidingView>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  container_input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "transparent",
    gap: 8,
  },

  container_input_focused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.light,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.dark,
    paddingVertical: 0,
    minHeight: 20,
  },

  clearButton: {
    padding: 2,
  },

  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FFF5F5",
    borderRadius: 8,
    marginTop: 8,
  },

  errorText: {
    flex: 1,
    fontSize: 12,
    color: Colors.error || "#FF6B6B",
  },

  container_location_actuelle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginTop: 8,
    backgroundColor: Colors.primary + "10",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary + "20",
  },

  locationText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },

  recentSection: {
    marginTop: 12,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.dark,
    marginBottom: 8,
    paddingHorizontal: 4,
  },

  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },

  recentContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingRight: 8,
  },

  recentText: {
    flex: 1,
    fontSize: 14,
    color: Colors.dark,
  },

  removeButton: {
    padding: 4,
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginTop: 8,
  },

  loadingText: {
    fontSize: 14,
    color: Colors.gray,
  },

  suggestionsContainer: {
    marginTop: 8,
    backgroundColor: Colors.light + "50",
    borderRadius: 8,
    overflow: "hidden",
  },

  suggestionsList: {
    maxHeight: "auto",
  },

  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.gray + "30",
  },

  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: Colors.dark,
    lineHeight: 18,
  },

  noResultsContainer: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 8,
  },

  noResultsText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.gray,
    textAlign: "center",
  },

  noResultsSubtext: {
    fontSize: 12,
    color: Colors.gray,
    textAlign: "center",
  },
});
