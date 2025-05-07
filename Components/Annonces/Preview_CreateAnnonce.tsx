import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Modal } from "react-native";


import { Colors } from "../Colors";
import AppartementItem from "../home/AppartementItem";
import Detail_Annonce from "../Detail_Annonce";
import { Fontisto } from "@expo/vector-icons";
import { useAnnonce } from "@/assets/hooks/useAnnonce";

const Preview_CreateAnnonce = () => {
  const { annonce} = useAnnonce();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Section Title */}
      <View>
        <Text style={styles.title}>
          Jettez un dernier regard a votre annonce
        </Text>
      </View>

      {/* Section annonce */}
      <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
        <AppartementItem item={annonce} />
      </TouchableOpacity>
      {/* Section Moal Preview Detail Annonce */}
      <Modal visible={modalVisible} animationType="slide">
        <TouchableOpacity
          onPress={() => setModalVisible(!modalVisible)}
          style={styles.icone_back}
        >
          <Fontisto name="angle-left" size={20} color={Colors.dark} />
        </TouchableOpacity>

        <Detail_Annonce item={annonce} />
      </Modal>
    </View>
  );
};

export default Preview_CreateAnnonce;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //borderWidth: 1,
    alignItems: "center",
    gap: 50,
    padding: 0,
  },
  title: {
    fontSize: 25,
    color: Colors.dark,
  },

  icone_back: {
    backgroundColor: Colors.light,
    padding: 10,
    borderRadius: 25,
    position: "absolute",
    top: 50,
    left: 10,
    zIndex: 20,
  },
});
