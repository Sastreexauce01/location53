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
} from "react-native";

import * as Location from "expo-location";
import _ from "lodash";
import axios from "axios";

import { Colors } from "./Colors";

import { useAnnonce } from "@/assets/hooks/useAnnonce";

type props = {
  modalVisible: boolean;
  setModalVisible: any;
};

const Modal_Search = ({ modalVisible, setModalVisible }: props) => {
  const {annonce,saveAnnonce}=useAnnonce();
  const [location, setLocation] =useState<Location.LocationObjectCoords | null>(null);
  console.log(location) // Localisation actuelle
  const [citySuggestions, setCitySuggestions] = useState<any[]>([]); // Liste des suggestions de villes
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

      let userLocation = await Location.getCurrentPositionAsync({});
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
      console.error(error)
    }
  };

  // Fonction pour récupérer l'adresse à partir des coordonnées
  const getAddressFromCoords = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse`,
        {
          params: {
            lat: latitude,
            lon: longitude,
            format: "json",
            addressdetails: 1,
          },
        }
      );

      const city =
        response.data.address.city ||
        response.data.address.town ||
        response.data.address.village;
      const region = response.data.address.state;
      const country = response.data.address.country;

      return `${city}, ${region}, ${country}`;
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Impossible de récupérer l'adresse.");
      return null;
    }
  };

  // Fonction pour récupérer les suggestions des villes avec retry

  const getCitySuggestions = async (query: string) => {
    if (query.length < 3) return; // Ne pas effectuer de recherche si le texte est trop court

    setLoading(true); // Afficher le chargement

    try {
      const response = await axios.get(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities`,
        {
          params: {
            namePrefix: query, // Le début du nom de la ville
            limit: 10, // Limiter à 5 suggestions
          },
          headers: {
            "x-rapidapi-key":
              "432539ce65msh4df0ec8f5d91603p1b8572jsn98002c443b39",
            "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
          },
        }
      );

      setCitySuggestions(response.data.data); // Mettre à jour les suggestions
    } catch (error: unknown) {
      // eslint-disable-next-line import/no-named-as-default-member
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          Alert.alert(
            "Erreur",
            "Trop de requêtes envoyées, veuillez réessayer plus tard."
          );
        } else {
          console.error("Erreur Axios:", error.message);
          Alert.alert("Erreur", "Impossible de récupérer les suggestions.");
        }
      } else {
        console.error("Erreur inconnue:", error);
        Alert.alert("Erreur", "Une erreur inconnue est survenue.");
      }
    } finally {
      setLoading(false); // Cacher le chargement
    }
  };

  // Fonction de recherche avec délai (debounce)
  const debouncedFetchCities = _.debounce(getCitySuggestions, 500); // Délais de 500ms après la dernière saisie

  // Effet qui exécute la recherche après 3 caractères saisis
  useEffect(() => {
    if (searchQuery.length >= 3) {
      debouncedFetchCities(searchQuery); // Appeler la fonction debounced
    }
  }, [debouncedFetchCities, searchQuery]);

  // Fonction appelée lorsqu'une ville est sélectionnée
  const handleCitySelect = (cityData: {
    city: string;
    region: string;
    country: string;
    latitude: number;
    longitude: number;
  }) => {
    const formattedAddress = `${cityData.city}, ${cityData.region}, ${cityData.country}`;

    setSearchQuery(formattedAddress); // Met à jour la recherche visible

    saveAnnonce({
      ...annonce,
      adresse: formattedAddress, // Utilise l'adresse formatée directement
      coordonnee: {
        ...annonce.coordonnee,
        latitude: cityData.latitude,
        longitude: cityData.longitude,
      },
    });

    setCitySuggestions([]); // Masquer les suggestions après sélection
    setModalVisible(!modalVisible);
  };

  // console.log(`${annonce.adresse} ${"%%%"} ${searchQuery}`);
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
              />
              {/* iconce pour supprimer */}

              {searchQuery.length > 1 && (
                <Pressable onPress={() => setSearchQuery("")}>
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
                <Text>Utiliser ma localisation actuelle</Text>
              </Pressable>
            )}

            {/* Afficher les suggestions */}
            {loading ? (
              <Text>Chargement...</Text> // Indicateur de chargement
            ) : (
              <FlatList
                data={citySuggestions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <Pressable
                    style={styles.suggestionItem}
                    onPress={() =>
                      handleCitySelect({
                        city: item.city,
                        region: item.region,
                        country: item.country,
                        latitude: item.latitude,
                        longitude: item.longitude,
                      })
                    } // Passer toutes les informations
                  >
                    <EvilIcons name="location" size={20} color={Colors.dark} />
                    <Text>
                      {item.city}, {item.region}, {item.country},
                    </Text>
                  </Pressable>
                )}
              />
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

  suggestionItem: {
    flexDirection: "row",
    paddingVertical: 15,
    borderBottomWidth: 0.2,
    borderColor: Colors.dark,
  },
});
