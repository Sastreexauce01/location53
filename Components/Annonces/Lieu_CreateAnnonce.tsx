import React, { useState, useRef } from "react";
import { 
  Text, 
  View, 
  StyleSheet, 
  Pressable, 
  Alert,
  ActivityIndicator,
  ScrollView 
} from "react-native";
import { Colors } from "../Colors";
import { EvilIcons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import * as Location from 'expo-location';
import Modal_Search from "../Modal_Search";
import { useAnnonce } from "@/assets/hooks/useAnnonce";

const Lieu_CreateAnnonce = () => {
  const { annonce, saveAnnonce } = useAnnonce();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mapType, setMapType] = useState<'standard' | 'satellite' | 'hybrid'>('standard');
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const mapRef = useRef<MapView>(null);

  // Region par défaut (Cotonou, Bénin)
  const defaultRegion: Region = {
    latitude: 6.3573,
    longitude: 2.4194,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // Région actuelle de la carte
  const currentRegion: Region = {
    latitude: annonce.coordonnee?.latitude || defaultRegion.latitude,
    longitude: annonce.coordonnee?.longitude || defaultRegion.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  // Obtenir la localisation actuelle de l'utilisateur
  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission requise',
          'Nous avons besoin de votre localisation pour vous aider à positionner votre propriété.',
          [{ text: 'OK' }]
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });

      // Animer vers la position de l'utilisateur
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
      }

    } catch (error) {
      console.error('Erreur de géolocalisation:', error);
      Alert.alert(
        'Erreur',
        'Impossible d\'obtenir votre position actuelle.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Utiliser la position actuelle comme adresse de la propriété
  const useCurrentLocation = async () => {
    if (!userLocation) {
      await getCurrentLocation();
      return;
    }

    try {
      setLoading(true);
      
      // Géocodage inverse pour obtenir l'adresse
      const addresses = await Location.reverseGeocodeAsync(userLocation);
      
      if (addresses.length > 0) {
        const address = addresses[0];
        const formattedAddress = [
          address.streetNumber,
          address.street,
          address.district,
          address.city,
          address.country
        ].filter(Boolean).join(', ');

        saveAnnonce({
          ...annonce,
          adresse: formattedAddress || 'Adresse détectée',
          coordonnee: userLocation
        });

        Alert.alert(
          'Position utilisée',
          'Votre position actuelle a été définie comme localisation de votre propriété.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Erreur de géocodage:', error);
      // Utiliser quand même les coordonnées sans l'adresse formatée
      saveAnnonce({
        ...annonce,
        adresse: `Lat: ${userLocation.latitude.toFixed(4)}, Lng: ${userLocation.longitude.toFixed(4)}`,
        coordonnee: userLocation
      });
    } finally {
      setLoading(false);
    }
  };

  // Changer le type de carte
  const toggleMapType = () => {
    const types: ('standard' | 'satellite' | 'hybrid')[] = ['standard', 'satellite', 'hybrid'];
    const currentIndex = types.indexOf(mapType);
    const nextIndex = (currentIndex + 1) % types.length;
    setMapType(types[nextIndex]);
  };

  // Centrer sur le marker de la propriété
  const centerOnProperty = () => {
    if (mapRef.current && annonce.coordonnee) {
      mapRef.current.animateToRegion({
        latitude: annonce.coordonnee.latitude,
        longitude: annonce.coordonnee.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Section Title */}
      <View style={styles.headerSection}>
        <Text style={styles.title}>Où se situe votre propriété ?</Text>
        <Text style={styles.subtitle}>
          Sélectionnez la localisation exacte de votre bien
        </Text>
      </View>

      {/* Section input Lieu */}
      <View style={styles.locationSection}>
        <Text style={styles.sectionLabel}>Adresse de la propriété</Text>
        <Pressable
          style={styles.container_input_lieu}
          onPress={() => setModalVisible(true)}
        >
          <EvilIcons name="location" size={28} color={Colors.primary} />
          <View style={styles.input_lieu}>
            <Text style={styles.addressText}>
              {annonce.adresse || "Appuyez pour sélectionner une adresse"}
            </Text>
          </View>
          <MaterialIcons name="search" size={20} color={Colors.gray} />
        </Pressable>

        {/* Boutons d'actions rapides */}
        <View style={styles.quickActions}>
          <Pressable
            style={styles.quickActionButton}
            onPress={getCurrentLocation}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <MaterialIcons name="my-location" size={20} color={Colors.primary} />
            )}
            <Text style={styles.quickActionText}>Ma position</Text>
          </Pressable>

          {userLocation && (
            <Pressable
              style={styles.quickActionButton}
              onPress={useCurrentLocation}
              disabled={loading}
            >
              <MaterialIcons name="add-location" size={20} color={Colors.primary} />
              <Text style={styles.quickActionText}>Utiliser ici</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Section Maps */}
      <View style={styles.mapSection}>
        <View style={styles.mapHeader}>
          <Text style={styles.sectionLabel}>Aperçu sur la carte</Text>
          <View style={styles.mapControls}>
            <Pressable style={styles.mapControlButton} onPress={toggleMapType}>
              <MaterialIcons name="layers" size={18} color={Colors.primary} />
            </Pressable>
            {annonce.coordonnee && (
              <Pressable style={styles.mapControlButton} onPress={centerOnProperty}>
                <MaterialIcons name="center-focus-strong" size={18} color={Colors.primary} />
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            region={currentRegion}
            mapType={mapType}
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsCompass={true}
          >
            {/* Marker de la propriété */}
            {annonce.coordonnee && (
              <Marker
                coordinate={{
                  latitude: annonce.coordonnee.latitude,
                  longitude: annonce.coordonnee.longitude,
                }}
                title={annonce.nomAnnonce || "Ma propriété"}
                description={annonce.adresse || "Localisation de la propriété"}
              >
                <View style={styles.propertyMarker}>
                  <MaterialIcons name="home" size={24} color={Colors.light} />
                </View>
              </Marker>
            )}

            {/* Marker de l'utilisateur si différent */}
            {userLocation && (
              <Marker
                coordinate={userLocation}
                title="Votre position"
                description="Vous êtes ici"
              >
                <View style={styles.userMarker}>
                  <View style={styles.userMarkerInner} />
                </View>
              </Marker>
            )}
          </MapView>

          {/* Message si pas de coordonnées */}
          {!annonce.coordonnee && (
            <View style={styles.noLocationOverlay}>
              <MaterialIcons name="location-off" size={48} color={Colors.gray} />
              <Text style={styles.noLocationText}>
                Aucune localisation sélectionnée
              </Text>
              <Text style={styles.noLocationSubtext}>
                Appuyez sur &quot;Rechercher une adresse&quot; pour commencer
              </Text>
            </View>
          )}
        </View>

        {/* Informations de localisation */}
        {annonce.coordonnee && (
          <View style={styles.locationInfo}>
            <View style={styles.locationInfoItem}>
              <MaterialIcons name="place" size={16} color={Colors.primary} />
              <Text style={styles.locationInfoText}>
                Coordonnées: {annonce.coordonnee.latitude.toFixed(4)}, {annonce.coordonnee.longitude.toFixed(4)}
              </Text>
            </View>
            <View style={styles.locationInfoItem}>
              <MaterialIcons name="info" size={16} color={Colors.gray} />
              <Text style={styles.locationInfoSubtext}>
                Cette position sera visible par les utilisateurs intéressés
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Modal de recherche */}
      <Modal_Search
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </ScrollView>
  );
};

export default Lieu_CreateAnnonce;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerSection: {
    marginBottom: 32,
  },

  title: {
    fontSize: 24,
    color: Colors.dark,
    fontWeight: "600",
    lineHeight: 32,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    lineHeight: 22,
  },

  locationSection: {
    marginBottom: 32,
  },

  sectionLabel: {
    fontSize: 18,
    color: Colors.dark,
    fontWeight: "500",
    marginBottom: 12,
  },

  container_input_lieu: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: Colors.light,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray + '30',
    marginBottom: 16,
  },

  input_lieu: {
    flex: 1,
    marginLeft: 12,
  },

  addressText: {
    fontSize: 16,
    color: Colors.dark,
    opacity: 0.9,
  },

  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },

  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },

  quickActionText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },

  mapSection: {
    marginBottom: 32,
  },

  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  mapControls: {
    flexDirection: 'row',
    gap: 8,
  },

  mapControlButton: {
    backgroundColor: Colors.light,
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },

  mapContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  map: {
    width: "100%",
    height: 300,
  },

  propertyMarker: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.light,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  userMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor:  '#4A90E2',
    borderWidth: 3,
    borderColor: Colors.light,
    alignItems: 'center',
    justifyContent: 'center',
  },

  userMarkerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light,
  },

  noLocationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  noLocationText: {
    fontSize: 18,
    color: Colors.gray,
    fontWeight: '600',
    textAlign: 'center',
  },

  noLocationSubtext: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
    paddingHorizontal: 32,
  },

  locationInfo: {
    backgroundColor: Colors.light + '80',
    padding: 16,
    gap: 8,
  },

  locationInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  locationInfoText: {
    fontSize: 14,
    color: Colors.dark,
    fontWeight: '500',
  },

  locationInfoSubtext: {
    fontSize: 12,
    color: Colors.gray,
    fontStyle: 'italic',
  },
});