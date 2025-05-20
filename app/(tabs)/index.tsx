import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from "react-native";
import { Colors } from "@/Components/Colors";
import { useRouter } from "expo-router";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import AppartementList from "@/Components/home/AppartementList";
import DestinationList from "@/Components/home/DestinationList";


export default function Index() {
  const router = useRouter();
 
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: "white" }}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>

          {/* Section Input */}
          <Pressable
            style={styles.container_input}
            onPress={() => router.push("/annonces/SearchScreen")}
            // recherche
           // Précharge la page Screen/annonces/SearchScreen
          >
            <EvilIcons name="location" size={24} color={Colors.dark} />
            <View style={styles.input}>
              <Text style={{opacity:0.9, color:'grey'}}>Destinations...</Text>
            </View>
          
          </Pressable>

          {/* Section Appartement */}
          <View style={styles.container_Appartement}>
            <Text style={styles.sectionTitle}>Quelques propriétés</Text>
            <AppartementList />
            <Text style={styles.viewAll} onPress={()=>router.push("/(tabs)/favoris")}>Voir toutes les propriétés</Text>
          </View>

          {/* Section Destinations populaires */}
          <View style={styles.container_Destination}>
            <Text style={styles.sectionTitle}>
              Quelques Destinations Populaires
            </Text>
            <DestinationList />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch",
    padding: 15,
    backgroundColor: "white",
  },

  container_input: {
    flexDirection: "row",
    borderWidth: 0.5,
    alignItems: "center",
    borderRadius: 15,
    padding: 15,
    borderColor: Colors.dark,
    //backgroundColor: Colors.light,
    marginBottom: 20,
  },

  input: {
    paddingHorizontal: 10,
   // backgroundColor: Colors.light,
  },

  scrollContainer: {
    paddingBottom: 50, // Pour éviter que le contenu ne soit coupé
  },

  container_Appartement: {
    gap: 20,
    marginBottom: 30,
  },

  container_Destination: {
    gap: 20,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: 500,
    marginBottom: 10,
  },

  viewAll: {
    color: "blue",
    textAlign: "left",
    marginTop: 10,
    fontSize: 10,
  },

  linkContainer: {
    marginTop: 30,
    alignItems: "center",
  },

  link: {
    color: "blue",
    fontSize: 12,
    marginBottom: 10,
  },
});
