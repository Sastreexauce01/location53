import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, View, Text, Button } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";

type props = {
  cameraVisible: boolean;
  setCameraVisible: (cameraVisible: boolean) => void;
};
const Panorama_captures = ({ cameraVisible, setCameraVisible }: props) => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Nous avons besoins de la permission pour afficher la cemera{" "}
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }


  return (
    <Modal visible={cameraVisible} animationType="slide">
      <CameraView style={styles.camera} facing={"back"}>
        <Pressable
          onPress={() => setCameraVisible(!cameraVisible)}
          style={styles.icone_back}
        >
          <Entypo name="cross" size={30} color="white" />
        </Pressable>
      </CameraView>
    </Modal>
  );
};

export default Panorama_captures;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },

  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },

  icone_back:{
 position: "absolute",
            alignItems: "flex-end",
            top: 60,
            right: 20,
  }
});
