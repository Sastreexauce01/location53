import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";

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

       
         {/* Composant de recherche */}
          <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* Section Button Rechercher */}
        <TouchableOpacity
          style={[
            styles.button,
            searchQuery.length < 3 && styles.buttonDisabled,
          ]}
          disabled={searchQuery.length < 1}
          onPress={() =>
            router.push(
              `/annonces/SearchResults?query=${encodeURIComponent(searchQuery)}`
            )
          } // Navigation avec paramètre /Screen/annonces/SearchResults?query=${searchQuery}
        >
          <Text style={styles.buttonText}>Rechercher</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Recherche;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
    justifyContent: "space-between",
  },

  container_search: {
    gap: 50,
    //  backgroundColor: Colors.light,
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
    borderRadius: 50,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
