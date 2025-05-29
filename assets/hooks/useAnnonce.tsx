import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAtom } from "jotai";
import { annonce_Atom } from "@/Data/Atoms";
import { AnnonceType } from "@/assets/Types/type";
import { useEffect } from "react";

export const useAnnonce =  () => {

  const [annonce, Setannonce] = useAtom(annonce_Atom);

  // Fonction pour sauvegarder l'annonce dans AsyncStorage
  const saveAnnonce = async (newAnnonce: AnnonceType) => {
    try {
      Setannonce(newAnnonce); // Met à jour Jotai
      await AsyncStorage.setItem("annonceData", JSON.stringify(newAnnonce)); // Sauvegarde dans AsyncStorage
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
    }
  };

  // Charger les données sauvegardées au démarrage
  useEffect(() => {
    const loadAnnonceData = async () => {
      try {
        const savedAnnonce = await AsyncStorage.getItem("annonceData");
        if (savedAnnonce) {
          Setannonce(JSON.parse(savedAnnonce));
        }
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      }
    };

    loadAnnonceData();
  }, [Setannonce]);

  return { annonce, saveAnnonce }  ;
};
