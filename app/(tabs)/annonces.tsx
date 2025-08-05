import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import Data_Appartements from "@/Data/data-appartements.json";

import { AnnonceItem } from "@/Components/AnnonceItem";
import { useRouter } from "expo-router";
import { Colors } from "@/Components/Colors";
import { FontAwesome6 } from "@expo/vector-icons";

export default function Annonces() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Scrollable Section */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container_annonce}>
          {Data_Appartements.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.annonce}
              onPress={() => router.push(`/annonces/${item.id}`)}
            >
              <AnnonceItem item={item} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/*  Button */}

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/annonces/CreateAnnonce")}
      >
        <FontAwesome6 name="add" size={25} color="white" />
        <Text style={styles.text}>Creer une annonce</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  scrollContainer: {
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 100, // Pour éviter que les annonces ne soient cachées par le bouton
  },

  container_annonce: {
    flexDirection: "row",
    flexWrap: "wrap",
    //backgroundColor: "orange",
    gap: 20,
    justifyContent: "space-between",
  },

  annonce: {
    height: 185,
    width: "45%",
    // overflow: "hidden",
  },

  button: {
    borderRadius: 30,
    position: "absolute",
    zIndex: 20,
    bottom: 0,
    right: 10,
    width: 170,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 15,
    gap: 8,
    backgroundColor: Colors.primary,

    // Ombre pour iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,

    // Ombre pour Android
    elevation: 5,
  },

  text: {
    color: "white",
    fontWeight: "500",
    fontSize: 14,
  },
});
