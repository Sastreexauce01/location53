import React, { useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { Colors } from "../Colors";
import { EvilIcons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import Modal_Search from "../Modal_Search";
import { useAnnonce } from "@/assets/hooks/useAnnonce";

const Lieu_CreateAnnonce = () => {
  const { annonce, saveAnnonce } = useAnnonce();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Section Title */}
      <View>
        <Text style={styles.title}>Ou se situe votre propriete</Text>
      </View>

      {/* Section input Lieu  */}
      <Pressable
        style={styles.container_input_lieu}
        onPress={() => setModalVisible(true)}
      >
        <EvilIcons name="location" size={30} color={Colors.dark} />

        <View style={styles.input_lieu}>
          <Text style={{ opacity: 0.9, color: "black" }}>
            {annonce.adresse}
          </Text>
        </View>
      </Pressable>

      {/* Section Maps  */}
      <MapView
        style={styles.map}
        //  mapType="satellite"
        region={{
          latitude: annonce.coordonnee.latitude,
          longitude: annonce.coordonnee.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: annonce.coordonnee.latitude,
            longitude: annonce.coordonnee.longitude,
          }}
          title={annonce.nomAnnonce}
          description={annonce.adresse}
        />
      </MapView>

      {/* Modal */}

      <Modal_Search
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </View>
  );
};

export default Lieu_CreateAnnonce;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderWidth: 1,
    gap: 20,
    padding: 5,
    //backgroundColor:'green'
  },
  title: {
    fontSize: 25,
    color: Colors.dark,
  },

  container_input_lieu: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: Colors.light,
    alignItems: "center",
    borderRadius: 8,
  },
  input_lieu: {
    flex: 1,
    // backgroundColor:'green'
  },

  map: {
    width: "100%",
    height: 500,
    borderRadius: 15,
  },
});
