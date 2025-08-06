import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";

import Entypo from "@expo/vector-icons/Entypo";
import Acessibilite from "@/Components/Acessibilite";
import { Colors } from "@/Components/Colors";
import { AnnonceType } from "@/assets/Types/type";

import Image_Carousel from "./Image_Carousel";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type props = {
  item: AnnonceType;
};

const Detail_Annonce: React.FC<props> = ({ item }) => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Caroussel image */}
        <View style={styles.container_carousel}>
          <Image_Carousel item={item.image} />
        </View>

        <View style={styles.container_information}>
          <Text style={styles.title}>{item.nomAnnonce}</Text>

          <TouchableOpacity
            style={styles.virtualContainer}
            onPress={() =>
              router.push({
                pathname: `/virtual360/[id]`,
                params: { id: item.id },
              })
            }
          >
            <MaterialCommunityIcons name="rotate-360" size={32} color="white" />
            <Text style={styles.buttonText}>Visite virtuelle 360</Text>
          </TouchableOpacity>

          <View style={styles.container_adresse}>
            <Entypo name="location" size={24} color={Colors.primary} />
            <Text style={styles.adresse}>{item.adresse}</Text>
          </View>

          <View style={styles.container_accessibilite}>
            {Array.isArray(item.accessibilite) ? (
              item.accessibilite.map((acces, index) => (
                <Acessibilite acces={acces} key={index} />
              ))
            ) : (
              <Text>{item.accessibilite}</Text>
            )}
          </View>

          <View>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>

          <Text style={styles.date}>Publié le: {item.date_creation}</Text>
        </View>
      </ScrollView>

      <View style={styles.container_contact}>
        <Text style={styles.prix}>{item.prix} F CFA / mois</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            Linking.openURL(
              "https://wa.me/22990291067?text=Bonjour, je suis intéressé(e) par l'annonce."
            )
          }
        >
          <Text style={styles.buttonText}>Prendre contact</Text>
          <AntDesign name="arrowright" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Detail_Annonce;

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

  scrollContainer: {
    paddingBottom: 100,
  },
  container_carousel: {
    height: 450,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
  },

  noImageText: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
    marginTop: 20,
  },
  container_information: {
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.dark,
  },

  virtualContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 6,
  },

  container_adresse: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  adresse: {
    fontSize: 15,
  },
  container_accessibilite: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 40,
    rowGap: 20,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: "500",
    color: Colors.dark,
  },
  description: {
    fontSize: 14,
    color: "gray",
    lineHeight: 24,
    textAlign: "justify",
    paddingVertical: 10,
  },
  date: {
    fontSize: 14,
    color: "gray",
  },
  container_contact: {
    width: "100%",
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    height: 85,
    borderTopWidth: 0.5,
    borderColor: Colors.dark,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingBottom: 20,
  },
  prix: {
    color: Colors.dark,
    fontSize: 20,
    fontWeight: "500",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: Colors.primary,
    padding:8,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
