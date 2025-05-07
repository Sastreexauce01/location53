import React from "react";
import MapView from "react-native-maps";
import { Pressable, StyleSheet, Text } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Colors } from "@/Components/Colors";
import { AnnonceType } from "@/assets/Types/type";


interface MapsResultsProps {
  setOpen: (value: boolean) => void;
  Appartement_filtre: AnnonceType[];
}

const MapsResults: React.FC<MapsResultsProps> = ({
  setOpen,
  Appartement_filtre,
}) => {
  //console.log(Appartement_filtre);
  return (
    <>
      <MapView style={styles.map} />

      {/* Section pour revenir à la liste */}
      <Pressable style={styles.container_list} onPress={() => setOpen(true)}>
        <Entypo name="list" size={20} color="black" />
        <Text>List</Text>
      </Pressable>
    </>
  );
};

export default MapsResults;

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },

  container_list: {
    position: "absolute",
    alignSelf: "center",
    bottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderWidth: 1,
    borderColor: Colors.dark,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,

    // Ombre pour iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,

    // Ombre pour Android
    elevation: 5,
  },
});
