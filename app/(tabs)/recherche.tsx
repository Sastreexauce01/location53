import { Text, View, StyleSheet, SafeAreaView, Pressable } from "react-native";

import Fontisto from "@expo/vector-icons/Fontisto";
import { useState } from "react";
import { Colors } from "@/Components/Colors";
import { useRouter } from "expo-router";
import Search from "@/Components/Search";

const Recherche = () => {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState<string>(""); // Texte de la recherche
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Première section */}

        <View style={styles.container_first}>
          {/* Section Title */}
          <View style={styles.container_title}>
            <Pressable onPress={() => router.back()}>
              <Fontisto name="angle-left" size={20} color={Colors.primary} />
            </Pressable>

            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={styles.title}>Destination</Text>
            </View>
          </View>

          {/* Composant de recherche */}
          <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </View>

        {/* Section Button Rechercher */}
        <Pressable
          style={[
            styles.button,
            searchQuery.length < 1 && styles.buttonDisabled,
          ]}
          disabled={searchQuery.length < 1}
          onPress={() =>
            router.push(
              `/annonces/SearchResults?query=${encodeURIComponent(searchQuery)}`
            )
          } // Navigation avec paramètre /Screen/annonces/SearchResults?query=${searchQuery}
        >
          <Text style={styles.buttonText}>Rechercher</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Recherche;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },

  container_first: {
    gap: 50,
  },

  container_title: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "500",
  },

  button: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    padding: 15,
    borderRadius: 20,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
