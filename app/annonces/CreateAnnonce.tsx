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

const CreateAnnonce = () => {
  const [step, setStep] = useState<number>(1);
  const [modalVisible, setModalVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView | null>(null);

  // Fonction pour faire défiler le ScrollView vers un élément spécifique
  const scrollToInput = (yPosition: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: yPosition,
        animated: true,
      });
    }
  };

  const router = useRouter();

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

        {/* Section Button */}
        <View style={styles.container_button}>
          <TouchableOpacity
            style={[
              styles.button_precedent,
              step === 1 && styles.buttonDisabled,
            ]}
            disabled={step === 1}
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
                { color: step === 1 ? "gray" : Colors.dark },
              ]}
            >
              {step === 6 ? "Modifier" : "Précédent"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (step === 6) {
                setModalVisible(!modalVisible);
                // router.push("/(tabs)/annonces"); retour après l'animation
              } else {
                setStep(step + 1);
              }
            }}
          >
            <Text style={styles.buttonTextActive}>
              {step === 6 ? "Publier" : "Suivant"}
            </Text>
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

  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },

  buttonTextActive: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});
