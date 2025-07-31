import { View, Text, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Data_Appartements from "@/Data/data-appartements.json";
import { AnnonceType } from "@/assets/Types/type";
import Detail_Annonce from "@/Components/Detail_Annonce";
import { Fontisto } from "@expo/vector-icons";
import { Colors } from "@/Components/Colors";

export default function Page_Detail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const Annonce_query: AnnonceType | undefined = Data_Appartements.find(
    (annonce) => annonce.id === Number(id)
  );

  // console.log(Annonce_query); // Vérifiez la structure de l'objet récupéré
  if (!Annonce_query) {
    return (
      <View style={styles.container}>
        <Text>Annonce introuvable</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Section Back */}
      <Pressable onPress={() => router.back()} style={styles.icone_back}>
        <Fontisto name="angle-left" size={15} color={Colors.primary} />
      </Pressable>
      <Detail_Annonce item={Annonce_query} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  icone_back: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: Colors.light,

    padding: 8,
    borderRadius: "100%",
    alignItems: "center",
    zIndex: 10,
  },
});
