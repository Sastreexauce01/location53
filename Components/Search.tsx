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
} from "react-native";
import _ from "lodash";
import { EvilIcons, Entypo } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import * as Location from "expo-location";
import { Colors } from "@/Components/Colors";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";

type SearchProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
};

const Search: React.FC<SearchProps> = ({ searchQuery, setSearchQuery }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [citySuggestions, setCitySuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Récupération de la localisation actuelle
  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission refusée", "Activez la localisation pour continuer.");
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);

      await getAddressFromCoords(userLocation.coords.latitude, userLocation.coords.longitude);
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible d'obtenir la position actuelle.");
    }
  };

  // Obtenir l’adresse à partir des coordonnées GPS
  const getAddressFromCoords = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
        params: {
          lat: latitude,
          lon: longitude,
          format: "json",
          addressdetails: 1,
        },
      });

      const city = response.data.address.city || response.data.address.town || response.data.address.village;
      const region = response.data.address.state;
      const country = response.data.address.country;

      setSearchQuery(`${city}, ${region}, ${country}`);
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de récupérer l'adresse.");
    }
  };

  // Suggestions de villes
  const getCitySuggestions = async (query: string) => {
    if (query.length < 3) return;

    setLoading(true);
    try {
      const response = await axios.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities`, {
        params: { namePrefix: query, limit: 10 },
        headers: {
          "x-rapidapi-key": "432539ce65msh4df0ec8f5d91603p1b8572jsn98002c443b39",
          "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
        },
      });

      setCitySuggestions(response.data.data);
    } catch (error: unknown) {
      // eslint-disable-next-line import/no-named-as-default-member
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          Alert.alert("Erreur", "Trop de requêtes envoyées, veuillez réessayer plus tard.");
        } else {
          console.error("Erreur Axios:", error.message);
          Alert.alert("Erreur", "Impossible de récupérer les suggestions.");
        }
      } else {
        console.error("Erreur inconnue:", error);
        Alert.alert("Erreur", "Une erreur inconnue est survenue.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Debounce
  const debouncedFetchCities = useMemo(() => _.debounce(getCitySuggestions, 1000), []);

  // Exécute la recherche après 3 caractères
  useEffect(() => {
    if (searchQuery.length >= 3) {
      debouncedFetchCities(searchQuery);
    } else {
      setCitySuggestions([]);
    }
  }, [debouncedFetchCities, searchQuery]);

  const handleCitySelect = (cityData: {
    city: string;
    region: string;
    country: string;
  }) => {
    setSearchQuery(`${cityData.city}, ${cityData.region}, ${cityData.country}`);
    setCitySuggestions([]);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.container_input}>
        <EvilIcons name="location" size={20} color={Colors.dark} />
        <TextInput
          style={styles.input}
          placeholder="Rechercher votre lieu..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery("")}>
            <Entypo name="cross" size={20} color="black" />
          </Pressable>
        )}
      </View>

      {/* Toujours proposer la localisation actuelle */}
      <Pressable style={styles.container_location_actuelle} onPress={getCurrentLocation}>
        <FontAwesome6 name="location-crosshairs" size={15} color={Colors.primary} />
        <Text>Utiliser ma localisation actuelle</Text>
      </Pressable>

      {loading ? (
        <ActivityIndicator size="small" color={Colors.primary} style={{ marginTop: 10 }} />
      ) : (
        <FlatList
          data={citySuggestions}
          keyExtractor={(item) => `${item.city}-${item.region}-${item.country}`}
          renderItem={({ item }) => (
            <Pressable
              style={styles.suggestionItem}
              onPress={() =>
                handleCitySelect({
                  city: item.city,
                  region: item.region,
                  country: item.country,
                })
              }
            >
              <EvilIcons name="location" size={20} color={Colors.dark} />
              <Text>
                {item.city}, {item.region}, {item.country}
              </Text>
            </Pressable>
          )}
        />
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
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    height: 25,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  container_location_actuelle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 15,
    borderBottomWidth: 0.2,
    borderColor: Colors.dark,
  },
});
