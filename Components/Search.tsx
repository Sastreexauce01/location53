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
} from "react-native";
import _ from "lodash";
import { EvilIcons, Entypo } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import * as Location from "expo-location";
import { Colors } from "@/Components/Colors";
import { useState, useEffect, useMemo } from "react";

type SearchProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
};

interface NominatimPlace {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    state?: string;
    region?: string;
    country?: string;
  };
}

const Search: React.FC<SearchProps> = ({ searchQuery, setSearchQuery }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [citySuggestions, setCitySuggestions] = useState<NominatimPlace[]>([]);
  const [loading, setLoading] = useState(false);

  // Récupération de la localisation actuelle
  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "Activez la localisation pour continuer."
        );
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(userLocation.coords);

      await getAddressFromCoords(
        userLocation.coords.latitude,
        userLocation.coords.longitude
      );
    } catch (error) {
      console.error("❌❌ Erreur de géolocalisation:", error);
      Alert.alert("Erreur", "Impossible d'obtenir la position actuelle.");
    }
  };

  // Obtenir l'adresse à partir des coordonnées GPS
  const getAddressFromCoords = async (latitude: number, longitude: number) => {
    try {
      const url = new URL("https://nominatim.openstreetmap.org/reverse");
      url.searchParams.append("lat", latitude.toString());
      url.searchParams.append("lon", longitude.toString());
      url.searchParams.append("format", "json");
      url.searchParams.append("addressdetails", "1");
      url.searchParams.append("accept-language", "fr,en");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url.toString(), {
        method: "GET",
        signal: controller.signal,
        headers: {
          "User-Agent": "YourAppName/1.0",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const address = data.address;
      const city =
        address?.city ||
        address?.town ||
        address?.village ||
        address?.municipality;
      const region = address?.state || address?.region;
      const country = address?.country;

      if (city && country) {
        const locationString = region
          ? `${city}, ${region}, ${country}`
          : `${city}, ${country}`;
        setSearchQuery(locationString);
      } else {
        setSearchQuery(data.display_name);
      }
    } catch (error) {
      console.error("Erreur reverse geocoding:", error);
      if (error instanceof Error && error.name === "AbortError") {
        Alert.alert(
          "Erreur",
          "La recherche a pris trop de temps, veuillez réessayer."
        );
      } else {
        Alert.alert("Erreur", "Impossible de récupérer l'adresse.");
      }
    }
  };

  // Suggestions de villes avec Nominatim
  const getCitySuggestions = async (query: string) => {
    if (query.length < 3) {
      setCitySuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const url = new URL("https://nominatim.openstreetmap.org/search");
      url.searchParams.append("q", query);
      url.searchParams.append("format", "json");
      url.searchParams.append("addressdetails", "1");
      url.searchParams.append("limit", "10");
      url.searchParams.append("accept-language", "fr,en");
      url.searchParams.append("countrycodes", "");
      url.searchParams.append("featuretype", "city");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url.toString(), {
        method: "GET",
        signal: controller.signal,
        headers: {
          "User-Agent": "YourAppName/1.0",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 429) {
          Alert.alert(
            "Erreur",
            "Trop de requêtes envoyées, veuillez réessayer plus tard."
          );
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Filtrer et formater les résultats pour privilégier les villes
      const filteredResults = data.filter((place: NominatimPlace) => {
        const address = place.address;
        return (
          address &&
          (address.city ||
            address.town ||
            address.village ||
            address.municipality)
        );
      });

      setCitySuggestions(filteredResults);
    } catch (error: unknown) {
      console.error("Erreur lors de la recherche:", error);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          Alert.alert(
            "Erreur",
            "La recherche a pris trop de temps, veuillez réessayer."
          );
        } else {
          Alert.alert("Erreur", "Impossible de récupérer les suggestions.");
        }
      } else {
        Alert.alert("Erreur", "Une erreur inconnue est survenue.");
      }

      setCitySuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce pour éviter trop de requêtes
  const debouncedFetchCities = useMemo(
    () => _.debounce(getCitySuggestions, 500),
    []
  );

  // Exécute la recherche après 3 caractères
  useEffect(() => {
    debouncedFetchCities(searchQuery);

    // Nettoyage du debounce
    return () => {
      debouncedFetchCities.cancel();
    };
  }, [debouncedFetchCities, searchQuery]);

  const handleCitySelect = (place: NominatimPlace) => {
    const address = place.address;
    const city =
      address?.city ||
      address?.town ||
      address?.village ||
      address?.municipality;
    const region = address?.state || address?.region;
    const country = address?.country;

    if (city && country) {
      const locationString = region
        ? `${city}, ${region}, ${country}`
        : `${city}, ${country}`;
      setSearchQuery(locationString);
    } else {
      // Fallback sur le nom d'affichage si les détails d'adresse ne sont pas disponibles
      setSearchQuery(place.display_name);
    }

    setCitySuggestions([]);
  };

  const formatDisplayName = (place: NominatimPlace): string => {
    const address = place.address;
    if (!address) return place.display_name;

    const city =
      address.city || address.town || address.village || address.municipality;
    const region = address.state || address.region;
    const country = address.country;

    if (city && country) {
      return region ? `${city}, ${region}, ${country}` : `${city}, ${country}`;
    }

    return place.display_name;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container_input}>
        <EvilIcons name="location" size={20} color={Colors.dark} />
        <TextInput
          style={styles.input}
          placeholder="Rechercher votre lieu..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
          autoCapitalize="words"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
            <Entypo name="cross" size={20} color="black" />
          </Pressable>
        )}
      </View>

      {/* Toujours proposer la localisation actuelle */}
      <TouchableOpacity
        style={styles.container_location_actuelle}
        onPress={getCurrentLocation}
      >
        <FontAwesome6
          name="location-crosshairs"
          size={15}
          color={Colors.primary}
        />
        <Text style={styles.locationText}>
          Utiliser ma localisation actuelle
        </Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>Recherche en cours...</Text>
        </View>
      ) : (
        citySuggestions.length > 0 && (
          <FlatList
            data={citySuggestions}
            keyExtractor={(item) => item.place_id.toString()}
            renderItem={({ item }) => (
              <Pressable
                style={styles.suggestionItem}
                onPress={() => handleCitySelect(item)}
              >
                <EvilIcons name="location" size={20} color={Colors.dark} />
                <Text style={styles.suggestionText} numberOfLines={2}>
                  {formatDisplayName(item)}
                </Text>
              </Pressable>
            )}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        )
      )}
    </KeyboardAvoidingView>
  );
};

export default Search;

const styles = StyleSheet.create({
  container_input: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: Colors.dark,

    paddingVertical: 4,
  },

  input: {
    flex: 1,
    height: "auto",
    paddingHorizontal: 5,
    fontSize: 16,
    color: "black",
  },
  container_location_actuelle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  locationText: {
    fontSize: 16,
    color: Colors.primary,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 15,
    borderBottomWidth: 0.2,
    borderColor: Colors.dark,
  },
  suggestionText: {
    flex: 1,
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.dark,
  },
});
