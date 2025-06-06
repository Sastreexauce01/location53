import { Entypo } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Modal, Pressable, StyleSheet, View, Text, Button } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { DeviceMotion } from "expo-sensors";
import { Colors } from "../Colors";
import { EventSubscription } from "expo-modules-core";
import CircularProgress from "react-native-circular-progress-indicator";
import Svg, { Line } from "react-native-svg";
import { useAtom } from "jotai";
import { Scene360_Atom } from "../../Data/Atoms";

type props = {
  cameraVisible: boolean;
  setCameraVisible: (cameraVisible: boolean) => void;
};

const Panorama_captures = ({ cameraVisible, setCameraVisible }: props) => {
  const [permission, requestPermission] = useCameraPermissions();
  const progressRef = useRef<any>(null); // ou CircularProgressHandle si typé
  const [progressValue, setProgressValue] = useState(0);
  const [rotation, setRotation] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [ecartangle, setecartAngle] = useState<number>(0);

  const ref = useRef<CameraView>(null);
  const [scene, setScene] = useAtom(Scene360_Atom);

  // const tolérance_alpha = 20; // Tolérance pour l'orientation nord (±20°)
  const tolérance_beta_min = 70;
  const tolérance_beta_max = 80;
  const tolérance_gamma = 15;

  const radToDeg = (rad: number) => rad * (180 / Math.PI);

  // condtion pou verifier l'inclinaison du telephone  beta x
  const isBeta =
    tolérance_beta_min <= Math.abs(rotation.beta) &&
    Math.abs(rotation.beta) <= tolérance_beta_max;

  // condition pour verifier la stabilite du telephone  gamma y
  const isGamma = Math.abs(rotation.gamma) <= tolérance_gamma;

  // condition pour verifier la direction du telephone alpha z

  useEffect(() => {
    if (scene.photos.length > 0) {
      const last_alpha = scene.photos[scene.photos.length - 1].rotation.alpha;
      const raw_diff = rotation.alpha - last_alpha;
      const ecart_angle = Math.abs(((raw_diff + 180) % 360) - 180);
      setecartAngle(ecart_angle);
    } else {
      setecartAngle(0); // Pas de photo précédente, on remet à zéro
    }
  }, [rotation.alpha, scene.photos]);

  const isAlpha = () => {
    if (scene.photos.length === 0) return true;
    return ecartangle >= 60 && ecartangle <= 65;
  };

  // condition pour verifier que le telephone est dans la bonne orientation
  const isStraight = isBeta && isGamma && isAlpha();

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

      await DeviceMotion.setUpdateInterval(5);
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
      {
        translateY: rotation.beta * 5,
      },
    ],

    backgroundColor: `${isGamma ? "white" : Colors.primary}`,
    top: 40,
  };

  const container_progress_style = {
    transform: [
      {
        translateX: scene.photos.length === 0 ? 0 : -(ecartangle - 60) * 5, //la procahine destination  );
      },
    ],
  };

  // Declencher l'animation
  useEffect(() => {
    if (isStraight) {
      setProgressValue(100); // déclenche animation vers 100
    } else if (!isStraight) {
      setProgressValue(0);
      progressRef.current?.reAnimate();
    }
  }, [isStraight]);

  // Fonction pou la prise de photo

  const takePicture = async () => {
    if (progressValue === 100 && ref.current) {
      const photo = await ref.current.takePictureAsync();
      alert(scene.photos.length);
      const newPhoto = {
        rotation: rotation,
        uri: photo.uri,
      };

      setScene((prevScene) => ({
        ...prevScene,
        photos: [...prevScene.photos, newPhoto],
      }));
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Nous avons besoin de la permission pour afficher la caméra
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <Modal visible={cameraVisible} animationType="slide">
      <View style={styles.container}>
        <CameraView style={styles.camera} facing={"back"} ref={ref} />

        <Pressable
          onPress={() => setCameraVisible(!cameraVisible)}
          style={styles.icone_back}
        >
          <Entypo name="cross" size={30} color="white" />
        </Pressable>

        <Text style={styles.text_indication}>
          {isAlpha()
            ? isBeta
              ? isGamma
                ? "  Pointez la caméra vers le point"
                : "Tourner a droite "
              : "Reicnclinez le telephone "
            : "  Redressz le telephone "}
        </Text>

        {/* Cercle d'orientation vide  au centre  */}
        <View style={[styles.container_progress, container_progress_style]}>
          <CircularProgress
            ref={progressRef}
            value={progressValue}
            radius={52}
            duration={200}
            progressValueColor={"transparent"}
            activeStrokeColor={Colors.primary}
            inActiveStrokeColor={Colors.light}
            inActiveStrokeOpacity={0.9}
            inActiveStrokeWidth={8}
            activeStrokeWidth={8}
            onAnimationComplete={takePicture}
          />
        </View>

        <View style={{ position: "absolute", width: "100%", top: "44%" }}>
          <Svg height="100" width="200">
            <Line
              x1="40"
              y1="55"
              x2={10}
              y2="55"
              stroke="#45b7d1"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="3,12"
            />
          </Svg>
        </View>
        {/* Cercle en mouvement  */}
        <View style={[styles.cercle_plein, cercle_plein]}></View>

        <View style={styles.conatiner_orientation}>
          <Text>Axe alpha Z : {rotation.alpha}°</Text>
          <Text>Axe beta X : {rotation.beta}°</Text>
          <Text>Axe gamma Y: {rotation.gamma}°</Text>
          <Text>Axe gamma Y: {rotation.gamma}°</Text>

          <Text>delta: {ecartangle} °</Text>

          <View style={styles.status_container}>
            <Text style={styles.status_item}>
              Inclinaison:
              {tolérance_beta_min <= Math.abs(rotation.beta) &&
              Math.abs(rotation.beta) <= tolérance_beta_max
                ? "✅"
                : "❌"}
            </Text>
            <Text style={styles.status_item}>
              Stabilité:{" "}
              {Math.abs(rotation.gamma) <= tolérance_gamma ? "✅" : "❌"}
            </Text>
          </View>

          {isStraight ? (
            <Text style={[styles.message, { color: "lime", marginTop: 10 }]}>
              ✅ Position parfaite !
            </Text>
          ) : (
            <Text style={[styles.message, { color: "red", marginTop: 10 }]}>
              Orientez vers le nord et ajustez l&lsquo;inclinaison...
            </Text>
          )}
        </View>
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
