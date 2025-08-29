import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/Components/Colors";
import { useRouter } from "expo-router";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import AppartementList from "@/Components/home/AppartementList";
import DestinationList from "@/Components/home/DestinationList";
import useAnnonce_Data from "@/assets/hooks/useAnnonce_Data";
import Loading from "@/Components/Loading";
import { AntDesign } from "@expo/vector-icons";

export default function Index() {
  const { isLoadingAnnonces } = useAnnonce_Data();
  const router = useRouter();

  if (isLoadingAnnonces) return <Loading />;

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
            onPress={() => router.push("/(tabs)/recherche")}
          >
            <EvilIcons name="location" size={24} color={Colors.dark} />
            <View style={styles.input}>
              <Text style={{ opacity: 0.9, color: "grey" }}>
                Destinations...
              </Text>
            </View>
          </Pressable>

          {/* Section Appartement */}
          <View style={styles.container_Appartement}>
            <View style={styles.header}>
              <Text style={styles.sectionTitle}>Quelques propriétés</Text>
              <AntDesign name="arrowright" size={20} color="black" />
            </View>

            <AppartementList />
            <View>
              <TouchableOpacity
                onPress={() =>
                  //  router.push("/(tabs)/recherche")
                  router.push("/dashboard")
                }
              >
                <Text style={styles.viewAll}> Voir toutes les propriétés</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Section Destinations populaires */}
          <View style={styles.container_Destination}>
            <View style={styles.header}>
              <Text style={styles.sectionTitle}>
                Quelques Destinations Populaires
              </Text>

              <AntDesign name="arrowright" size={20} color="black" />
            </View>

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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
