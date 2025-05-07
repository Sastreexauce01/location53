import React  from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Modal,
} from "react-native";
import { BlurView } from "expo-blur";
import LottieView from "lottie-react-native";
type props = {
  modalVisible: boolean;
  setModalVisible: any;
};

const Final_CreateAnnonce = ({ modalVisible, setModalVisible }: props) => {
  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)} // Retour pour android pour fermer le modal
    >
      <Pressable onPress={() => setModalVisible(!modalVisible)} style={{flex:1}}>
        <BlurView intensity={20} style={styles.modalOverlay}>
          <View style={styles.container}>
            <LottieView
              source={require("@/Data/Animation_validation.json")}
              autoPlay
              loop
              style={{ width: 100, height: 100 }}
            />
            <Text>Votre annonce sera lu et approuve par notre equipe</Text>
          </View>
        </BlurView>
      </Pressable>
    </Modal>
  );
};

export default Final_CreateAnnonce;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 20, 89, 0.7)", // Fond semi-transparent
    justifyContent: "flex-end",
    alignItems: "center",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    padding: 15,
    backgroundColor: "white",
    width: "100%",
    height: "50%",
    borderRadius: 50,
  },
});
