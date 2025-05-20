/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Button,
  Modal,
  SafeAreaView,
  Image,
  FlatList,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { DeviceMotion } from "expo-sensors";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../Colors";
import CircularProgress from "react-native-circular-progress-indicator";
import { CameraType } from "expo-image-picker";

interface PanoCaptureProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onCapture?: (captureData: CaptureData) => void;
}

interface Rotation {
  alpha: number;
  beta: number;
  gamma: number;
}

export interface CaptureData {
  uri: string;
  rotation: Rotation;
  position: number;
  timestamp: number;
}

const PanoramaCapture: React.FC<PanoCaptureProps> = ({
  visible,
  setVisible,
  onCapture,
}) => {
  // Camera state
  const [facing, setFacing] = useState<CameraType>(CameraType.back);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);

  // Motion tracking for guidance
  const [rotation, setRotation] = useState<Rotation>({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });
  const [readyToCapture, setReadyToCapture] = useState<boolean>(false);
  const [progressValue, setProgressValue] = useState<number>(0);

  // Captures management
  const [captures, setCaptures] = useState<CaptureData[]>([]);
  const [captureMode, setCaptureMode] = useState<"auto" | "manual">("auto");
  const [showGallery, setShowGallery] = useState(false);

  // Constants for guidance
  const radToDeg = (rad: number): number => rad * (180 / Math.PI);
  const TOLERANCE = 10; // Smaller value = more precision required

  // Helper for checking if position is good for capture
  const isStraight = Math.abs(rotation.alpha) < TOLERANCE;
  const capturePositions = [0, 45, 90, 135, 180, 225, 270, 315]; // Positions for a full 360° (in degrees)
  const [currentPositionIndex, setCurrentPositionIndex] = useState<number>(0);
  const [lastCaptureGamma, setLastCaptureGamma] = useState<number | null>(null);

  // A 15° window is considered good for capture
  const isInCaptureWindow = (): boolean => {
    const targetAngle = capturePositions[currentPositionIndex];
    const currentAngle = normalizeAngle(radToDeg(rotation.gamma || 0));
    const angleDiff = Math.abs(targetAngle - currentAngle);
    return angleDiff < 15 || 360 - angleDiff < 15;
  };

  // Normalize angle to 0-360 range
  const normalizeAngle = (angle: number): number => {
    angle = angle % 360;
    if (angle < 0) angle += 360;
    return angle;
  };

  // Device motion tracking
  useEffect(() => {
    const subscription = DeviceMotion.addListener((motionData) => {
      const { alpha, beta, gamma } = motionData.rotation || {};
      const r = {
        alpha: radToDeg(alpha || 0),
        beta: radToDeg(beta || 0),
        gamma: radToDeg(gamma || 0),
      };
      setRotation(r);

      // Auto-capture mode
      if (captureMode === "auto" && isStraight && isInCaptureWindow()) {
        // Make sure we don't capture the same position twice
        const normalizedGamma = normalizeAngle(r.gamma);
        if (
          lastCaptureGamma === null ||
          Math.abs(normalizedGamma - lastCaptureGamma) > 30
        ) {
          setReadyToCapture(true);
          setProgressValue(100);
          handleCapture();
          setLastCaptureGamma(normalizedGamma);
        }
      } else {
        setReadyToCapture(false);
        setProgressValue(isStraight ? 50 : 0);
      }
    });

    DeviceMotion.setUpdateInterval(100);

    return () => {
      subscription.remove();
    };
  }, [isStraight, captureMode, currentPositionIndex, lastCaptureGamma]);

  // Take a photo when ready
  const handleCapture = async (): Promise<void> => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          exif: true,
        });

        const newCapture: CaptureData = {
          uri: photo.uri,
          rotation: { ...rotation },
          position: capturePositions[currentPositionIndex],
          timestamp: new Date().getTime(),
        };

        setCaptures([...captures, newCapture]);

        // Move to next position
        setCurrentPositionIndex(
          (currentPositionIndex + 1) % capturePositions.length
        );

        // Notify parent component
        if (onCapture) onCapture(newCapture);

        // Reset progress
        setTimeout(() => {
          setProgressValue(0);
          setReadyToCapture(false);
        }, 500);
      } catch (error) {
        console.error("Failed to take photo:", error);
        Alert.alert("Erreur", "Impossible de prendre la photo.");
      }
    }
  };

  const toggleCameraType = (): void => {
    setFacing((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const toggleCaptureMode = (): void => {
    setCaptureMode((current) => (current === "auto" ? "manual" : "auto"));
  };

  const deleteCapture = (index: number): void => {
    Alert.alert(
      "Supprimer l'image",
      "Êtes-vous sûr de vouloir supprimer cette capture ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            const newCaptures = [...captures];
            newCaptures.splice(index, 1);
            setCaptures(newCaptures);
          },
        },
      ]
    );
  };

  // Permission handling
  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Nous avons besoin de votre permission pour accéder à l&#39;appareil
          photo
        </Text>
        <Button onPress={requestPermission} title="Autoriser l'accès" />
      </View>
    );
  }

  // Gallery view component
  const renderGallery = (): React.ReactElement => (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.galleryContainer}>
        <View style={styles.galleryHeader}>
          <Text style={styles.galleryTitle}>
            Captures 360° ({captures.length}/8)
          </Text>

          <Pressable onPress={() => setShowGallery(false)}>
            <MaterialIcons name="close" size={24} color="blue" />
          </Pressable>
        </View>

        {captures.length === 0 ? (
          <View style={styles.emptyGallery}>
            <Text>Aucune capture n&lsquo;a été réalisée</Text>
          </View>
        ) : (
          <FlatList
            data={captures}
            keyExtractor={(_, index) => index.toString()}
            numColumns={2}
            renderItem={({ item, index }) => (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.uri }}
                  style={styles.thumbnailImage}
                />
                <View style={styles.imageOverlay}>
                  <Text style={styles.imageAngle}>
                    {Math.round(normalizeAngle(item.rotation.gamma))}°
                  </Text>
                  <Pressable
                    onPress={() => deleteCapture(index)}
                    style={styles.deleteButton}
                  >
                    <MaterialIcons name="delete" size={20} color="white" />
                  </Pressable>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );

  return (
    <Modal style={styles.container} visible={visible} animationType="fade">
      {showGallery ? (
        renderGallery()
      ) : (
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <SafeAreaView style={styles.safeArea}>
            {/* Status message */}
            <View style={styles.statusContainer}>
              <Text
                style={[
                  styles.message,
                  readyToCapture ? { color: "lime" } : { color: "white" },
                ]}
              >
                {readyToCapture
                  ? "✅ Parfait !"
                  : captureMode === "auto"
                  ? `Positionnez l'appareil à ${capturePositions[currentPositionIndex]}°`
                  : "Alignez l'appareil et prenez une photo"}
              </Text>

              <Text style={styles.captureCounter}>
                {captures.length}/8 captures
              </Text>
            </View>

            {/* Guidance circle */}
            <View style={styles.guidanceContainer}>
              <CircularProgress
                value={progressValue}
                radius={50}
                inActiveStrokeColor={Colors.light}
                activeStrokeColor={Colors.primary}
                inActiveStrokeOpacity={1}
                progressValueColor={Colors.primary}
                duration={300}
              />

              <View
                style={[
                  styles.filledCircle,
                  {
                    transform: [{ translateY: rotation.alpha / 2 }],
                    backgroundColor: isStraight ? Colors.primary : "white",
                  },
                ]}
              />
            </View>

            {/* Capture button (manual mode only) */}
            {captureMode === "manual" && (
              <Pressable
                onPress={handleCapture}
                style={[
                  styles.captureButton,
                  readyToCapture ? styles.captureButtonReady : {},
                ]}
              >
                <View style={styles.captureButtonInner} />
              </Pressable>
            )}

            {/* Controls */}
            <View style={styles.controlsContainer}>
              <Pressable
                onPress={toggleCameraType}
                style={styles.controlButton}
              >
                <MaterialIcons name="flip-camera-ios" size={28} color="white" />
              </Pressable>

              <Pressable
                onPress={toggleCaptureMode}
                style={styles.controlButton}
              >
                <MaterialIcons
                  name={captureMode === "auto" ? "touch-app" : "auto-awesome"}
                  size={28}
                  color="white"
                />
                <Text style={styles.controlLabel}>
                  {captureMode === "auto" ? "Manuel" : "Auto"}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setShowGallery(true)}
                style={styles.controlButton}
              >
                <MaterialIcons name="photo-library" size={28} color="white" />
                <Text style={styles.controlLabel}>Galerie</Text>
              </Pressable>
            </View>
          </SafeAreaView>

          {/* Close button */}
          <Pressable
            onPress={() => setVisible(false)}
            style={styles.closeButton}
          >
            <Entypo name="cross" size={30} color="white" />
          </Pressable>

          {/* Compass/rotation guide */}
          {/* <View style={styles.compassContainer}>
            <View style={styles.compass}>
              {capturePositions.map((position, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.compassMarker,
                    { transform: [{ rotate: `${position}deg` }] },
                    currentPositionIndex === index ? styles.compassMarkerActive : {},
                    captures.some(c => Math.abs(c.position - position) < 10) ? styles.compassMarkerCaptured : {}
                  ]}
                />
              ))}
              <View 
                style={[
                  styles.compassNeedle,
                  { transform: [{ rotate: `${normalizeAngle(rotation.gamma)}deg` }] }
                ]} 
              />
            </View>
          </View> */}
        </CameraView>
      )}
    </Modal>
  );
};

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
  statusContainer: {
    position: "absolute",
    top: 100,
    alignItems: "center",
  },
  message: {
    fontSize: 16,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 5,
  },
  captureCounter: {
    color: "white",
    fontSize: 14,
    marginTop: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 5,
    borderRadius: 5,
  },
  guidanceContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  filledCircle: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "white",
    zIndex: 10,
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 25,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
  },
  captureButton: {
    position: "absolute",
    bottom: 100,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderWidth: 2,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  captureButtonReady: {
    backgroundColor: "rgba(0,255,0,0.3)",
    borderColor: "#00ff00",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
  controlsContainer: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 30,
  },
  controlButton: {
    alignItems: "center",
    padding: 10,
  },
  controlLabel: {
    color: "white",
    marginTop: 5,
    fontSize: 12,
  },
  compassContainer: {
    position: "absolute",
    bottom: 200,
    alignSelf: "center",
  },
  compass: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  compassMarker: {
    position: "absolute",
    width: 8,
    height: 15,
    borderRadius: 3,
    backgroundColor: "white",
    top: 10,
    left: "50%",
    marginLeft: -4,
  },
  compassMarkerActive: {
    backgroundColor: Colors.primary,
    height: 20,
  },
  compassMarkerCaptured: {
    backgroundColor: "lime",
  },
  compassNeedle: {
    width: 4,
    height: 60,
    backgroundColor: "red",
    borderRadius: 2,
  },
  galleryContainer: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  galleryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 20,
    marginVertical: 20,
  },
  galleryTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyGallery: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: "48%",
    aspectRatio: 1,
    margin: "1%",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  imageAngle: {
    color: "white",
    fontWeight: "bold",
  },
  deleteButton: {
    padding: 5,
  },
});

export default PanoramaCapture;
