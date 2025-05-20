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
import VirtualTourCreator from "@/Components/Annonces/VirtualTourCreator";


const CreateAnnonce = () => {
  const [step, setStep] = useState<number>(1);
  const [modalVisible, setModalVisible] = useState(false);

  const scrollViewRef = useRef<ScrollView | null>(null);

  // Fonction pour faire défiler le ScrollView vers un élément spécifique
  const scrollToInput = (reactNode: any) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: reactNode,
        animated: true,
      });
    }
  };
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Section Title */}
      <View style={styles.container_title}>
        <Pressable
          onPress={() => router.back()}
          style={{
            backgroundColor: Colors.light,
            padding: 8,
            alignItems: "center",
            borderRadius: "100%",
          }}
        >
          <Fontisto name="angle-left" size={15} color={Colors.primary} />
        </Pressable>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.title}>Nouvelle annonce</Text>
        </View>
      </View>

      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{ padding: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            {step === 1 && <Detail_CreateAnnonce  scrollToInput={scrollToInput}/>}
            {step === 2 && <Photos_CreateAnnonce />}
            {step === 3 && <Lieu_CreateAnnonce />}
            {step === 4 && <OtherInfos_CreateAnnonce />}

            {step === 5 && <VirtualSpace_CreateAnnonce />}
            
            {/* {step === 5 && <VirtualTourCreator />} */}

            {step === 6 && <Preview_CreateAnnonce />}
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Section Button */}
        <View style={styles.container_button}>
          <TouchableOpacity
            style={styles.button_precedent}
            disabled={step === 1}
            onPress={() => {
              if (step === 6) {
                setStep(1);
              } else {
                setStep(step - 1);
              }
            }}
          >
            <Text style={{ color: Colors.dark, fontSize: 15 }}>
              {step === 6 ? "Modifier" : "Precedent"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (step === 6) {
                setModalVisible(!modalVisible);
                router.push("/(tabs)/annonces");
              } else {
                setStep(step + 1);
              }
            }}
          >
            <Text style={{ color: "white", fontSize: 15 }}>
              {step === 6 ? "Publier" : "Suivant"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Final_CreateAnnonce
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </SafeAreaView>
  );
};

export default CreateAnnonce;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "orange",
    // borderWidth:1,
    padding: 20,
    justifyContent: "space-between",
    gap: 30,
  },

  container_title: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "orange",
    padding: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  container_button: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
  },
  button_precedent: {
    backgroundColor: Colors.light,
    padding: 10,
    borderRadius: 5,
  },
});
