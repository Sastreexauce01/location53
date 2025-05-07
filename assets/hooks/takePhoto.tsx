import { CameraView } from "expo-camera";
// import playSound from "./playSound";
import { RefObject } from 'react';

const takePhoto = async ( cameraRef: RefObject<CameraView | null>) => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          skipProcessing: true,
          base64: false,
        });
       
        console.log("📸 Photo capturée :", photo?.uri);

        
        // Tu peux enregistrer la photo, l’envoyer à un serveur, etc.
      } catch (error) {
        console.log("Erreur lors de la capture :", error);
      }
    }
  };
  
export default takePhoto