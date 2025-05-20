import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Data_Appartements from "@/Data/data-appartements.json";
import Button from "@/Components/Annonces/Button";
import { AnnonceItem } from "@/Components/AnnonceItem";
import { useRouter } from "expo-router";

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

      {/* Fixed Button */}
      <View style={styles.buttonContainer}>
        <Button />
      </View>
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
    width: '45%',
    // overflow: "hidden",
  },

  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 10,
    alignItems: "center",
  },
});
