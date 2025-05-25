import { Entypo } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Modal, Pressable, StyleSheet, View, Text, Button } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { DeviceMotion } from "expo-sensors";
import { Colors } from "../Colors";
import { EventSubscription } from "expo-modules-core";
import CircularProgress from "react-native-circular-progress-indicator";

type props = {
  cameraVisible: boolean;
  setCameraVisible: (cameraVisible: boolean) => void;
};

const Panorama_captures = ({ cameraVisible, setCameraVisible }: props) => {
  const [permission, requestPermission] = useCameraPermissions();
  const progressRef = useRef<any>(null); // ou CircularProgressHandle si typé
  const [progressValue, setProgressValue] = useState(0);
  const [rotation, setRotation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const ref = useRef<CameraView>(null);

  const tolérance_alpha = 20; // Tolérance pour l'orientation nord (±20°)
  const tolérance_beta_min = 75;
  const tolérance_beta_max = 80;
  const tolérance_gamma = 15;

    const radToDeg = (rad: number) => rad * (180 / Math.PI);

  // Fonction pour vérifier l'orientation vers le nord
  const isNorthOriented = (alpha: number) => {
    // Nord = 0° ou 360°, avec tolérance
    return alpha <= tolérance_alpha || alpha >= 360 - tolérance_alpha;
  };

  // condition pour verifier que le telephone est dans la bonne orientation
  const isStraight =
    isNorthOriented(rotation.alpha) &&
    tolérance_beta_min <= Math.abs(rotation.beta) &&
    Math.abs(rotation.beta) <= tolérance_beta_max &&
    Math.abs(rotation.gamma) <= tolérance_gamma;

  // conditon pour verfier que le telephone n'est pas penche
  const isPortrait = Math.abs(rotation.gamma) <= tolérance_gamma;

  useEffect(() => {
    let subscription: EventSubscription;

    const subscribe = async () => {
      subscription = DeviceMotion.addListener((rotationData) => {
        const { alpha, beta, gamma } = rotationData.rotation ?? {};

        const r = {
          alpha: Number(radToDeg(alpha ?? 0).toFixed(2)),
          beta: Number(radToDeg(beta ?? 0).toFixed(2)),
          gamma: Number(radToDeg(gamma ?? 0).toFixed(2)),
        };

        setRotation(r);
      });

      await DeviceMotion.setUpdateInterval(100);
    };

    if (cameraVisible) {
      subscribe();
    }

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [cameraVisible]); // Suppression de la dépendance rotation qui causait le cycle infini

  const cercle_plein = {
    transform: [
      { translateY: rotation.beta * 5 }, // Mouvement basé sur l'inclinaison avant/arrière
    ],

    backgroundColor: `${isPortrait ? "white" : Colors.primary}`,
    top: 40,
  };

  // Declencher l'animation
  useEffect(() => {
    if (isStraight ) {
      setProgressValue(100); // déclenche animation vers 100
    } else if (!isStraight) {
      setProgressValue(0);
      progressRef.current?.reAnimate();
    }
  }, [isStraight]);

  // Fonction pou la prise de photo

  const takePicture = async () => {
    if (progressValue === 100) {
     
      if (ref.current) {
        const photo = await ref.current.takePictureAsync();
        console.log("📷 Photo prise :", photo.uri);
      }

       alert("ok");
    }

    
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Nous avons besoin de la permission pour afficher la caméra{" "}
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <Modal visible={cameraVisible} animationType="slide">
      <View style={styles.container}>
        <CameraView style={styles.camera} facing={"back"}  ref={ref} />

        <Pressable
          onPress={() => setCameraVisible(!cameraVisible)}
          style={styles.icone_back}
        >
          <Entypo name="cross" size={30} color="white" />
        </Pressable>

        <Text style={styles.text_indication}>
          {isPortrait
            ? "  Pointez la caméra vers le point"
            : "  Redressz le telephone "}
        </Text>

        {/* Cercle d'orientation vide  au centre  */}
        <View style={styles.container_progress}>
          <CircularProgress
            ref={progressRef}
            value={progressValue}
            radius={52}
            duration={500}
            progressValueColor={"transparent"}
            activeStrokeColor={Colors.primary}
            inActiveStrokeColor={Colors.light}
            inActiveStrokeOpacity={0.9}
            inActiveStrokeWidth={8}
            activeStrokeWidth={8}
            onAnimationComplete={takePicture}
          />
        </View>

        {/* Cercle en mouvement  */}
        <View style={[styles.cercle_plein, cercle_plein]}></View>
      </View>
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
    fontWeight: "600",
  },
  camera: {
    flex: 1,
  },
  icone_back: {
    position: "absolute",
    alignItems: "flex-end",
    top: 60,
    right: 20,
    zIndex: 1,
  },
  text_indication: {
    position: "absolute",
    backgroundColor: Colors.light,
    top: "15%",
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontWeight: "500",
    borderRadius: 10,
    fontSize: 20,
    textAlign: "center",
  },

  container_progress: {
    position: "absolute",
    alignSelf: "center",
    top: "44%",
  },

  cercle_plein: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 50,

    // borderWidth: 4,
    borderColor: "white",
    alignSelf: "center",
  },

  conatiner_orientation: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    bottom: 100,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
  },

  status_container: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  status_item: {
    fontSize: 12,
    fontWeight: "500",
  },
});
