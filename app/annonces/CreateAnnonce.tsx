import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from "react-native";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useRouter } from "expo-router";
import { Colors } from "@/Components/Colors";
import Detail_CreateAnnonce from "@/Components/Annonces/Detail_CreateAnnonce";
import Photos_CreateAnnonce from "@/Components/Annonces/Photos_CreateAnnonce";
import Lieu_CreateAnnonce from "@/Components/Annonces/Lieu_CreateAnnonce";
import OtherInfos_CreateAnnonce from "@/Components/Annonces/OtherInfos_CreateAnnonce";
import VirtualSpace_CreateAnnonce from "@/Components/Annonces/VirtualSpace_CreateAnnonce";
import Preview_CreateAnnonce from "@/Components/Annonces/Preview_CreateAnnonce";
import { useRef, useState } from "react";
import Final_CreateAnnonce from "@/Components/Annonces/Final_CreateAnnonce";
import useAuth from "@/assets/hooks/useAuth";
import { useAnnonce } from "@/assets/hooks/useAnnonce";
import { supabase } from "@/utils/supabase";
import * as FileSystem from "expo-file-system";

const CreateAnnonce = () => {
  const [step, setStep] = useState<number>(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // État de soumission
  const scrollViewRef = useRef<ScrollView | null>(null);
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const { annonce, resetAnnonce } = useAnnonce();

  // Écran de chargement
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  // Si pas authentifié, ne rien afficher (redirection en cours)
  if (!isAuthenticated || !user) {
    return null;
  }
  // ========================================
  // 📤 FONCTION D'UPLOAD D'IMAGES
  // ========================================

  const uploadImageToStorage = async (
    imageUri: string,
    annonceId: string,
    isVirtual: boolean = false
  ) => {
    try {
      // Déterminer le bucket selon le type d'image
      const bucket = isVirtual ? "virtualspaces" : "annonces";

      // Générer un nom de fichier unique
      const fileExt = imageUri.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}.${fileExt}`;
      const filePath = `${user.id}/${annonceId}/${fileName}`;
      console.log(`📤 Upload vers ${bucket}/${filePath}`);

      // Lire le fichier local en base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convertir en Uint8Array
      const uint8Array = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

      // Upload vers Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, uint8Array, {
          contentType: `image/${fileExt}`,
          upsert: false,
        });
      console.log("✅ Donnee Data", data);

      if (error) {
        console.error(`❌ Erreur upload ${bucket}:`, error);
        throw error;
      }

      // Obtenir l'URL publique
      const { data: publicData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      console.log(`✅ Image uploadée: ${publicData.publicUrl}`);
      return publicData.publicUrl;
    } catch (error) {
      console.error("❌ Erreur upload image:", error);
      return null;
    }
  };

  // ========================================
  // 📝 FONCTION HANDLESUBMIT AVEC SUPABASE
  // ========================================

  const handlleSubmit = async () => {
    console.log("🔥 handleSubmit appelée");
    console.log("Données à envoyer ✅✅✅✅", annonce);

    // Validation des données obligatoires
    if (!annonce.nomAnnonce || !annonce.adresse || !annonce.prix) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("✅ Utilisateur authentifié:", user.email);

      // 1. Créer l'annonce d'abord (sans images)
      const annonceData = {
        nom_annonce: annonce.nomAnnonce,
        type_annonce: annonce.typeAnnonce,
        categorie: annonce.categorie,
        description: annonce.description,
        adresse: annonce.adresse,
        latitude: annonce.coordonnee?.latitude,
        longitude: annonce.coordonnee?.longitude,
        prix: annonce.prix,
        nbre_chambre: annonce.nbre_chambre,
        nbre_salle_bains: annonce.nbre_salle_bains,
        accessibilite: annonce.accessibilite || [],
        id_agent: user.id,
        images: [], // Vide pour l'instant
      };

      console.log("📝 Création annonce en BDD...");

      const { data: nouvelleAnnonce, error: annonceError } = await supabase
        .from("annonces")
        .insert(annonceData)
        .select()
        .single();

      if (annonceError) {
        console.error("❌ Erreur création annonce:", annonceError);
        throw new Error(`Erreur création annonce: ${annonceError.message}`);
      }

      console.log("✅ Annonce créée avec ID:", nouvelleAnnonce.id);

      // 2. Upload des images normales
      let imageUrls: string[] = [];
      if (annonce.image && annonce.image.length > 0) {
        console.log(`📸 Upload de ${annonce.image.length} images normales...`);

        const uploadPromises = annonce.image.map((imageUri) =>
          uploadImageToStorage(imageUri, nouvelleAnnonce.id, false)
        );

        const results = await Promise.allSettled(uploadPromises);
        imageUrls = results
          .filter((result) => result.status === "fulfilled" && result.value)
          .map((result) => (result as PromiseFulfilledResult<string>).value);

        console.log(`✅ ${imageUrls.length} images normales uploadées`);
      }

      // 3. Mettre à jour l'annonce avec les URLs des images
      if (imageUrls.length > 0) {
        const { error: updateError } = await supabase
          .from("annonces")
          .update({ images: imageUrls })
          .eq("id", nouvelleAnnonce.id);

        if (updateError) {
          console.error("❌ Erreur update images:", updateError);
          throw updateError;
        }
        console.log("✅ URLs images mises à jour dans l'annonce");
      }

      // 4. Upload et création des espaces virtuels (images 360°)
      if (annonce.virtualSpace && annonce.virtualSpace.length > 0) {
        console.log(
          `🌐 Upload de ${annonce.virtualSpace.length} espaces virtuels...`
        );

        for (const virtualSpace of annonce.virtualSpace) {
          // Upload de l'image 360°
          const virtualUrl = await uploadImageToStorage(
            virtualSpace.uri,
            nouvelleAnnonce.id,
            true
          );

          if (virtualUrl) {
            // Créer l'entrée dans virtual_spaces
            const { error: virtualError } = await supabase
              .from("virtual_spaces")
              .insert({
                annonce_id: nouvelleAnnonce.id,
                uri: virtualUrl,
                title: virtualSpace.title,
                description: virtualSpace.description,
              });

            if (virtualError) {
              console.error("❌ Erreur création virtual_space:", virtualError);
            } else {
              console.log(`✅ Espace virtuel créé: ${virtualSpace.title}`);
            }
          }
        }
      }

      // 5. Succès ! 🎉
      console.log("🎉 Annonce créée avec succès !");

      // Afficher l'animation de succès
      setModalVisible(true);

      // Programmer la redirection après l'animation
      setTimeout(() => {
        resetAnnonce();
        router.push("/(tabs)/annonces");
      }, 3000); // 3 secondes pour voir l'animation
    } catch (error: any) {
      console.error("❌ Erreur complète:", error);
      Alert.alert(
        "Erreur",
        `Impossible de créer l'annonce: ${error.message || "Erreur inconnue"}`
      );
    } finally {
      setIsSubmitting(false);
      resetAnnonce();
    }
  };

  // Fonction pour faire défiler le ScrollView vers un élément spécifique
  const scrollToInput = (yPosition: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: yPosition,
        animated: true,
      });
    }
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 1:
        return <Detail_CreateAnnonce scrollToInput={scrollToInput} />;
      case 2:
        return <Photos_CreateAnnonce />;
      case 3:
        return <Lieu_CreateAnnonce />;
      case 4:
        return <OtherInfos_CreateAnnonce />;
      case 5:
        return <VirtualSpace_CreateAnnonce />;
      case 6:
        return <Preview_CreateAnnonce />;
      default:
        return <Detail_CreateAnnonce scrollToInput={scrollToInput} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Section Title */}
      <View style={styles.container_title}>
        {/* back.... */}
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Fontisto name="angle-left" size={15} color={Colors.primary} />
        </Pressable>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Nouvelle annonce</Text>
        </View>
      </View>

      {/* Main Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {renderCurrentStep()}
        </ScrollView>

        {/* Section Button avec état de loading */}
        <View style={styles.container_button}>
          <TouchableOpacity
            style={[
              styles.button_precedent,
              (step === 1 || isSubmitting) && styles.buttonDisabled,
            ]}
            disabled={step === 1 || isSubmitting}
            onPress={() => {
              if (step === 6) {
                setStep(1);
              } else {
                setStep(step - 1);
              }
            }}
          >
            <Text
              style={[
                styles.buttonText,
                { color: step === 1 || isSubmitting ? "gray" : Colors.dark },
              ]}
            >
              {step === 6 ? "Modifier" : "Précédent"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonSubmitting]}
            disabled={isSubmitting}
            onPress={() => {
              if (step === 6) {
                handlleSubmit();
              } else {
                setStep(step + 1);
              }
            }}
          >
            {isSubmitting ? (
              <View style={styles.loadingButtonContainer}>
                <ActivityIndicator color="white" size="small" />
                <Text style={styles.buttonTextActive}>Publication...</Text>
              </View>
            ) : (
              <Text style={styles.buttonTextActive}>
                {step === 6 ? "Publier" : "Suivant"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Animation de fin */}
      <Final_CreateAnnonce
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </SafeAreaView>
  );
};

export default CreateAnnonce;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 25,
    backgroundColor: "white",
  },

  container_title: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
  },

  backButton: {
    backgroundColor: Colors.light,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    width: 36,
    height: 36,
  },

  titleContainer: {
    flex: 1,
    alignItems: "center",
    marginRight: 36, // Pour compenser le bouton retour
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.dark,
  },

  keyboardContainer: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 100,
  },

  container_button: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light,
    gap: 12,
  },

  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  button_precedent: {
    backgroundColor: Colors.light,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonSubmitting: {
    opacity: 0.8,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },

  buttonTextActive: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.gray,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },

  loadingButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
