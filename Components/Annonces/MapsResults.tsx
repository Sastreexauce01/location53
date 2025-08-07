import React, { useState, useRef } from "react";
import MapView, { Marker, Callout, Region } from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/Components/Colors";
import { AnnonceType } from "@/assets/Types/type";
import { router } from "expo-router";

interface MapsResultsProps {
  setOpen: (value: boolean) => void;
  Appartement_filtre: AnnonceType[];
}

const { width } = Dimensions.get("window");

const MapsResults: React.FC<MapsResultsProps> = ({
  setOpen,
  Appartement_filtre,
}) => {
  const mapRef = useRef<MapView>(null);
  const [selectedProperty, setSelectedProperty] = useState<AnnonceType | null>(
    null
  );
  const [mapType, setMapType] = useState<"standard" | "satellite">("standard");

  // Configuration de la région par défaut (Cotonou, Bénin)
  const defaultRegion: Region = {
    latitude: 6.3654,
    longitude: 2.4183,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  // Calculer la région pour afficher tous les marqueurs
  const getRegionForMarkers = () => {
    if (Appartement_filtre.length === 0) return defaultRegion;

    const coordinates = Appartement_filtre.filter(
      (item) => item.coordonnee?.latitude && item.coordonnee?.longitude
    ).map((item) => ({
      latitude: item.coordonnee.latitude,
      longitude: item.coordonnee.longitude,
    }));

    if (coordinates.length === 0) return defaultRegion;

    const latitudes = coordinates.map((coord) => coord.latitude);
    const longitudes = coordinates.map((coord) => coord.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    const deltaLat = (maxLat - minLat) * 1.3; // Ajouter une marge
    const deltaLng = (maxLng - minLng) * 1.3;

    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: Math.max(deltaLat, 0.01),
      longitudeDelta: Math.max(deltaLng, 0.01),
    };
  };

  const handleMarkerPress = (property: AnnonceType) => {
    setSelectedProperty(property);
  };

  const handlePropertyPress = (property: AnnonceType) => {
    router.push(`/annonces/${property.id}`);
  };

  const centerOnMarkers = () => {
    const region = getRegionForMarkers();
    mapRef.current?.animateToRegion(region, 1000);
  };

  const toggleMapType = () => {
    setMapType(mapType === "standard" ? "satellite" : "standard");
  };

  const renderMarker = (property: AnnonceType, index: number) => {
    if (!property.coordonnee?.latitude || !property.coordonnee?.longitude)
      return null;

    const coordinate = {
      latitude: property.coordonnee.latitude,
      longitude: property.coordonnee.longitude,
    };

    return (
      <Marker
        key={property.id}
        coordinate={coordinate}
        onPress={() => handleMarkerPress(property)}
      >
        <View
          style={[
            styles.markerContainer,
            selectedProperty?.id === property.id && styles.selectedMarker,
          ]}
        >
          <Text style={styles.markerText}>
            {property.prix ? `${property.prix}€` : "?"}
          </Text>
        </View>

        <Callout tooltip onPress={() => handlePropertyPress(property)}>
          <View style={styles.calloutContainer}>
            {property.image && property.image[0] && (
              <Image
                source={{ uri: property.image[0] }}
                style={styles.calloutImage}
              />
            )}
            <View style={styles.calloutContent}>
              <Text style={styles.calloutTitle} numberOfLines={1}>
                {property.nomAnnonce}
              </Text>
              <Text style={styles.calloutAddress} numberOfLines={1}>
                {property.adresse}
              </Text>
              <Text style={styles.calloutPrice}>
                {property.prix}€{" "}
                {property.typeAnnonce === "location" ? "/mois" : ""}
              </Text>
              <View style={styles.propertyFeatures}>
                <Text style={styles.featureText}>
                  {property.nbre_chambre} ch • {property.nbre_salle_bains} sdb
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={Colors.gray} />
          </View>
        </Callout>
      </Marker>
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        mapType={mapType}
        initialRegion={getRegionForMarkers()}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
      >
        {Appartement_filtre.map(renderMarker)}
      </MapView>

      {/* Controls Top */}
      <View style={styles.topControls}>
        {/* Statistiques */}
        <View style={styles.statsContainer}>
          <MaterialIcons name="location-on" size={16} color={Colors.primary} />
          <Text style={styles.statsText}>
            {Appartement_filtre.length} propriété
            {Appartement_filtre.length > 1 ? "s" : ""}
          </Text>
        </View>

        {/* Boutons de contrôle */}
        <View style={styles.controlButtons}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleMapType}
          >
            <MaterialIcons
              name={mapType === "standard" ? "satellite" : "map"}
              size={18}
              color={Colors.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={centerOnMarkers}
          >
            <MaterialIcons
              name="center-focus-strong"
              size={18}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Property Preview Card */}
      {selectedProperty && (
        <View style={styles.propertyCard}>
          <TouchableOpacity
            style={styles.cardContent}
            onPress={() => handlePropertyPress(selectedProperty)}
          >
            {selectedProperty.image && selectedProperty.image[0] && (
              <Image
                source={{ uri: selectedProperty.image[0] }}
                style={styles.cardImage}
              />
            )}
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {selectedProperty.nomAnnonce}
              </Text>
              <Text style={styles.cardAddress} numberOfLines={1}>
                {selectedProperty.adresse}
              </Text>
              <Text style={styles.cardPrice}>
                {selectedProperty.prix}€
                {selectedProperty.typeAnnonce === "location" ? " /mois" : ""}
              </Text>
              <View style={styles.cardFeatures}>
                <Text style={styles.cardFeatureText}>
                  {selectedProperty.nbre_chambre} chambres •{" "}
                  {selectedProperty.nbre_salle_bains} sdb
                </Text>
                <Text style={styles.cardCategory}>
                  {selectedProperty.categorie}
                </Text>
              </View>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={Colors.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedProperty(null)}
          >
            <MaterialIcons name="close" size={16} color={Colors.gray} />
          </TouchableOpacity>
        </View>
      )}

      {/* List Button */}
      <TouchableOpacity style={styles.listButton} onPress={() => setOpen(true)}>
        <Entypo name="list" size={18} color="white" />
        <Text style={styles.listButtonText}>Liste</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MapsResults;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    width: "100%",
    height: "100%",
  },

  topControls: {
    position: "absolute",
    top: 20,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  statsText: {
    fontSize: 12,
    color: Colors.dark,
    fontWeight: "500",
  },

  controlButtons: {
    flexDirection: "row",
    gap: 8,
  },

  controlButton: {
    backgroundColor: "white",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  markerContainer: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  selectedMarker: {
    backgroundColor: Colors.dark,
    transform: [{ scale: 1.1 }],
  },

  markerText: {
    color: "white",
    fontSize: 11,
    fontWeight: "600",
  },

  calloutContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.8,
    maxWidth: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },

  calloutImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },

  calloutContent: {
    flex: 1,
  },

  calloutTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.dark,
    marginBottom: 2,
  },

  calloutAddress: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 4,
  },

  calloutPrice: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 4,
  },

  propertyFeatures: {
    marginTop: 2,
  },

  featureText: {
    fontSize: 11,
    color: Colors.gray,
    fontWeight: "400",
  },

  propertyCard: {
    position: "absolute",
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },

  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },

  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },

  cardInfo: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark,
    marginBottom: 4,
  },

  cardAddress: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 4,
  },

  cardPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 4,
  },

  cardFeatures: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardFeatureText: {
    fontSize: 11,
    color: Colors.gray,
  },

  cardCategory: {
    fontSize: 10,
    color: Colors.primary,
    backgroundColor: Colors.light,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    textTransform: "capitalize",
  },

  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light,
    justifyContent: "center",
    alignItems: "center",
  },

  listButton: {
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  listButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
