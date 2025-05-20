import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Button,
  Modal,
  SafeAreaView,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { DeviceMotion } from "expo-sensors";
import { Entypo } from "@expo/vector-icons";
import { Colors } from "../Colors";
import CircularProgress from "react-native-circular-progress-indicator";
import { PlaySound } from "@/assets/hooks/playSound";
import takePhoto from "@/assets/hooks/takePhoto";

type props = {
  cameraVisible: boolean;
  setCameraVisible: any;
};

const Space_cameraView = ({ cameraVisible, setCameraVisible }: props) => {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [rotation, setRotation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const cameraRef = useRef<CameraView | null>(null);
  const [readyToCapture, setReadyToCapture] = useState(false);
 //const animatedY = useRef(new Animated.Value(0)).current;
  const radToDeg = (rad: number) => rad * (180 / Math.PI); // Conversion en degre
  const TOLERANCE = 40; // degré de tolérance (plus bas = plus précis) //🎯 Tolérance pour détecter si le téléphone est bien droit
  const isStraight = Math.abs(rotation.alpha) < TOLERANCE 
 
  const [value, setValue] = useState(0);

 // console.log(rotation.alpha,rotation.beta,rotation.gamma)
  useEffect(() => {

    const subscription = DeviceMotion.addListener((motionData) => {
      const { alpha, beta, gamma } = motionData.rotation ?? {};
      const r = {
        alpha: radToDeg(alpha ?? 0),
        beta: radToDeg(beta ?? 0),
        gamma: radToDeg(gamma ?? 0),
      };

      setRotation(r);
     
      if (isStraight ) {
        setValue(100)
        setReadyToCapture(true);
        takePhoto(cameraRef);
        PlaySound();
      } else if (!isStraight && readyToCapture) {
        setReadyToCapture(false);
      }
    });

    DeviceMotion.setUpdateInterval(100); //Executer 10 fois en 1s

    return () => {
      subscription.remove();
    };
  }, [isStraight, readyToCapture, rotation]);


  const circleStyle = {
    transform: [
      // { translateX: rotation.gamma * 100 }, // Déplacement sur l'axe X
      { translateY: rotation.alpha}, // Déplacement sur l'axe Y
    ],
    backgroundColor: isStraight ? `${Colors.primary}` : "white",
  };

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <Modal
      style={styles.container}
      visible={cameraVisible}
      animationType="fade"
    >
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <SafeAreaView style={styles.safeArea}>
          {/* Message feedback */}
          {readyToCapture ? (
            <Text style={[styles.message, { color: "lime", marginTop: 10 }]}>
              ✅ Parfait !
            </Text>
          ) : (
            <Text style={[styles.message, { color: "red", marginTop: 10 }]}>
              Redressez le téléphone...
            </Text>
          )}

          {/* Cercle  Vide */}
          <CircularProgress
            value={value}
            radius={50}
            inActiveStrokeColor={Colors.light}
            activeStrokeColor={Colors.primary}
            inActiveStrokeOpacity={1}
            progressValueColor={Colors.primary}
            duration={1000}
            onAnimationComplete={() => {
             setValue(0)
            }}
          />

          {/* Cercle Plein */}
          <View style={[styles.filledCircle, circleStyle]} />
        </SafeAreaView>

        <Pressable
          onPress={() => setCameraVisible(!cameraVisible)}
          style={{
            position: "absolute",
            alignItems: "flex-end",
            top: 60,
            right: 25,
          }}
        >
          <Entypo name="cross" size={30} color="white" />
        </Pressable>
      </CameraView>
    </Modal>
  );
};

export default Space_cameraView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },


  filledCircle: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: "100%",
    backgroundColor: "orange",
    zIndex: 10,
  },

  message: {
    position: "absolute",
    top: 200,
    fontSize: 15,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
});


