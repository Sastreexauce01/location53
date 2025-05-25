import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../Colors";
import Panorama_captures from "./Panorama_captures";
type props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};
const Numerisation = ({ visible, setVisible }: props) => {
  const [cameraVisible, setCameraVisible] = useState(false);
  return (
    <Modal visible={!visible} animationType="fade" style={styles.container}>
      {/* Section Header  */}
      <View style={styles.head_container}>
        <Pressable onPress={() => setVisible(!visible)}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </Pressable>

        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          Sans tittre
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => true}>
          <Text style={styles.buttonText}>Charger</Text>
        </TouchableOpacity>
      </View>
      {/* Section All scenes  */}
      <View style={styles.scenes_container}>
        <Text>2 Scenes numeriser</Text>
        <Text>
          Vos numérisations apparaîtront ici Appuyez sur le bouton de la caméra
          pour commencer à numériser avec votre iPhone ou sélectionnez
          une caméra externe
        </Text>
      </View>

      {/* Section navigation or options  */}

      <View style={styles.options_container}>
        <Text>Options</Text>
        <Pressable
          style={styles.cercle_container}
          onPress={() => setCameraVisible(!cameraVisible)}
        >
          <View style={styles.cercle}></View>
        </Pressable>
      </View>
      <Panorama_captures
        cameraVisible={cameraVisible}
        setCameraVisible={setCameraVisible}
      />
    </Modal>
  );
};

export default Numerisation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
  },

  head_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 100,
    paddingTop: 50,
    paddingHorizontal: 10,
    alignItems: "center",
    backgroundColor: "#ccc",
  },

  title: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },

  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 100,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "semibold",
    fontSize: 14,
  },

  scenes_container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#cefd",
  },

  options_container: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    position: "absolute",
    bottom: 50,
    right: "40%",
  },

  cercle_container: {
    height: 80,
    width: 80,
    borderWidth: 2,
    borderRadius: "100%",
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  cercle: {
    height: "95%",
    width: "95%",
    borderRadius: "100%",
    backgroundColor: Colors.primary,
  },
});
