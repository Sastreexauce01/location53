import { Entypo, EvilIcons, FontAwesome6 } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Modal,
  TouchableOpacity,
  Alert,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";

import * as Location from "expo-location";
import _ from "lodash";

import { Colors } from "./Colors";

import { useAnnonce } from "@/assets/hooks/useAnnonce";

type props = {
  modalVisible: boolean;
  setModalVisible: any;
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

const Modal_Search = ({ modalVisible, setModalVisible }: props) => {
  const { annonce, saveAnnonce } = useAnnonce();
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  console.log(location); // Localisation actuelle
  const [citySuggestions, setCitySuggestions] = useState<NominatimPlace[]>([]); // Liste des suggestions de villes
  const [loading, setLoading] = useState(false); // Pour afficher un indicateur de chargement
  const [searchQuery, setSearchQuery] = useState<string>(""); // Texte de la recherche

  // Fonction pour récupérer la localisation actuelle de l'utilisateur et
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

      // Récupérer l'adresse et la stocker
      const address = await getAddressFromCoords(
        userLocation.coords.latitude,
        userLocation.coords.longitude
      );

      if (address) {
        setSearchQuery(address);

        saveAnnonce({
          ...annonce,
          adresse: address,
          coordonnee: {
            ...annonce.coordonnee,
            latitude: userLocation.coords.latitude,
            longitude: userLocation.coords.longitude,
          },
        });
        setModalVisible(!modalVisible);
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'obtenir la position actuelle.");
      console.error("Erreur de géolocalisation:", error);
    }
  };

  // Fonction pour récupérer l'adresse à partir des coordonnées
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
      const city = address?.city || address?.town || address?.village || address?.municipality;
      const region = address?.state || address?.region;
      const country = address?.country;

      if (city && country) {
        return region ? `${city}, ${region}, ${country}` : `${city}, ${country}`;
      } else {
        return data.display_name;
      }
    } catch (error) {
      console.error("Erreur reverse geocoding:", error);
      if (error instanceof Error && error.name === "AbortError") {
        Alert.alert("Erreur", "La recherche a pris trop de temps, veuillez réessayer.");
      } else {
        Alert.alert("Erreur", "Impossible de récupérer l'adresse.");
      }
      return null;
    }
  };

  // Fonction pour récupérer les suggestions des villes avec Nominatim
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
          Alert.alert("Erreur", "Trop de requêtes envoyées, veuillez réessayer plus tard.");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Filtrer et formater les résultats pour privilégier les villes
      const filteredResults = data.filter((place: NominatimPlace) => {
        const address = place.address;
        return address && (
          address.city || 
          address.town || 
          address.village || 
          address.municipality
        );
      });

      setCitySuggestions(filteredResults);
    } catch (error: unknown) {
      console.error("Erreur lors de la recherche:", error);
      
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          Alert.alert("Erreur", "La recherche a pris trop de temps, veuillez réessayer.");
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

  // Fonction de recherche avec délai (debounce)
  const debouncedFetchCities = _.debounce(getCitySuggestions, 800); // Délais de 800ms après la dernière saisie

  // Effet qui exécute la recherche après 3 caractères saisis
  useEffect(() => {
    debouncedFetchCities(searchQuery);
    
    // Nettoyage du debounce
    return () => {
      debouncedFetchCities.cancel();
    };
  }, [debouncedFetchCities, searchQuery]);

  // Fonction appelée lorsqu'une ville est sélectionnée
  const handleCitySelect = (place: NominatimPlace) => {
    const address = place.address;
    const city = address?.city || address?.town || address?.village || address?.municipality;
    const region = address?.state || address?.region;
    const country = address?.country;

    let formattedAddress: string;
    if (city && country) {
      formattedAddress = region ? `${city}, ${region}, ${country}` : `${city}, ${country}`;
    } else {
      formattedAddress = place.display_name;
    }

    setSearchQuery(formattedAddress); // Met à jour la recherche visible

    saveAnnonce({
      ...annonce,
      adresse: formattedAddress, // Utilise l'adresse formatée directement
      coordonnee: {
        ...annonce.coordonnee,
        latitude: parseFloat(place.lat),
        longitude: parseFloat(place.lon),
      },
    });

    setCitySuggestions([]); // Masquer les suggestions après sélection
    setModalVisible(!modalVisible);
  };

  const formatDisplayName = (place: NominatimPlace): string => {
    const address = place.address;
    if (!address) return place.display_name;

    const city = address.city || address.town || address.village || address.municipality;
    const region = address.state || address.region;
    const country = address.country;

    if (city && country) {
      return region ? `${city}, ${region}, ${country}` : `${city}, ${country}`;
    }
    
    return place.display_name;
  };

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        // onPress={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.container}>
          <Pressable onPress={() => setModalVisible(!modalVisible)}>
            <Entypo name="cross" size={25} color={Colors.dark} />
          </Pressable>

          <View>
            <View style={styles.container_input}>
              <EvilIcons name="location" size={20} color={Colors.dark} />
              <TextInput
                style={styles.input}
                placeholder="Rechercher votre lieu..."
                value={searchQuery}
                onChangeText={setSearchQuery} // Saisir le texte pour la recherche
                autoCorrect={false}
                autoCapitalize="words"
              />
              {/* icone pour supprimer */}

              {searchQuery.length > 1 && (
                <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
                  <Entypo name="cross" size={24} color="black" />
                </Pressable>
              )}
            </View>

            {searchQuery.length < 1 && (
              <Pressable
                style={styles.container_location_actuelle}
                onPress={getCurrentLocation}
              >
                <FontAwesome6
                  name="location-crosshairs"
                  size={15}
                  color={Colors.primary}
                />
                <Text style={styles.locationText}>Utiliser ma localisation actuelle</Text>
              </Pressable>
            )}

            {/* Afficher les suggestions */}
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
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default Modal_Search;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fond semi-transparent
    justifyContent: "flex-end",
    alignItems: "center",
  },

  container: {
    padding: 15,
    backgroundColor: "white",
    width: "100%",
    height: "90%",
    borderRadius: 30,
  },

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