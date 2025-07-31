import { Entypo } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  Text,
  Button,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { DeviceMotion } from "expo-sensors";
import { Colors } from "../../Colors";
import { EventSubscription } from "expo-modules-core";
import CircularProgress from "react-native-circular-progress-indicator";
import Svg, { Line } from "react-native-svg";
import { useAtom } from "jotai";
import { Scene360_Atom } from "../../../Data/Atoms";

type Props = {
  cameraVisible: boolean;
  setCameraVisible: (cameraVisible: boolean) => void;
};

interface Rotation {
  alpha: number;
  beta: number;
  gamma: number;
}

type CaptureMode = "horizontal" | "sky" | "ground";

interface CaptureConfig {
  mode: CaptureMode;
  betaRange: [number, number];
  description: string;
}

// Constantes pour l'orientation
const ORIENTATION_TOLERANCES = {
  BETA_MIN: 70,
  BETA_MAX: 80,
  GAMMA_MAX: 15,
  ANGLE_MIN: 60,
  ANGLE_MAX: 65,
  // Nouvelles constantes pour ciel et sol
  SKY_BETA_MIN: -100,
  SKY_BETA_MAX: -80,
  GROUND_BETA_MIN: 80,
  GROUND_BETA_MAX: 100,
} as const;

// Configuration des modes de capture
const CAPTURE_MODES: Record<CaptureMode, CaptureConfig> = {
  horizontal: {
    mode: "horizontal",
    betaRange: [70, 80],
    description: "Balayage horizontal",
  },
  sky: {
    mode: "sky",
    betaRange: [-100, -80],
    description: "Photo du ciel",
  },
  ground: {
    mode: "ground",
    betaRange: [80, 100],
    description: "Photo du sol",
  },
} as const;

const UPDATE_INTERVAL = 50; // ms
const PROGRESS_ANIMATION_DURATION = 500; // ms

const Panorama_captures = ({ cameraVisible, setCameraVisible }: Props) => {
  const [permission, requestPermission] = useCameraPermissions();
  const progressRef = useRef<any>(null);
  const cameraRef = useRef<CameraView>(null);

  const [progressValue, setProgressValue] = useState(0);
  const [rotation, setRotation] = useState<Rotation>({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentCaptureMode, setCurrentCaptureMode] =
    useState<CaptureMode>("horizontal");

  const [scene, setScene] = useAtom(Scene360_Atom);

  // Utilitaires
  const radToDeg = useCallback(
    (rad: number): number => rad * (180 / Math.PI),
    []
  );

  // Détermine le mode de capture basé sur le nombre de photos
  const getCaptureMode = useCallback((): CaptureMode => {
    const photoCount = scene.photos.length;
    if (photoCount < 6) return "horizontal";
    if (photoCount === 6) return "sky";
    return "ground";
  }, [scene.photos.length]);

  // Met à jour le mode de capture
  useEffect(() => {
    setCurrentCaptureMode(getCaptureMode());
  }, [getCaptureMode]);

  // Calcul de l'écart d'angle avec mémoisation (seulement pour le mode horizontal)
  const angleDeviation = useMemo(() => {
    if (currentCaptureMode !== "horizontal") return 0;
    if (scene.photos.length === 0) return 0;

    const lastAlpha = scene.photos[scene.photos.length - 1].rotation.alpha;
    const rawDiff = rotation.alpha - lastAlpha;
    return Math.abs(((rawDiff + 180) % 360) - 180);
  }, [rotation.alpha, scene.photos, currentCaptureMode]);

  // Vérifications d'orientation avec mémoisation
  const orientationChecks = useMemo(() => {
    let isBeta = false;
    let isAlpha = true;

    switch (currentCaptureMode) {
      case "horizontal":
        isBeta =
          ORIENTATION_TOLERANCES.BETA_MIN <= Math.abs(rotation.beta) &&
          Math.abs(rotation.beta) <= ORIENTATION_TOLERANCES.BETA_MAX;
        isAlpha =
          scene.photos.length === 0 ||
          (angleDeviation >= ORIENTATION_TOLERANCES.ANGLE_MIN &&
            angleDeviation <= ORIENTATION_TOLERANCES.ANGLE_MAX);
        break;
      case "sky":
        isBeta =
          ORIENTATION_TOLERANCES.SKY_BETA_MIN <= rotation.beta &&
          rotation.beta <= ORIENTATION_TOLERANCES.SKY_BETA_MAX;
        isAlpha = true; // Pas de contrainte d'angle pour le ciel
        break;
      case "ground":
        isBeta =
          ORIENTATION_TOLERANCES.GROUND_BETA_MIN <= rotation.beta &&
          rotation.beta <= ORIENTATION_TOLERANCES.GROUND_BETA_MAX;
        isAlpha = true; // Pas de contrainte d'angle pour le sol
        break;
    }

    const isGamma =
      Math.abs(rotation.gamma) <= ORIENTATION_TOLERANCES.GAMMA_MAX;

    return { isBeta, isGamma, isAlpha };
  }, [
    rotation.beta,
    rotation.gamma,
    angleDeviation,
    currentCaptureMode,
    scene.photos.length,
  ]);

  const isPerfectOrientation =
    orientationChecks.isBeta &&
    orientationChecks.isGamma &&
    orientationChecks.isAlpha;

  // Message d'orientation amélioré
  const orientationMessage = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const config = CAPTURE_MODES[currentCaptureMode];

    if (currentCaptureMode === "sky") {
      if (!orientationChecks.isBeta)
        return "Pointez vers le ciel (inclinez vers le haut)";
      if (!orientationChecks.isGamma) return "Stabilisez le téléphone";
      return "Parfait ! Capturez le ciel";
    }

    if (currentCaptureMode === "ground") {
      if (!orientationChecks.isBeta)
        return "Pointez vers le sol (inclinez vers le bas)";
      if (!orientationChecks.isGamma) return "Stabilisez le téléphone";
      return "Parfait ! Capturez le sol";
    }

    // Mode horizontal
    if (!orientationChecks.isAlpha)
      return "Tournez de 60° depuis la dernière photo";
    if (!orientationChecks.isBeta)
      return "Inclinez le téléphone horizontalement";
    if (!orientationChecks.isGamma) return "Stabilisez le téléphone";
    return "Pointez la caméra vers le point";
  }, [orientationChecks, currentCaptureMode]);

  // Gestion des capteurs avec nettoyage approprié
  useEffect(() => {
    let subscription: EventSubscription;

    const subscribeToMotion = async () => {
      try {
        await DeviceMotion.setUpdateInterval(UPDATE_INTERVAL);

        subscription = DeviceMotion.addListener((motionData) => {
          const { alpha, beta, gamma } = motionData.rotation ?? {};

          if (
            alpha !== undefined &&
            beta !== undefined &&
            gamma !== undefined
          ) {
            setRotation({
              alpha: Number(radToDeg(alpha).toFixed(2)),
              beta: Number(radToDeg(beta).toFixed(2)),
              gamma: Number(radToDeg(gamma).toFixed(2)),
            });
          }
        });
      } catch (error) {
        console.error("Erreur lors de l'initialisation des capteurs:", error);
      }
    };

    if (cameraVisible) {
      subscribeToMotion();
    }

    return () => {
      subscription?.remove();
    };
  }, [cameraVisible, radToDeg]);

  // Gestion de l'animation de progression
  useEffect(() => {
    if (isPerfectOrientation && !isCapturing) {
      setProgressValue(100);
    } else {
      setProgressValue(0);
      progressRef.current?.reAnimate();
    }
  }, [isPerfectOrientation, isCapturing]);

  // Fonction de capture améliorée
  const takePicture = useCallback(async () => {
    if (progressValue !== 100 || !cameraRef.current || isCapturing) return;

    setIsCapturing(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: false,
      });

      if (photo?.uri) {
        const newPhoto = {
          rotation: { ...rotation },
          uri: photo.uri,
          timestamp: Date.now(),
          mode: currentCaptureMode,
        };

        setScene((prevScene) => ({
          ...prevScene,
          photos: [...prevScene.photos, newPhoto],
        }));

        // Feedback visuel avec mode spécifique
        const modeText =
          currentCaptureMode === "horizontal"
            ? "horizontale"
            : currentCaptureMode === "sky"
            ? "du ciel"
            : "du sol";

        Alert.alert(
          "Photo capturée",
          `Photo ${modeText} ajoutée (${scene.photos.length + 1}/8)`,
          [{ text: "OK" }]
        );

        // Vérifier si le panorama est complet
        if (scene.photos.length + 1 === 8) {
          setTimeout(() => {
            Alert.alert(
              "Panorama terminé !",
              "Votre panorama 360° est maintenant complet avec 8 photos.",
              [
                {
                  text: "Voir le résultat",
                  onPress: () => setCameraVisible(false),
                },
                { text: "Continuer", style: "cancel" },
              ]
            );
          }, 500);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la capture:", error);
      Alert.alert("Erreur", "Impossible de prendre la photo");
    } finally {
      setIsCapturing(false);
    }
  }, [
    progressValue,
    isCapturing,
    rotation,
    currentCaptureMode,
    setScene,
    scene.photos.length,
    setCameraVisible,
  ]);

  // Styles dynamiques avec mémoisation
  const dynamicStyles = useMemo(
    () => ({
      orientationCircle: {
        transform: [{ translateY: rotation.beta * 5 }],
        backgroundColor: orientationChecks.isGamma ? "white" : Colors.primary,
        top: 40,
      },
      progressContainer: {
        transform: [
          {
            translateX:
              scene.photos.length === 0 ? 0 : -(angleDeviation - 60) * 5,
          },
        ],
      },
    }),
    [
      rotation.beta,
      orientationChecks.isGamma,
      angleDeviation,
      scene.photos.length,
    ]
  );

  // Gestion des permissions
  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Nous avons besoin de la permission pour afficher la caméra
        </Text>
        <Button onPress={requestPermission} title="Accorder la permission" />
      </View>
    );
  }

  return (
    <Modal visible={cameraVisible} animationType="slide">
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing="back"
          ref={cameraRef}
          animateShutter={false}
        />

        {/* Bouton de fermeture */}
        <Pressable
          onPress={() => setCameraVisible(false)}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Entypo name="cross" size={30} color="white" />
        </Pressable>

        {/* Indicateur de progression */}
        <Text style={styles.progressText}>
          {scene.photos.length} / 6 photos
        </Text>

        {/* Message d'orientation */}
        <Text style={styles.orientationMessage}>{orientationMessage}</Text>

        {/* Cercle de progression avec couleur selon le mode */}
        <View
          style={[styles.progressContainer, dynamicStyles.progressContainer]}
        >
          <CircularProgress
            ref={progressRef}
            value={progressValue}
            radius={52}
            duration={PROGRESS_ANIMATION_DURATION}
            progressValueColor="transparent"
            activeStrokeColor={
              currentCaptureMode === "sky"
                ? "#87CEEB"
                : currentCaptureMode === "ground"
                ? "#8B4513"
                : Colors.primary
            }
            inActiveStrokeColor={Colors.light}
            inActiveStrokeOpacity={0.9}
            inActiveStrokeWidth={8}
            activeStrokeWidth={8}
            onAnimationComplete={takePicture}
          />

          {/* Icône au centre selon le mode */}
          <View style={styles.progressIcon}>
            <Ionicons
              name={
                currentCaptureMode === "sky"
                  ? "sunny"
                  : currentCaptureMode === "ground"
                  ? "earth"
                  : "camera"
              }
              size={24}
              color={
                currentCaptureMode === "sky"
                  ? "#87CEEB"
                  : currentCaptureMode === "ground"
                  ? "#8B4513"
                  : Colors.primary
              }
            />
          </View>
        </View>

        {/* Ligne de guidage (seulement pour le mode horizontal) */}
        {currentCaptureMode === "horizontal" && (
          <View style={styles.guideLine}>
            <Svg height="100" width="200">
              <Line
                x1="40"
                y1="55"
                x2="10"
                y2="55"
                stroke="#45b7d1"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="3,12"
              />
            </Svg>
          </View>
        )}

        {/* Cercle d'orientation */}
        <View
          style={[styles.orientationCircle, dynamicStyles.orientationCircle]}
        />

        {/* Informations de débogage (optionnel) */}
        {__DEV__ && (
          <View style={styles.debugInfo}>
            <Text style={styles.debugText}>Alpha (Z): {rotation.alpha}°</Text>
            <Text style={styles.debugText}>Beta (X): {rotation.beta}°</Text>
            <Text style={styles.debugText}>Gamma (Y): {rotation.gamma}°</Text>
            <Text style={styles.debugText}>Mode: {currentCaptureMode}</Text>
            <Text style={styles.debugText}>
              Écart: {angleDeviation.toFixed(1)}°
            </Text>

            <View style={styles.statusContainer}>
              <Text style={styles.statusItem}>
                Inclinaison: {orientationChecks.isBeta ? "✅" : "❌"}
              </Text>
              <Text style={styles.statusItem}>
                Stabilité: {orientationChecks.isGamma ? "✅" : "❌"}
              </Text>
              <Text style={styles.statusItem}>
                Angle: {orientationChecks.isAlpha ? "✅" : "❌"}
              </Text>
            </View>

            <Text
              style={[
                styles.message,
                {
                  color: isPerfectOrientation ? "lime" : "red",
                  marginTop: 10,
                },
              ]}
            >
              {isPerfectOrientation
                ? "✅ Position parfaite !"
                : "❌ Ajustez l'orientation"}
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default Panorama_captures;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "black",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    fontWeight: "600",
    color: "white",
  },
  camera: {
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 20,
    padding: 5,
  },
  progressText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  modeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 2,
  },
  progressInfo: {
    position: "absolute",
    top: 70,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  orientationMessage: {
    position: "absolute",
    backgroundColor: Colors.light,
    top: "15%",
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontWeight: "500",
    borderRadius: 10,
    fontSize: 18,
    textAlign: "center",
    maxWidth: "80%",
  },
  progressContainer: {
    position: "absolute",
    alignSelf: "center",
    top: "44%",
  },
  progressIcon: {
    position: "absolute",
    alignSelf: "center",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  guideLine: {
    position: "absolute",
    width: "100%",
    top: "44%",
  },
  orientationCircle: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "white",
    alignSelf: "center",
  },
  debugInfo: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    bottom: 100,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
  },
  debugText: {
    fontSize: 12,
    marginBottom: 2,
  },
  statusContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  statusItem: {
    fontSize: 12,
    fontWeight: "500",
    marginHorizontal: 5,
  },
});
