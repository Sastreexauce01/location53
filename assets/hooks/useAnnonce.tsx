import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAtom } from "jotai";
import { annonce_Atom } from "@/Data/Atoms";
import { AnnonceType } from "@/assets/Types/type";
import { useEffect, useRef, useCallback } from "react";

export const useAnnonce = () => {
  const [annonce, setAnnonce] = useAtom(annonce_Atom);
  const isInitialized = useRef(false);
  const isLoading = useRef(false);

  // Fonction pour sauvegarder l'annonce dans AsyncStorage
  const saveAnnonce = useCallback(async (newAnnonce: AnnonceType) => {
    try {
      // Éviter les sauvegardes pendant le chargement initial
      if (isLoading.current) {
        console.log('⏳ Skipping save during loading...');
        return;
      }

      console.log('💾 Saving annonce to storage...');
      setAnnonce(newAnnonce); // Met à jour Jotai
      await AsyncStorage.setItem("annonceData", JSON.stringify(newAnnonce));
      console.log('✅ Annonce saved successfully');
    } catch (error) {
      console.error("❌ Erreur lors de la sauvegarde :", error);
    }
  }, [setAnnonce]);

  // Fonction pour réinitialiser les données
  const resetAnnonce = useCallback(async () => {
    try {
      console.log('🔄 Resetting annonce...');
      await AsyncStorage.removeItem("annonceData");
      
      // Réinitialiser avec les valeurs par défaut de l'atom
      const defaultAnnonce: AnnonceType = {
        id: "1",
        nomAnnonce: "",
        typeAnnonce: "",
        categorie: "",
        description: "",
        image: [],
        adresse: "",
        coordonnee: { latitude: 6.3573, longitude: 2.4194 },
        prix: 0,
        nbre_chambre: 0,
        nbre_salle_bains: 0,
        accessibilite: [],
        virtualSpace: [],
        date_creation: new Date().toISOString(),
        id_agent: "",
      };
      
      setAnnonce(defaultAnnonce);
      console.log('✅ Annonce reset successfully');
    } catch (error) {
      console.error("❌ Erreur lors de la réinitialisation :", error);
    }
  }, [setAnnonce]);

  // Fonction pour mettre à jour un champ spécifique
  const updateField = useCallback(<K extends keyof AnnonceType>(
    field: K,
    value: AnnonceType[K]
  ) => {
    const updatedAnnonce = {
      ...annonce,
      [field]: value
    };
    saveAnnonce(updatedAnnonce);
  }, [annonce, saveAnnonce]);

  // ✅ CORRECTION : Charger les données UNE SEULE FOIS au montage
  useEffect(() => {
    const loadAnnonceData = async () => {
      if (isInitialized.current || isLoading.current) {
        console.log('⏭️ Loading skipped - already initialized or loading');
        return;
      }

      try {
        isLoading.current = true;
        console.log('📱 Loading annonce from AsyncStorage...');
        
        const savedAnnonce = await AsyncStorage.getItem("annonceData");
        
        if (savedAnnonce) {
          const parsedAnnonce = JSON.parse(savedAnnonce);
          console.log('✅ Loaded annonce from storage:', parsedAnnonce.nomAnnonce || 'No name');
          setAnnonce(parsedAnnonce);
        } else {
          console.log('ℹ️ No saved annonce found in storage');
        }
        
        isInitialized.current = true;
      } catch (error) {
        console.error("❌ Erreur lors du chargement :", error);
      } finally {
        isLoading.current = false;
      }
    };

    loadAnnonceData();
  }, [setAnnonce]); // ✅ Tableau vide pour éviter la boucle

  // Fonction pour vérifier si les données sont chargées
  const isDataLoaded = isInitialized.current && !isLoading.current;

  // Debug info (à retirer en production)
  const debugInfo = {
    isInitialized: isInitialized.current,
    isLoading: isLoading.current,
    hasAnnonce: !!annonce,
    annonceId: annonce?.id,
  };

  // Ne logguer qu'une fois par seconde pour éviter le spam
  const logDebounced = useRef(false);
  if (!logDebounced.current) {
    console.log('🔍 useAnnonce debug:', debugInfo);
    logDebounced.current = true;
    setTimeout(() => {
      logDebounced.current = false;
    }, 1000);
  }

  return { 
    annonce, 
    saveAnnonce, 
    resetAnnonce, 
    updateField,
    isDataLoaded,
    debugInfo // Retirez ceci en production
  };
};