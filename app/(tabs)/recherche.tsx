import { View, StyleSheet, SafeAreaView } from "react-native";
import { useState } from "react";
import { Colors } from "@/Components/Colors";

import Search from "@/Components/Search";

const Recherche = () => {
  const [searchQuery, setSearchQuery] = useState<string>(""); // Texte de la recherche
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Composant de recherche */}
        <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
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
